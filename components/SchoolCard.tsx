import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, ExternalLink, Share2 } from "lucide-react";


interface School {
  id: string;
  name: string;
  location: string;
  state: string;
  address: string;
  contactInfo: string;
  instructors: string[];
  website: string;
  danceStyles: string[];
  imageUrl: string;
  comment: string;
  googleReviewsUrl?: string;
  googleRating?: number;
  googleReviewsCount?: number;
  socialUrl?: string;
  googleMapLink?: string;
}

<CardFooter className="flex flex-col gap-2 pt-0">
  <div className="flex flex-col gap-2 mt-3">
    {school.website && (
      <Button
        className="w-full bg-primary hover:bg-primary/90 text-white text-xs h-8 flex items-center justify-center gap-2"
        onClick={(e) => {
          e.stopPropagation();
          window.open(school.website, '_blank');
        }}
      >
        <ExternalLink className="h-4 w-4" />
        <span>Visit Website</span>
      </Button>
    )}
    <div className="flex gap-2">
      {school.socialUrl && (
        <Button
          variant="outline"
          className="flex-1 border-primary text-primary hover:bg-primary/10 text-xs h-8 flex items-center justify-center gap-2"
          onClick={(e) => {
            e.stopPropagation();
            window.open(school.socialUrl, '_blank');
          }}
        >
          <Share2 className="h-4 w-4" />
          <span>Social</span>
        </Button>
      )}
      {school.googleMapLink && (
        <Button
          variant="outline"
          className="flex-1 border-primary text-primary hover:bg-primary/10 text-xs h-8 flex items-center justify-center gap-2"
          onClick={(e) => {
            e.stopPropagation();
            window.open(school.googleMapLink, '_blank');
          }}
        >
          <MapPin className="h-4 w-4" />
          <span>Map</span>
        </Button>
      )}
    </div>
  </div>
</CardFooter> 