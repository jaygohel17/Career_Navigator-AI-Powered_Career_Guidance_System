import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Compass, Sparkles, Target, TrendingUp, Brain } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="w-20 h-20 rounded-full bg-gradient-primary mx-auto flex items-center justify-center">
            <Compass className="w-10 h-10 text-primary-foreground" />
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Career Navigator
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover your ideal career path with AI-powered guidance, personalized recommendations, comprehensive aptitude assessments, and timed IQ tests
          </p>

          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/auth?tab=signup")} className="gap-2">
              <Sparkles className="w-5 h-5" />
              Get Started
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/auth?tab=login")}>
              Login
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            <div className="p-6 rounded-lg bg-card border">
              <Target className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">AI Recommendations</h3>
              <p className="text-sm text-muted-foreground">Get top 3 career matches based on your profile</p>
            </div>
            <div className="p-6 rounded-lg bg-card border">
              <Sparkles className="w-8 h-8 text-secondary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Aptitude Tests</h3>
              <p className="text-sm text-muted-foreground">Tailored assessments for your chosen career</p>
            </div>
            <div className="p-6 rounded-lg bg-card border">
              <Brain className="w-8 h-8 text-accent mx-auto mb-3" />
              <h3 className="font-semibold mb-2">IQ Test</h3>
              <p className="text-sm text-muted-foreground">Measure your cognitive abilities with timed assessments</p>
            </div>
            <div className="p-6 rounded-lg bg-card border">
              <TrendingUp className="w-8 h-8 text-success mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Progress Tracking</h3>
              <p className="text-sm text-muted-foreground">Monitor your career readiness over time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
