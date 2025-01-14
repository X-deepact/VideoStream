import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  LIVE_STREAM_SOFTWARE_PATH,
  LIVE_STREAM_WEBCAM_PATH,
} from '@/data/route';
import AppLayout from '@/layouts/AppLayout';
import LayoutHeading from '@/layouts/LayoutHeading';
import { useNavigate } from 'react-router-dom';
import { Blocks, Camera, LucideIcon, MoveRight } from 'lucide-react';

const title = 'Live Stream';

const streamOptions: {
  title: string;
  description: string;
  Icon: LucideIcon;
  funcKey: string;
}[] = [
  {
    title: 'Built-in Webcam',
    description:
      'No setup needed, go live effortlessly using your existing webcam.',
    Icon: Camera,
    funcKey: 'handleGoLiveWebcam',
  },
  {
    title: 'Streaming Software',
    description:
      'Additional software required, enhance your stream with overlays, graphics, and more.',
    Icon: Blocks,
    funcKey: 'handleGoLiveSoftware',
  },
];

const LiveStream = () => {
  const navigate = useNavigate();

  const handleGoLiveWebcam = () => navigate(LIVE_STREAM_WEBCAM_PATH);
  const handleGoLiveSoftware = () => navigate(LIVE_STREAM_SOFTWARE_PATH);

  const funcMap: Record<string, () => void> = {
    handleGoLiveWebcam,
    handleGoLiveSoftware,
  };

  const data = streamOptions.map((option) => ({
    ...option,
    func: funcMap[option.funcKey],
  }));

  return (
    <AppLayout>
      <LayoutHeading title={title} />

      <div className="flex justify-center items-center">
        <Card className="shadow-none border-none">
          <CardHeader className="px-0 pt-0">
            <CardTitle>Go Live</CardTitle>
            <CardDescription>Pick the type of stream to begin.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 px-0">
            {data.map((opt, index) => (
              <div
                className="flex items-start space-x-4 rounded-md border p-4"
                key={index}
              >
                {<opt.Icon />}
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {opt.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {opt.description}
                  </p>
                </div>
                <Button size="sm" onClick={opt.func}>
                  Go <MoveRight />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default LiveStream;
