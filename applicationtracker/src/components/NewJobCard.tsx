import LinkWarning from "./LinkWarning";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useState } from "react";

export type Tag = {
  title: string;
  variant: "default" | "applied" | "interview" | "offer" | "accepted" | "closed" | null | undefined;
};

type JobCardProps = {
  jobTitle: string;
  location: string;
  tags: Tag[];
  url: string;
  onFavoriteToggle?: (job: any) => void;
  isFavorited?: boolean;
  city: string;
  job_type: string | undefined
};
export default function JobCard({
  jobTitle,
  location,
  tags,
  url,
  onFavoriteToggle,
  isFavorited = false,
  city,
  job_type,
}: JobCardProps) {
  const job = {
    title: jobTitle,
    company: location,
    url,
    skills: tags.map((t) => t.title).join(", "),
    job_type: job_type,
    date_expiration: null,
    city: city,
    location: city
  };

  return (
    <div className="bg-white rounded-xl shadow border p-5 space-y-4 w-full min-w-xs max-w-xs">
      <div className="flex justify-between items-start">
        <div className="w-25 h-10 bg-muted rounded-md flex items-center justify-center text-sm font-medium">
          {job.city || 'Unknown'}
        </div>
        <Badge className="text-xs px-2 py-1" variant="applied"> {/* TODO edit to change variant  based on job type */}
            {job.job_type}
        </Badge>
      </div> 

      <div className="space-y-1">
        <h2 className="text-md font-semibold ">{jobTitle}</h2>
        <p className="text-sm">{location}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags
          .sort((t1: Tag, t2: Tag) => {
            if (t1.variant && !t2.variant) {
              return -1;
            } else {
              return 1;
            }
          })
          .map((tag, i) => (
            <Badge key={i} variant="applied" className="text-xs">
              {tag.title}
            </Badge>
          ))}
      </div>

      <div className="flex justify-end items-center pt-2">
        <div className="flex gap-2">
          <LinkWarning href={url} job={job}>
            <Button size="sm" className="text-xs px-4">
              Apply
            </Button>
          </LinkWarning>
          <Button size="sm" variant="outline" className="text-xs px-4"
            onClick={() => onFavoriteToggle?.(job)}
          >
            {isFavorited ? "Favorited" : "Favorite"}
          </Button>
        </div>
      </div>
    </div>
  );
}