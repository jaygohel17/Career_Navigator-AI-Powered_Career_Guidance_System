import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Compass, User as UserIcon, Briefcase, ClipboardList, Brain, TrendingUp, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TopBar } from "@/components/TopBar";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const menuItems = [
    {
      title: "Career Recommendations",
      description: "Get AI-powered career suggestions",
      icon: Briefcase,
      path: "/recommendations",
      gradient: "from-primary to-secondary",
    },
    {
      title: "Aptitude Test",
      description: "Take tests tailored to your career choice",
      icon: ClipboardList,
      path: "/aptitude-test",
      gradient: "from-secondary to-accent",
    },
    {
      title: "IQ Test",
      description: "Test your critical thinking abilities",
      icon: Brain,
      path: "/iq-test",
      gradient: "from-accent to-success",
    },
    {
      title: "Progress Tracking",
      description: "Monitor your career readiness journey",
      icon: TrendingUp,
      path: "/progress",
      gradient: "from-success to-warning",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <TopBar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Your Dashboard</h2>
          <p className="text-muted-foreground">Navigate your career journey with AI-powered tools</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {menuItems.map((item) => (
            <Card
              key={item.path}
              className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              onClick={() => navigate(item.path)}
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-4`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full">
                  Explore →
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
          <CardHeader>
            <div className="flex items-center gap-3">
              <HelpCircle className="w-6 h-6 text-accent" />
              <div>
                <CardTitle>Need Help?</CardTitle>
                <CardDescription>Learn how to make the most of Career Navigator</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => navigate("/help")}>
              View Help & FAQs
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
