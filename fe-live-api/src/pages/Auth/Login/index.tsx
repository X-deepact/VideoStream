import { buttonVariants } from '@/components/ui/button';
import { FEED_PATH, REGISTRATION_PATH } from '@/data/route';
import { siteData } from '@/data/site';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import UserAuthForm from './UserAuthForm';
import LoginBg from '@/assets/images/login-bg.jpg';
import PrivacyAndTerms from '../PrivacyAndTerms';

const Login = () => {
  return (
    <>
      <div className="container relative flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 md:min-h-screen">
        <Link
          to={REGISTRATION_PATH}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'absolute right-4 top-4 md:right-8 md:top-8'
          )}
        >
          Register
        </Link>
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
              <Link
                to={FEED_PATH}
                className="flex lg:hidden justify-center mb-5"
              >
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
              <h1 className="text-2xl font-semibold tracking-tight">
                Login to your account
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email or username and password below to login your
                account
              </p>
            </div>
            <UserAuthForm />
            <PrivacyAndTerms />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
