import FormErrorMessage from '@/components/FormErrorMsg';
import { Icons } from '@/components/Icons';
import RequiredInput from '@/components/RequiredInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { retrieveAuthToken } from '@/data/model/userAccount';
import { FORGOT_PASSWORD_PATH, FEED_PATH } from '@/data/route';
import { login, LoginError } from '@/services/auth';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

type LoginFormError = {
  loginFailure: boolean;
  usernameFailure: boolean;
  passwordFailure: boolean;
  blocked: boolean;
};

const UserAuthForm = () => {
  const navigate = useNavigate();

  const _inDirecting = useRef<boolean>(false);
  const _isMounted = useRef<boolean>(false);
  const usnInput = useRef<HTMLInputElement>(null);
  const pwdInput = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState<LoginFormError>({
    loginFailure: false,
    usernameFailure: false,
    passwordFailure: false,
    blocked: false,
  });

  const onUserLogin = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault();

    setIsLoading(true);
    const emailOrUsername = usnInput.current?.value || '';
    const password = pwdInput.current?.value || '';

    const { errors } = await login(emailOrUsername, password);
    if (!errors) {
      onAuthenticateCredentialSuccess();
    } else {
      const loginError: LoginFormError = {
        loginFailure: errors[LoginError.LOGIN_FAILED],
        usernameFailure: errors[LoginError.INVALID_USERNAME],
        passwordFailure: errors[LoginError.INVALID_PASSWORD],
        blocked: errors[LoginError.ACCOUNT_BLOCKED],
      };
      onAuthenticateCredentialFail(loginError);
    }
  };

  const onAuthenticateCredentialSuccess = (): void => {
    if (_isMounted.current) {
      directToApp();
      setIsLoading(false);
    }
  };

  const directToApp = useCallback((): void => {
    if (!_inDirecting.current) {
      _inDirecting.current = true;

      navigate(FEED_PATH);
    }
  }, [navigate]);

  const onAuthenticateCredentialFail = (error: LoginFormError): void => {
    if (_isMounted.current) {
      const { usernameFailure, passwordFailure, loginFailure, blocked } = error;
      setFormError((prevError: LoginFormError) => ({
        ...prevError,
        usernameFailure,
        passwordFailure,
        loginFailure,
        blocked,
      }));
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = retrieveAuthToken();
    if (token) directToApp();
  }, [directToApp]);

  useEffect(() => {
    _isMounted.current = true;

    return function clean() {
      _isMounted.current = false;

      setFormError({
        loginFailure: false,
        usernameFailure: false,
        passwordFailure: false,
        blocked: false,
      });
    };
  }, []);

  const handleUsernameChange = (): void => {
    const error = {
      usernameFailure: false,
      loginFailure: false,
      accountInactive: false,
      accountBlocked: false,
    };

    setFormError((prevState: LoginFormError) => ({
      ...prevState,
      ...error,
    }));
  };

  const handlePasswordChange = (): void => {
    const error = {
      passwordFailure: false,
      loginFailure: false,
      accountInactive: false,
      accountBlocked: false,
    };

    setFormError((prevState: LoginFormError) => ({
      ...prevState,
      ...error,
    }));
  };

  const { loginFailure, usernameFailure, passwordFailure, blocked } = formError;
  let invalidEmailError = null,
    invalidPasswordError = null,
    wrongCredentialError = null,
    blockedError = null;
  if (usernameFailure) invalidEmailError = <div>Email Required</div>;
  if (passwordFailure) invalidPasswordError = <div>Password Required</div>;
  if (blocked)
    blockedError = <div>You have been blocked. Try again later.</div>;
  if (loginFailure) {
    wrongCredentialError = <div>Invalid Email or Password!</div>;
    invalidEmailError = '';
    invalidPasswordError = '';
    blockedError = '';
  }

  const emailInputInvalid = usernameFailure || loginFailure;
  const passwordInputInvalid = passwordFailure || loginFailure;

  return (
    <div className="grid gap-6">
      <form onSubmit={onUserLogin}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label htmlFor="email">
              Email or Username <RequiredInput />
            </Label>
            <Input
              ref={usnInput}
              onChange={handleUsernameChange}
              id="email"
              placeholder="name@example.com"
              type="text"
              autoFocus
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              className={`${emailInputInvalid ? 'ring-red-500' : ''}`}
            />
            {invalidEmailError && (
              <FormErrorMessage message={invalidEmailError} />
            )}
          </div>
          <div className="grid gap-1 mt-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">
                Password <RequiredInput />
              </Label>

              <Link
                to={FORGOT_PASSWORD_PATH}
                className="text-xs hover:text-primary hover:underline underline-offset-2 cursor-pointer"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              ref={pwdInput}
              onChange={handlePasswordChange}
              id="password"
              placeholder="********"
              type="password"
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect="off"
              disabled={isLoading}
              className={`${passwordInputInvalid ? 'ring-red-500' : ''}`}
            />
            {invalidPasswordError && (
              <FormErrorMessage message={invalidPasswordError} />
            )}
            {blockedError && <FormErrorMessage message={blockedError} />}
            {wrongCredentialError && (
              <FormErrorMessage message={wrongCredentialError} />
            )}
          </div>
          <Button disabled={isLoading} className="mt-3">
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserAuthForm;
