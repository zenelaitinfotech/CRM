import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; 
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { User, Briefcase, FileText, X } from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [skillInput, setSkillInput] = useState("");
  const token = localStorage.getItem("token"); // assumes token is saved after login

  // Fetch profile from MySQL backend
  const fetchProfile = async () => {
    if (!token) return;

    try {
      const res = await fetch("/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUser(data);
      // Convert skills from comma-separated string to array
      setProfile({ ...data, skills: data.skills ? data.skills.split(",") : [] });
    } catch (err) {
      console.error(err);
      navigate("/"); // if error, go back home
    }
  };

  useEffect(() => {
    if (!token) navigate("/"); // redirect if not logged in
    else fetchProfile();
  }, []);

  if (!user || !profile) return <p className="text-center mt-10">Loading...</p>;

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !profile.skills.includes(s)) {
      setProfile({ ...profile, skills: [...profile.skills, s] });
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setProfile({ ...profile, skills: profile.skills.filter((s: string) => s !== skill) });
  };

  const handleSave = async () => {
    try {
      const skillsString = profile.skills.join(",");
      const res = await fetch("/api/auth/profile-update", { // you need to create this endpoint
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...profile, skills: skillsString }),
      });
      if (!res.ok) throw new Error("Save failed");
      toast({ title: "Profile Saved! ✅", description: "Your details have been updated successfully." });
    } catch (err) {
      console.error(err);
      toast({ title: "Error ❌", description: "Failed to save profile." });
    }
  };

  return (
    <div className="min-h-screen py-10">
      <div className="container mx-auto max-w-3xl px-4">
        <h1 className="mb-8 text-3xl font-bold">My <span className="text-primary">Profile</span></h1>

        {/* Personal */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-primary" /> Personal Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label>Full Name</Label>
              <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <Input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Phone</Label>
              <Input type="tel" value={profile.phone || ""} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Location</Label>
              <Input value={profile.location || ""} onChange={(e) => setProfile({ ...profile, location: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Date of Birth</Label>
              <Input type="date" value={profile.dob || ""} onChange={(e) => setProfile({ ...profile, dob: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        {/* Professional */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5 text-primary" /> Professional Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label>Current Job Title</Label>
              <Input value={profile.job_title || ""} onChange={(e) => setProfile({ ...profile, job_title: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Experience</Label>
              <Input value={profile.experience || ""} onChange={(e) => setProfile({ ...profile, experience: e.target.value })} />
            </div>
            <div className="col-span-full space-y-2">
              <Label>Skills</Label>
              <div className="flex gap-2">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                  placeholder="Add a skill and press Enter"
                />
                <Button type="button" onClick={addSkill} size="sm">Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((s: string) => (
                  <Badge key={s} variant="secondary" className="gap-1">
                    {s}
                    <button onClick={() => removeSkill(s)}><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Button size="lg" className="w-full" onClick={handleSave}>Save Profile</Button>
      </div>
    </div>
  );
}