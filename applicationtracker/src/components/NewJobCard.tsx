import { Badge } from "./ui/badge"
import { Button } from "./ui/button"


export type Tag = {
    title: string
    variant: "default" | "progress" | "urgent" | null | undefined
}

type JobCardProps = {
    jobTitle: string
    location: string
    tags: Tag[]
}
export default function JobCard({jobTitle, location, tags}:JobCardProps) {

    return(
        <div className="flex shadow-md/50 rounded-lg">
            <div className="flex flex-col items-start bg-card w-65 h-55 rounded-lg px-7 py-5 justify-start text-foreground">
                <h1 className="text-lg">{jobTitle}</h1>
                <p className="font-inter text-xs">{location}</p>
                <div className="pt-3 flex flex-row flex-wrap gap-1">
                    {
                        tags.sort((t1: Tag, t2: Tag)=>{
                            if(t1.variant && !t2.variant) {
                                return -1
                            } else {
                                return 1
                            }
                        }).map((tag)=> {
                            return <Badge variant={tag.variant}>{tag.title}</Badge>
                        })
                    }
                </div>
                {/* TODO: look at what onclick redicrection looks like w/shadcn */}
                <div className="flex items-end justify-start flex-row w-77 h-50">
                        <Button className="px-10 text-sm"> Apply </Button>
                </div>
            </div>
        </div>
    );
  }
  
