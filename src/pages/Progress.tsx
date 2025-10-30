import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, Award, FileText, Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TopBar } from "@/components/TopBar";

const ProgressPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    testsTaken: 0,
    avgScore: 0,
    iqTestsTaken: 0,
    avgIQ: 0,
    recommendations: 0,
  });
  const [testHistory, setTestHistory] = useState<any[]>([]);
  const [iqHistory, setIqHistory] = useState<any[]>([]);
  const [recentTests, setRecentTests] = useState<any[]>([]);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [testsRes, iqRes, recsRes] = await Promise.all([
        supabase.from("test_results").select("*").eq("user_id", user.id).order("completed_at", { ascending: false }),
        supabase.from("iq_test_results").select("*").eq("user_id", user.id).order("completed_at", { ascending: false }),
        supabase.from("career_recommendations").select("*").eq("user_id", user.id),
      ]);

      const tests = testsRes.data || [];
      const iqTests = iqRes.data || [];
      
      const avgScore = tests.length > 0 
        ? Math.round(tests.reduce((sum, t) => sum + (t.total_score / t.max_score) * 100, 0) / tests.length)
        : 0;

      const avgIQ = iqTests.length > 0
        ? Math.round(iqTests.reduce((sum, t) => sum + t.total_score, 0) / iqTests.length)
        : 0;

      setStats({
        testsTaken: tests.length,
        avgScore,
        iqTestsTaken: iqTests.length,
        avgIQ,
        recommendations: recsRes.data?.length || 0,
      });

      setRecentTests(tests.slice(0, 5));

      const chartData = tests.slice(0, 10).reverse().map((t, idx) => ({
        name: `Test ${idx + 1}`,
        score: Math.round((t.total_score / t.max_score) * 100),
        date: new Date(t.completed_at).toLocaleDateString(),
      }));
      setTestHistory(chartData);

      const iqChartData = iqTests.slice(0, 10).reverse().map((t, idx) => ({
        name: `IQ ${idx + 1}`,
        iq: t.total_score,
        date: new Date(t.completed_at).toLocaleDateString(),
      }));
      setIqHistory(iqChartData);

    } catch (error) {
      console.error("Failed to load progress:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <TopBar />
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Progress Tracking</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tests Taken</CardTitle>
              <Award className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.testsTaken}</div>
              <p className="text-xs text-muted-foreground">Total aptitude tests</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgScore}%</div>
              <p className="text-xs text-muted-foreground">Across all tests</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">IQ Tests Taken</CardTitle>
              <FileText className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.iqTestsTaken}</div>
              <p className="text-xs text-muted-foreground">Critical thinking tests</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average IQ</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgIQ || 'N/A'}</div>
              <p className="text-xs text-muted-foreground">IQ score average</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Career Options</CardTitle>
              <Target className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.recommendations}</div>
              <p className="text-xs text-muted-foreground">Recommended paths</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {testHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Aptitude Test Trend</CardTitle>
                <CardDescription>Your aptitude test performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={testHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} name="Score %" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {iqHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>IQ Test Trend</CardTitle>
                <CardDescription>Your IQ test performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={iqHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[85, 145]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="iq" stroke="hsl(var(--success))" strokeWidth={2} name="IQ Score" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>

        {recentTests.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Test Results</CardTitle>
              <CardDescription>Your latest aptitude test performances</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTests.map((test) => {
                  const percentage = Math.round((test.total_score / test.max_score) * 100);
                  return (
                    <div key={test.id} className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{test.career_title}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(test.completed_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">{percentage}%</p>
                          <p className="text-xs text-muted-foreground">
                            {test.total_score}/{test.max_score}
                          </p>
                        </div>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {stats.testsTaken === 0 && stats.iqTestsTaken === 0 && (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">
                No progress data yet. Start by taking a test!
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate("/recommendations")}>
                  Aptitude Test
                </Button>
                <Button onClick={() => navigate("/iq-test")} variant="outline">
                  IQ Test
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default ProgressPage;
