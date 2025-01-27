import React, { useEffect, useState } from 'react';
import DefaultImg from '@/assets/images/video-thumbnail.jpg';
import { fetchImageWithAuth } from '@/api/image';
import logger from '@/lib/logger';
import { Skeleton } from './ui/skeleton';

interface AuthImageProps {
  src: string;
  alt: string;
  isLive?: boolean;
  displayText?: string;
  className?: string;
  isThumbnail?: boolean;
}

const AuthImage = React.forwardRef<HTMLElement, AuthImageProps>(
  ({ src, alt, className, isThumbnail }, ref) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const loadImage = async () => {
        if (src) {
          try {
            setLoading(true);
            const blobUrl = await fetchImageWithAuth(src);
            setImageSrc(blobUrl);
            setLoading(false);
          } catch (e) {
            logger.error('Image fetch failed:', e);
            setError(true);
            setLoading(false);
          }
        }
      };

      loadImage();
    }, [src]);

    if (isThumbnail && loading)
      return <Skeleton className="h-full w-full bg-gray-700" />;

    return (
      <img
        ref={ref as React.Ref<HTMLImageElement>}
        src={error ? DefaultImg : imageSrc || DefaultImg}
        alt={alt}
        className={className}
      />
    );
  }
);

AuthImage.displayName = 'AuthImage';

export default AuthImage;
