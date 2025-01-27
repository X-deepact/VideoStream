import { LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FEED_PATH, LOGIN_PATH } from '@/data/route';
import { getFormattedDate } from '@/lib/date-time';
import { siteData } from '@/data/site';
import LoginBg from '@/assets/images/login-bg.jpg';

const LogoutPage = () => {
  const navigate = useNavigate();

  const handleGoToLoginPage = () => navigate(LOGIN_PATH);

  return (
    <div className="container relative flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 md:min-h-screen">
      <div
        className="relative hidden flex-col h-full bg-muted p-10 text-white dark:border-r lg:flex"
        style={{
          backgroundImage: `url(${LoginBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Link to={FEED_PATH}>
          <div className="relative z-20 flex items-center text-lg font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            {siteData.name}
          </div>
        </Link>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">&ldquo;{siteData.description}&rdquo;</p>
          </blockquote>
        </div>
      </div>
      <div className="px-8">
        <div className="mx-auto flex w-full flex-col h-screen justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <Link to={FEED_PATH} className="flex lg:hidden justify-center mb-5">
              <div className="relative z-20 flex items-center font-extrabold text-primary text-3xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-6 w-6"
                >
                  <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                </svg>
                {siteData.name}
              </div>
            </Link>
            <div className="bg-white dark:bg-white mx-auto grid w-full max-w-md gap-6 p-8 rounded-lg">
              <div className="text-center flex flex-col items-center justify-center">
                <div className="rounded-full p-3 bg-slate-200">
                  <LogOut className="h-6 w-6 text-black" />
                </div>
                <h1 className="text-3xl text-black font-bold mt-3">
                  Logged out
                </h1>
                <p className="text-balance text-muted-foreground mt-3">
                  You have logged out from the system <br />
                  at{' '}
                  <Badge variant="destructive">
                    {getFormattedDate(new Date(), true)}
                  </Badge>
                  .
                </p>
              </div>
              <Button onClick={handleGoToLoginPage}>Back to Login</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutPage;
