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
    url: string
}
export default function JobCard({jobTitle, location, tags, url}:JobCardProps) {

    return(
        <div className="flex">
            <div className="flex flex-col items-start bg-card w-90 h-50 rounded-lg px-7 py-5 justify-start text-white">
                <h1 className="font-lalezar text-lg">{jobTitle}</h1>
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
                <div className="flex items-end justify-end flex-row gap-3 font-lalezar w-77 h-50">
                        <Button> Update </Button>
                        <a href={url}>
                        <Button> Apply </Button>
                        </a>
                </div>
            </div>
        </div>
    );
  }
  
