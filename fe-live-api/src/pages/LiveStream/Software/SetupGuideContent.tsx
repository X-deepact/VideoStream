import { Link } from 'react-router-dom';
import { CheckCheck, CircleHelp, ExternalLink, Radio } from 'lucide-react';
import TooltipComponent from '@/components/TooltipComponent';

const SetupGuideContent = () => {
  return (
    <div className="mt-2 border rounded-md p-3">
      <ol className="list-decimal pl-5 space-y-4 leading-loose">
        <li>
          <div className="flex gap-2">
            Download a streaming software. Recommended:{' '}
            <Link
              to="https://obsproject.com/download"
              target="_blank"
              className="inline"
            >
              <div className="hover:underline underline-offset-4 text-primary flex items-center gap-1">
                OBS <ExternalLink className="w-4 h-4" />
              </div>
            </Link>
          </div>
        </li>
        <li>
          <div className="flex items-center">
            Click on{' '}
            <div className="rounded-full mx-2 bg-primary text-white flex gap-2 items-center px-2 py-1.5 text-xs">
              <Radio className="w-4 h-4" /> Start Stream
            </div>{' '}
            and fill necessary information.
          </div>
        </li>
        <li>
          Copy stream server
          <TooltipComponent
            align="center"
            text="stream server: starts with rtmp://..."
            children={<CircleHelp className="w-4 h-4 inline ml-1" />}
          />{' '}
          and stream key
          <TooltipComponent
            align="center"
            text="stream key: a 48-character-random string"
            children={<CircleHelp className="w-4 h-4 inline ml-1" />}
          />{' '}
          in the details and paste them into your streaming software.
        </li>
        <li>Start stream in your software.</li>
      </ol>
      <div className="mt-5 pt-3 text-green-600 border-t flex gap-2 items-start">
        <CheckCheck className="w-4 h-4" /> Your viewers will be able to find
        your stream once you go live.
      </div>
    </div>
  );
};

export default SetupGuideContent;
