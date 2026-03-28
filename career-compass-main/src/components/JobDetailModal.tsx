import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Job } from "@/data/jobs";
import { MapPin, IndianRupee, Briefcase, Calendar } from "lucide-react";

interface Props {
  job: Job | null;
  open: boolean;
  onClose: () => void;
  onApply: (job: Job) => void;
}

export default function JobDetailModal({ job, open, onClose, onApply }: Props) {
  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl text-primary">{job.title}</DialogTitle>
          <DialogDescription className="text-base">{job.company}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{job.location}</span>
            <span className="flex items-center gap-1"><IndianRupee className="h-4 w-4" />{job.salary}</span>
            <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" />{job.type}</span>
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />Posted {job.postedDate}</span>
          </div>

          <div>
            <h4 className="mb-2 font-semibold">Job Description</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{job.description}</p>
          </div>

          <div>
            <h4 className="mb-2 font-semibold">Requirements</h4>
            <div className="flex flex-wrap gap-2">
             {Array.isArray(job.requirements) && job.requirements.map((r) => (
  <Badge key={r} variant="secondary">{r}</Badge>
))}
            </div>
          </div>

          <Button className="w-full" onClick={() => onApply(job)}>Apply Now</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
