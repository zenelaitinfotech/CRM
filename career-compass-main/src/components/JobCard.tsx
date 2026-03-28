import { Job } from "@/data/jobs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Briefcase, IndianRupee } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Props {
  job: Job;
  onApply: (jobId: Job) => void;
  onView?: (jobId: Job) => void;
}

const typeColor: Record<string, string> = {
  "Full-time": "bg-primary text-primary-foreground",
  "Part-time": "bg-blue-600 text-white",
  Remote: "bg-orange-500 text-white",
  Internship: "bg-purple-600 text-white",
};

export default function JobCard({ job, onApply, onView }: Props) {
  return (
    <Card className="group transition-shadow hover:shadow-lg">
      <CardContent className="p-5">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div>
            <h3
              className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors cursor-pointer"
              onClick={() => onView?.(job)}
            >
              {job.title}
            </h3>
            <p className="text-sm text-muted-foreground">{job.company}</p>
          </div>
          <Badge className={typeColor[job.type] || ""}>{job.type}</Badge>
        </div>

        <div className="mb-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
          <span className="flex items-center gap-1"><IndianRupee className="h-3.5 w-3.5" />{job.salary}</span>
          <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{job.type}</span>
        </div>

        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{job.description}</p>

        <div className="flex gap-2">
          <Button size="sm" onClick={() => onApply(job)}>Apply Now</Button>
          <Button size="sm" variant="outline" onClick={() => onView?.(job)}>View Details</Button>
        </div>
      </CardContent>
    </Card>
  );
}
