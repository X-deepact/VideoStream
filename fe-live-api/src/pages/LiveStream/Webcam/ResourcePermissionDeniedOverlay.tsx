import { Button } from '@/components/ui/button';
import { VideoOff } from 'lucide-react';

interface ComponentProps {
  onGoBack: () => void;
}

const ResourcePermissionDeniedOverlay = (props: ComponentProps) => {
  const { onGoBack } = props;

  return (
    <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-black bg-opacity-75 z-50 text-white">
      <VideoOff className="w-10 h-10" />
      <h2 className="text-2xl font-bold mb-4 mt-5">Permissions Denied</h2>
      <p className="text-lg mb-6 text-center">
        To start streaming, you need to allow access to your camera and
        microphone.
      </p>
      <Button onClick={onGoBack} size="sm" variant="destructive">
        Go Back
      </Button>
    </div>
  );
};

export default ResourcePermissionDeniedOverlay;
