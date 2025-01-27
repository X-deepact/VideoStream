import { useState } from 'react';
import { getTimeAgoFormat } from '@/lib/date-time';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './ui/button';
import TooltipComponent from './TooltipComponent';
import { CategoryResponse } from '@/data/dto/category';
import { convertToHashtagStyle } from '@/lib/utils';
import VideoCategory from './VideoCategory';

interface ComponentProps {
  totalViews: number;
  description: string;
  categories: CategoryResponse[];
  createdAt: string;
}

const VideoDescriptionBox = (props: ComponentProps) => {
  const { totalViews, description, categories, createdAt } = props;

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="px-4 rounded-md bg-secondary/40 py-4 space-y-3">
      {/* Views and timestamp */}
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground text-sm">
          {totalViews ? totalViews.toLocaleString() : 0} views •{' '}
          {createdAt ? `Streamed ${getTimeAgoFormat(createdAt)}` : ''}
        </p>

        {/* Show more / lest button */}
        {description && description.split(' ').length > 30 && (
          <TooltipComponent
            align="center"
            text={isExpanded ? 'Show less' : 'Show more'}
            children={
              <Button
                variant="ghost"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-blue-500 text-sm"
              >
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            }
          />
        )}
      </div>

      <div className="border-t pt-3 flex gap-2">
        {categories?.map((category) => (
          <VideoCategory
            key={category.id}
            id={category.id}
            label={convertToHashtagStyle(category.name)}
          />
        ))}
      </div>

      {/* Description */}
      <div className="mt-2">
        <p
          className={`text-foreground text-sm leading-relaxed transition-all duration-300 ${
            isExpanded ? '' : 'line-clamp-3'
          }`}
        >
          {description}
        </p>
      </div>
    </div>
  );
};

export default VideoDescriptionBox;
