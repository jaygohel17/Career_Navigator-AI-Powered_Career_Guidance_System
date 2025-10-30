import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Sparkles, TrendingUp } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Career {
  title: string;
  confidence_score: number;
  description: string;
  required_skills: string[];
}

interface UserDetailsForm {
  skills: string;
  interests: string;
  qualification: string;
  education_background: string;
  work_style: string;
  age: string;
  gender: string;
}

const Recommendations = () => {
  const [loading, setLoading] = useState(false);
  const [careers, setCareers] = useState<Career[]>([]);
  const [showForm, setShowForm] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm<UserDetailsForm>();

  const generateRecommendations = async (formData: UserDetailsForm) => {
    setLoading(true);
    try {
      const profileData = {
        skills: formData.skills.split(',').map(s => s.trim()),
        interests: formData.interests.split(',').map(s => s.trim()),
        qualification: formData.qualification,
        education_background: formData.education_background,
        work_style: formData.work_style,
        age: parseInt(formData.age),
        gender: formData.gender,
      };

      console.log('Calling career-recommend function with:', profileData);

      const { data, error } = await supabase.functions.invoke("career-recommend", {
        body: { profileData },
      });

      console.log('Function response:', { data, error });

      if (error) {
        console.error('Edge Function error:', error);
        throw new Error(error.message || 'Failed to generate recommendations');
      }

      if (data.careers) {
        setCareers(data.careers);

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("career_recommendations").delete().eq("user_id", user.id);

          const recommendations = data.careers.map((career: Career, index: number) => ({
            user_id: user.id,
            career_title: career.title,
            confidence_score: career.confidence_score,
            description: career.description,
            required_skills: career.required_skills,
            ranking: index + 1,
          }));

          await supabase.from("career_recommendations").insert(recommendations);
        }

        toast({
          title: "Success!",
          description: "Your career recommendations have been generated.",
        });
        setShowForm(false);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectCareer = (career: Career) => {
    navigate("/aptitude-test", { state: { career } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <TopBar />
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Career Recommendations</h1>
            <p className="text-sm text-muted-foreground">AI-powered career suggestions based on your profile</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {showForm && careers.length === 0 ? (
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-primary mx-auto mb-4 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle>Generate Your Career Recommendations</CardTitle>
              <CardDescription>
                Enter your details below to get AI-powered career suggestions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(generateRecommendations)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills (comma-separated)</Label>
                  <Input
                    id="skills"
                    placeholder="e.g., JavaScript, React, Communication"
                    {...register("skills", { required: "Skills are required" })}
                  />
                  {errors.skills && <p className="text-sm text-destructive">{errors.skills.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interests">Interests (comma-separated)</Label>
                  <Input
                    id="interests"
                    placeholder="e.g., Technology, Design, Problem Solving"
                    {...register("interests", { required: "Interests are required" })}
                  />
                  {errors.interests && <p className="text-sm text-destructive">{errors.interests.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="qualification">Qualification</Label>
                    <Select onValueChange={(value) => register("qualification").onChange({ target: { value } })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select qualification" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High School">High School</SelectItem>
                        <SelectItem value="Associate Degree">Associate Degree</SelectItem>
                        <SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
                        <SelectItem value="Master's Degree">Master's Degree</SelectItem>
                        <SelectItem value="Doctorate">Doctorate</SelectItem>
                        <SelectItem value="Professional Degree">Professional Degree</SelectItem>
                        <SelectItem value="Vocational Training">Vocational Training</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.qualification && <p className="text-sm text-destructive">{errors.qualification.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="e.g., 25"
                      {...register("age", { required: "Age is required" })}
                    />
                    {errors.age && <p className="text-sm text-destructive">{errors.age.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select onValueChange={(value) => register("gender").onChange({ target: { value } })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Non-binary">Non-binary</SelectItem>
                      <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && <p className="text-sm text-destructive">{errors.gender.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="education_background">Education Background</Label>
                  <Textarea
                    id="education_background"
                    placeholder="Describe your educational background..."
                    {...register("education_background", { required: "Education background is required" })}
                  />
                  {errors.education_background && <p className="text-sm text-destructive">{errors.education_background.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="work_style">Work Style Preferences</Label>
                  <Textarea
                    id="work_style"
                    placeholder="e.g., Remote, Team-based, Independent..."
                    {...register("work_style", { required: "Work style is required" })}
                  />
                  {errors.work_style && <p className="text-sm text-destructive">{errors.work_style.message}</p>}
                </div>

                <Button type="submit" disabled={loading} size="lg" className="w-full">
                  {loading ? "Analyzing..." : "Generate Recommendations"}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">Your Top 3 Career Matches</h2>
                <p className="text-muted-foreground">Based on your details</p>
              </div>
              <Button variant="outline" onClick={() => setShowForm(true)} disabled={loading}>
                Enter New Details
              </Button>
            </div>

            <div className="space-y-6">
              {careers.map((career, index) => (
                <Card key={index} className="hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className="bg-gradient-primary">#{index + 1}</Badge>
                          <CardTitle>{career.title}</CardTitle>
                        </div>
                        <CardDescription>{career.description}</CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{career.confidence_score}%</div>
                        <div className="text-xs text-muted-foreground">Match Score</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Progress value={career.confidence_score} className="h-2 mb-2" />
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Required Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {career.required_skills.map((skill, idx) => (
                          <Badge key={idx} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div>

                    <Button onClick={() => selectCareer(career)} className="w-full">
                      Take Aptitude Test for {career.title}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Recommendations;
