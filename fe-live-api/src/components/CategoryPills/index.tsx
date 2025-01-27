import { CategoryResponse } from '@/data/dto/category';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface ComponentProps {
  isLoading: boolean;
  categories: CategoryResponse[];
  filteredCategory: CategoryResponse;
  categoryFetchError: string | null;
  onSelect: (category: CategoryResponse) => void;
}

const TRANSLATE_WIDTH = 200;

const CategoryPills: React.FC<ComponentProps> = React.memo(
  ({ categories, filteredCategory, onSelect }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [translateValue, setTranslateValue] = useState(0);
    const [isLeftHandlerVisible, setIsLeftHandlerVisible] = useState(false);
    const [isRightHandlerVisible, setIsRightHandlerVisible] = useState(false);

    useEffect(() => {
      if (!containerRef.current) return;

      const observer = new ResizeObserver((entries: ResizeObserverEntry[]) => {
        const container = entries[0].target;
        if (!container) return;

        setIsLeftHandlerVisible(translateValue > 0);
        setIsRightHandlerVisible(
          translateValue + container.clientWidth < container.scrollWidth
        );
      });

      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }, [categories, translateValue]);

    return (
      <div ref={containerRef} className="overflow-x-hidden relative">
        {/* categories */}
        <div
          className="flex whitespace-nowrap gap-2 transition-transform w-[max-content]"
          style={{ transform: `translateX(-${translateValue}px)` }}
        >
          {categories.map((category) => (
            <Button
              size="sm"
              key={category.id}
              variant={
                filteredCategory?.id === category.id
                  ? 'destructive'
                  : 'secondary'
              }
              className="py-1 px-3 whitespace-nowrap capitalize"
              onClick={() => onSelect(category)}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* left handler */}
        {isLeftHandlerVisible && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 bg-gradient-to-r dark:from-black from-white from-50% to-transparent w-24 h-full">
            <Button
              onClick={() => {
                setTranslateValue((translate) => {
                  const newTranslate = translate - TRANSLATE_WIDTH;
                  if (newTranslate <= 0) return 0;
                  return newTranslate;
                });
              }}
              variant="ghost"
              className="h-full aspect-square w-auto p-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* right handler */}
        {isRightHandlerVisible && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l dark:from-black from-white from-50% to-transparent w-24 h-full flex justify-end">
            <Button
              onClick={() => {
                setTranslateValue((translate) => {
                  if (!containerRef.current) return translate;

                  const newTranslate = translate + TRANSLATE_WIDTH;

                  const edge = containerRef.current?.scrollWidth; // scrollable width
                  const width = containerRef.current?.clientWidth; // visible width

                  if (newTranslate + width >= edge) return edge - width;
                  return newTranslate;
                });
              }}
              variant="ghost"
              className="h-full aspect-square w-auto p-1.5"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    );
  }
);

export default CategoryPills;
