import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { TopBar } from "@/components/TopBar";
import { Badge } from "@/components/ui/badge";

type Question = {
  question: string;
  options: { A: string; B: string; C: string; D: string };
  correct_answer: string;
};

type Section = {
  section_name: string;
  questions: Question[];
};

const AptitudeTest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const career = location.state?.career;
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<Section[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [score, setScore] = useState({ total: 0, sections: {} as Record<string, number> });

  useEffect(() => {
    if (career) {
      loadTest();
    }
  }, [career]);

  const loadTest = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke("generate-aptitude-test", {
        body: { careerTitle: career.title },
      });

      if (error) throw error;
      setSections(data.sections);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load test",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const allQuestions = sections.flatMap((s) => s.questions);
  const totalQuestions = allQuestions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    let totalScore = 0;
    const sectionScores: Record<string, number> = {};
    let questionIndex = 0;

    sections.forEach((section) => {
      let sectionScore = 0;
      section.questions.forEach((q) => {
        if (answers[questionIndex] === q.correct_answer) {
          sectionScore++;
          totalScore++;
        }
        questionIndex++;
      });
      sectionScores[section.section_name] = Math.round((sectionScore / section.questions.length) * 100);
    });

    setScore({ total: Math.round((totalScore / totalQuestions) * 100), sections: sectionScores });
    setShowResults(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("test_results").insert({
          user_id: user.id,
          career_title: career.title,
          total_score: totalScore,
          max_score: totalQuestions,
          section_scores: sectionScores,
          feedback: totalScore >= totalQuestions * 0.7 
            ? "Excellent performance! You show strong aptitude for this career." 
            : totalScore >= totalQuestions * 0.5
            ? "Good effort! Consider strengthening weak areas."
            : "Keep learning and improving. Focus on fundamentals.",
        });
      }
    } catch (error) {
      console.error("Failed to save results:", error);
    }
  };

  if (!career) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>No Career Selected</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/recommendations")}>Go to Recommendations</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
        <TopBar />
        <div className="flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Generating your personalized test...</p>
          </CardContent>
        </Card>
        </div>
      </div>
    );
  }

  if (showReview) {
    const allQuestions = sections.flatMap((s) => s.questions);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
        <TopBar />
        <header className="border-b bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setShowReview(false)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">Answer Review</h1>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <Card className="mb-6 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Answer Review</CardTitle>
              <CardDescription>Review your answers and the correct solutions</CardDescription>
            </CardHeader>
          </Card>

          <div className="space-y-4">
            {allQuestions.map((q, idx) => {
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
                      {Object.entries(q.options).map(([key, value]) => {
                        const isUserAnswer = userAnswer === key;
                        const isCorrectAnswer = q.correct_answer === key;

                        return (
                          <div
                            key={key}
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
                                <span className="font-medium mr-2">{key}.</span>
                                {value}
                              </span>
                              {isCorrectAnswer && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                              {isUserAnswer && !isCorrectAnswer && <XCircle className="w-5 h-5 text-red-500" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-6 flex gap-4">
            <Button
              onClick={() => setShowReview(false)}
              variant="outline"
              className="flex-1"
            >
              Back to Results
            </Button>
            <Button
              onClick={() => navigate("/recommendations")}
              className="flex-1"
            >
              Back to Careers
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
        <TopBar />
        <header className="border-b bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/recommendations")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">Test Results</h1>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Your Aptitude Score</CardTitle>
              <CardDescription>{career.title}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-6">
                <div className="text-5xl font-bold text-primary">{score.total}%</div>
                <p className="text-muted-foreground mt-2">Overall Score</p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Section Breakdown</h3>
                {Object.entries(score.sections).map(([section, percentage]) => (
                  <div key={section} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{section}</span>
                      <span className="font-medium">{percentage}%</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                ))}
              </div>

              <div className="pt-4 flex gap-3">
                <Button onClick={() => setShowReview(true)} variant="outline" className="flex-1">
                  Review Answers
                </Button>
                <Button onClick={() => navigate("/progress")} className="flex-1">
                  View Progress
                </Button>
                <Button onClick={() => navigate("/recommendations")} variant="outline" className="flex-1">
                  Back to Careers
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const currentQ = allQuestions[currentQuestion];
  const currentSectionIndex = sections.findIndex((s) => s.questions.includes(currentQ));
  const currentSection = sections[currentSectionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <TopBar />
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/recommendations")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Aptitude Test: {career.title}</h1>
            <p className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {totalQuestions}
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-6">
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <div className="text-sm text-muted-foreground mb-2">{currentSection.section_name}</div>
            <CardTitle className="text-lg">{currentQ.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup value={answers[currentQuestion] || ""} onValueChange={handleAnswer}>
              {Object.entries(currentQ.options).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent cursor-pointer">
                  <RadioGroupItem value={key} id={`option-${key}`} />
                  <Label htmlFor={`option-${key}`} className="flex-1 cursor-pointer">
                    <span className="font-medium mr-2">{key}.</span>
                    {value}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              {currentQuestion < totalQuestions - 1 ? (
                <Button onClick={handleNext} disabled={!answers[currentQuestion]} className="flex-1">
                  Next Question
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={Object.keys(answers).length !== totalQuestions} className="flex-1">
                  Submit Test
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AptitudeTest;
