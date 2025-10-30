import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, HelpCircle, User, Target, FileCheck, Brain, TrendingUp, Lock, Mail } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Help = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Help & FAQs</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Getting Started
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4">
              <User className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">1. Complete Your Profile</h3>
                <p className="text-sm text-muted-foreground">
                  Start by filling out your profile with accurate information about your education, qualifications, skills, and interests. 
                  Upload your resume in PDF format for better career matching. The more complete your profile, the more accurate your recommendations will be.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Target className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">2. Get AI-Powered Career Recommendations</h3>
                <p className="text-sm text-muted-foreground">
                  Navigate to the Career Recommendations section and click "Generate Recommendations". Our AI analyzes your profile and suggests 
                  the top 3 career paths that best match your qualifications, skills, and interests. Each recommendation includes a confidence score 
                  and required skills list.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <FileCheck className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">3. Take Aptitude Tests</h3>
                <p className="text-sm text-muted-foreground">
                  Choose a recommended career and take a personalized aptitude test. Each test contains 15 questions across 5 sections: 
                  Logical Reasoning, Domain Knowledge, Communication Skills, Creativity & Innovation, and Practical Application. 
                  Receive instant feedback with section-wise scoring.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Brain className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">4. Take IQ Tests</h3>
                <p className="text-sm text-muted-foreground">
                  Measure your cognitive abilities with timed IQ assessments. Each IQ test contains 10 challenging questions designed to 
                  evaluate your logical reasoning, pattern recognition, and problem-solving skills. Tests are timed to assess both accuracy 
                  and speed, providing you with a comprehensive cognitive ability score and detailed explanations for each answer.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <TrendingUp className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">5. Track Your Progress</h3>
                <p className="text-sm text-muted-foreground">
                  Monitor your career readiness journey in the Progress section. View your test history, average scores, 
                  performance trends over time, and identify areas for improvement. Track how your skills develop as you take more tests.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How accurate are the career recommendations?</AccordionTrigger>
                <AccordionContent>
                  Our AI-powered recommendation engine analyzes multiple factors including your education, skills, interests, and work style preferences. 
                  The confidence scores indicate how well each career matches your profile. Recommendations become more accurate as you complete 
                  your profile with detailed information and upload your resume.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Can I retake an aptitude test?</AccordionTrigger>
                <AccordionContent>
                  Yes! You can take aptitude tests as many times as you'd like. Each test generates new questions, so you'll get fresh content every time. 
                  Your progress tracking will show all your test attempts, helping you see improvement over time.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>What resume formats are supported?</AccordionTrigger>
                <AccordionContent>
                  Currently, we support PDF format for resume uploads. Make sure your resume is clear, well-formatted, and contains relevant 
                  information about your education, work experience, and skills. The AI will analyze your resume to provide better career matches 
                  and identify skill gaps.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>How is my data protected?</AccordionTrigger>
                <AccordionContent>
                  Your privacy and data security are our top priorities. All personal information is encrypted and securely stored. 
                  Your resume and profile data are only used to generate personalized recommendations and are never shared with third parties. 
                  You can update or delete your information at any time from your profile page.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>What if I don't agree with my recommendations?</AccordionTrigger>
                <AccordionContent>
                  Career recommendations are guidance based on data analysis, not absolute decisions. If you feel the recommendations don't align 
                  with your goals, try updating your profile with more detailed information about your interests and preferences. You can also 
                  explore different career options by taking aptitude tests for careers that interest you, regardless of the recommendations.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger>How often should I update my profile?</AccordionTrigger>
                <AccordionContent>
                  Update your profile whenever you acquire new skills, complete new courses, or your career interests change. 
                  Regular updates ensure that your career recommendations remain relevant and accurate. We recommend reviewing your profile 
                  at least once every few months.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Need More Help?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              If you have questions that aren't answered here, or if you're experiencing technical issues, 
              please don't hesitate to reach out to our support team.
            </p>
            <Button onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Help;
