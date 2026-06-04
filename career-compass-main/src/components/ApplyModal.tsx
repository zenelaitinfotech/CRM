import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { API_URL } from "../config";

interface Props {
  job: any;
  open: boolean;
  onClose: () => void;
}

export default function ApplyModal({ job, open, onClose }: Props) {
  const { profile, user } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [salary, setSalary] = useState("");
  const [resume, setResume] = useState<string>("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Auto-fill when opening
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setName(profile?.name || "");
      setEmail(profile?.email || "");
      setPhone(profile?.phone || "");
      setLocation(profile?.location || "");
      setResume(profile?.resumeName || "");
      setResumeFile(null);
    }
    if (!isOpen) onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to apply for this job.",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("jobId", job.id);
      formData.append("candidateId", user.id);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("location", location);
      formData.append("expectedSalary", salary);
      formData.append("coverLetter", coverLetter);
      formData.append("jobTitle", job.title);

      if (resumeFile) {
        formData.append("resume", resumeFile);
      }

      await axios.post(`${API_URL}/api/applications`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      toast({ title: "Application Submitted! 🎉", description: `You applied for ${job.title} at ${job.company}.` });
      onClose();
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Submission Failed",
        description: err.response?.data?.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-primary">Apply for {job.title}</DialogTitle>
          <DialogDescription>{job.company} · {job.location}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label>Full Name</Label>
              <Input required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Phone</Label>
              <Input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Location</Label>
              <Input required value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
          </div>

          <div className="space-y-1">
            <Label>Expected Salary</Label>
            <Input value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="e.g. ₹10,00,000 per annum" />
          </div>

          <div className="space-y-1">
            <Label>Cover Letter</Label>
            <Textarea rows={4} value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} placeholder="Tell us why you're a great fit for this role..." />
          </div>

          <div className="space-y-1">
            <Label>Resume / CV</Label>
            {resume && <p className="text-xs text-muted-foreground">Previously Attached: {resume}</p>}
            <Input type="file" accept=".pdf,.doc,.docx" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setResume(file.name);
                setResumeFile(file);
              }
            }} />
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Submitting Application..." : "Submit Application"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
