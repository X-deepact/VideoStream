import { Button } from '@/components/ui/button';
import { FEED_PATH } from '@/data/route';
import AppLayout from '@/layouts/AppLayout';
import { SquarePlay } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBackToHome = () => {
    navigate(FEED_PATH);
  };

  return (
    <AppLayout>
      <div className="child-center w-full">
        <div className="flex items-center justify-center min-h-[calc(100vh-6rem)]">
          <div className="flex flex-col items-center select-none">
            <h1 className="font-mono text-8xl text-slate-400">404</h1>
            <h1 className="mb-1 text-xl font-semibold">Page Not Found</h1>
            <span className="text-slate-500 text-center">
              The page you are looking for either does not exist or is
              unavailable.
            </span>
            <Button className="mt-5" onClick={handleGoBackToHome}>
              <SquarePlay /> Watch Videos
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default NotFound;
