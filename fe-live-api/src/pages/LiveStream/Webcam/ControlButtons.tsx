import { Button } from '@/components/ui/button';
import { Ban, CircleSlash, Mic, MicOff, Radio } from 'lucide-react';

interface ComponentProps {
  isMicOn: boolean;
  isStreamStarted: boolean;
  onToggleMic: () => void;
  onEndStream: () => void;
  onInitializeStreamModalToggle: () => void;
  onInitializeStreamCancel: () => void;
}

const ControlButtons = (props: ComponentProps) => {
  const {
    isMicOn,
    isStreamStarted,
    onToggleMic,
    onEndStream,
    onInitializeStreamModalToggle,
    onInitializeStreamCancel,
  } = props;

  return (
    <div className="flex gap-2">
      <Button
        onClick={onToggleMic}
        variant="ghost"
        size="sm"
        className="rounded-full px-2.5"
      >
        {isMicOn ? <Mic /> : <MicOff />}
      </Button>
      {isStreamStarted ? (
        <Button
          size="sm"
          variant="destructive"
          className="rounded-full"
          onClick={onEndStream}
        >
          <CircleSlash /> <span className="hidden md:inline">End Stream</span>
        </Button>
      ) : (
        <div className="flex gap-2">
          <Button
            size="sm"
            className="rounded-full"
            onClick={onInitializeStreamModalToggle}
          >
            <Radio /> Start Stream
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="rounded-full"
            onClick={onInitializeStreamCancel}
          >
            <Ban /> Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

export default ControlButtons;
