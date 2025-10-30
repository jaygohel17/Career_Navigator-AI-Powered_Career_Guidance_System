import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Brain, CheckCircle2, XCircle, Clock } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { Badge } from "@/components/ui/badge";

type Question = {
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
};

const IQTest = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (questions.length > 0 && !showResults && !showReview) {
      setTimeLeft(30);
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleNext();
            return 30;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentQuestionIndex, questions.length, showResults, showReview]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
    }
  };

  const loadTest = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-iq-test");

      if (error) throw error;

      setQuestions(data.questions);
      setCurrentQuestionIndex(0);
      setAnswers({});
      setShowResults(false);
    } catch (error) {
      console.error("Error loading IQ test:", error);
      toast({
        title: "Error",
        description: "Failed to load IQ test. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (optionIndex: number) => {
    setAnswers({ ...answers, [currentQuestionIndex]: optionIndex });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(30);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    const calculatedScore = questions.reduce((acc, q, idx) => {
      return acc + (answers[idx] === q.correct_answer ? 1 : 0);
    }, 0);

    // Calculate IQ score (85-145 range based on performance)
    // 0% = 85, 50% = 100, 100% = 145
    const percentage = calculatedScore / questions.length;
    const iqScore = Math.round(85 + (percentage * 60));

    setScore(iqScore);
    setShowResults(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let feedback = "";
      
      if (iqScore >= 130) {
        feedback = "Exceptional! You have outstanding critical thinking abilities.";
      } else if (iqScore >= 115) {
        feedback = "Great job! Your logical reasoning skills are strong.";
      } else if (iqScore >= 100) {
        feedback = "Good effort! Keep practicing to improve your critical thinking.";
      } else {
        feedback = "Keep learning! Practice more to enhance your reasoning abilities.";
      }

      await supabase.from("iq_test_results").insert({
        user_id: user.id,
        total_score: iqScore,
        max_score: 145,
        feedback: feedback,
      });

      toast({
        title: "Test Completed",
        description: `Your IQ score of ${iqScore} has been saved.`,
      });
    } catch (error) {
      console.error("Error saving results:", error);
    }
  };

  const progress = questions.length > 0 
    ? ((currentQuestionIndex + 1) / questions.length) * 100 
    : 0;

  const currentQuestion = questions[currentQuestionIndex];
  const isAnswered = answers[currentQuestionIndex] !== undefined;
  const allAnswered = questions.length > 0 && 
    Object.keys(answers).length === questions.length;

  if (showReview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <TopBar />
        <div className="max-w-4xl mx-auto p-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <Card className="mb-6 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Answer Review</CardTitle>
              <CardDescription>Review your answers and the correct solutions</CardDescription>
            </CardHeader>
          </Card>

          <div className="space-y-4">
            {questions.map((q, idx) => {
              const userAnswer = answers[idx];
              const isCorrect = userAnswer === q.correct_answer;

              return (
                <Card key={idx} className={`border-2 ${isCorrect ? "border-green-500/50" : "border-red-500/50"}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">Question {idx + 1}</CardTitle>
                      {isCorrect ? (
                        <Badge className="bg-green-500">
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Correct
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <XCircle className="w-4 h-4 mr-1" />
                          Incorrect
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="font-medium">{q.question}</p>
                    
                    <div className="space-y-2">
                      {q.options.map((option, optIdx) => {
                        const isUserAnswer = userAnswer === optIdx;
                        const isCorrectAnswer = q.correct_answer === optIdx;

                        return (
                          <div
                            key={optIdx}
                            className={`p-3 rounded-lg border-2 ${
                              isCorrectAnswer
                                ? "border-green-500 bg-green-500/10"
                                : isUserAnswer
                                ? "border-red-500 bg-red-500/10"
                                : "border-muted"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>
                                <span className="font-medium mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                                {option}
                              </span>
                              {isCorrectAnswer && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                              {isUserAnswer && !isCorrectAnswer && <XCircle className="w-5 h-5 text-red-500" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm font-semibold mb-1">Explanation:</p>
                      <p className="text-sm text-muted-foreground">{q.explanation}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-6 flex gap-4">
            <Button
              onClick={() => {
                setQuestions([]);
                setAnswers({});
                setShowResults(false);
                setShowReview(false);
              }}
              variant="outline"
              className="flex-1"
            >
              Take Another Test
            </Button>
            <Button
              onClick={() => navigate("/progress")}
              className="flex-1"
            >
              View Progress
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <TopBar />
        <div className="max-w-2xl mx-auto p-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <Card className="border-primary/20">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Brain className="h-12 w-12 text-primary" />
                </div>
              </div>
              <CardTitle className="text-3xl">IQ Test</CardTitle>
              <CardDescription className="text-lg">
                Test your critical thinking and logical reasoning abilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 p-6 rounded-lg">
                <h3 className="font-semibold mb-2">About this test:</h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>10 multiple-choice questions</li>
                  <li>Tests logical reasoning, pattern recognition, and problem-solving</li>
                  <li>Questions are unique and different every time you take the test</li>
                  <li>No time limit - take your time to think</li>
                  <li>Your results will be saved automatically</li>
                </ul>
              </div>

              <Button
                onClick={loadTest}
                disabled={loading}
                size="lg"
                className="w-full"
              >
                {loading ? "Loading Test..." : "Start IQ Test"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <TopBar />
        <div className="max-w-2xl mx-auto p-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <Card className="border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Test Results</CardTitle>
              <CardDescription>Your IQ test performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-6xl font-bold text-primary mb-2">
                  {score}
                </div>
                <p className="text-xl mb-2">IQ Score</p>
                <p className="text-muted-foreground">
                  {score >= 130 ? "Exceptional! You have outstanding critical thinking abilities." :
                   score >= 115 ? "Great job! Your logical reasoning skills are strong." :
                   score >= 100 ? "Good effort! Keep practicing to improve your critical thinking." :
                   "Keep learning! Practice more to enhance your reasoning abilities."}
                </p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-center text-muted-foreground">
                  IQ scores range from 85-145. Average score is 100.
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => setShowReview(true)}
                  variant="outline"
                  className="flex-1"
                >
                  Review Answers
                </Button>
                <Button
                  onClick={() => {
                    setQuestions([]);
                    setAnswers({});
                    setShowResults(false);
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Take Another Test
                </Button>
                <Button
                  onClick={() => navigate("/progress")}
                  className="flex-1"
                >
                  View Progress
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <TopBar />
      <div className="max-w-2xl mx-auto p-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <CardTitle className="text-2xl">
                Question {currentQuestionIndex + 1} of {questions.length}
              </CardTitle>
              <div className="flex items-center gap-4">
                <Badge variant={timeLeft <= 10 ? "destructive" : "secondary"} className="text-base px-3 py-1">
                  <Clock className="w-4 h-4 mr-1" />
                  {timeLeft}s
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {Object.keys(answers).length} answered
                </span>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-muted/50 p-6 rounded-lg">
              <p className="text-lg font-medium">{currentQuestion.question}</p>
            </div>

            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    answers[currentQuestionIndex] === idx
                      ? "border-primary bg-primary/10"
                      : "border-muted hover:border-primary/50"
                  }`}
                >
                  <span className="font-medium mr-2">{String.fromCharCode(65 + idx)}.</span>
                  {option}
                </button>
              ))}
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                variant="outline"
              >
                Previous
              </Button>

              {currentQuestionIndex < questions.length - 1 ? (
                <Button
                  onClick={handleNext}
                  disabled={!isAnswered}
                  className="ml-auto"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!allAnswered}
                  className="ml-auto"
                >
                  Submit Test
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IQTest;