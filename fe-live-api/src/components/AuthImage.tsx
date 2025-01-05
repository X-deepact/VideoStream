import React, { useEffect, useState } from 'react';
import DefaultImg from '@/assets/images/video-thumbnail.jpg';
import { fetchImageWithAuth } from '@/api/image';
import logger from '@/lib/logger';

interface AuthImageProps {
  src: string;
  alt: string;
  isLive?: boolean;
  displayText?: string;
  className?: string;
}

const AuthImage = React.forwardRef<HTMLElement, AuthImageProps>(
  ({ src, alt, className }, ref) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
      const loadImage = async () => {
        if (src) {
          try {
            const blobUrl = await fetchImageWithAuth(src);
            setImageSrc(blobUrl);
          } catch (e) {
            logger.error('Image fetch failed:', e);
            setError(true);
          }
        }
      };

      loadImage();
    }, [src]);

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
