import FormErrorMessage from '@/components/FormErrorMsg';
import { Icons } from '@/components/Icons';
import RequiredInput from '@/components/RequiredInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { retrieveAuthToken } from '@/data/model/userAccount';
import { FEED_PATH } from '@/data/route';
import { PasswordRules } from '@/data/validations';
import { register, RegisterError } from '@/services/auth';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type RegisterFormError = {
  emailFailure: boolean;
  usernameFailure: boolean;
  displayNameFailure: boolean;
  passwordFailure: boolean;
  confirmPasswordFailure: boolean;
  registerFailure: boolean;
  accountExisted: boolean;
};

const UserAuthForm = () => {
  const navigate = useNavigate();

  const _inDirecting = useRef<boolean>(false);
  const _isMounted = useRef<boolean>(false);
  const usnInput = useRef<HTMLInputElement>(null);
  const emailInput = useRef<HTMLInputElement>(null);
  const displayNameInput = useRef<HTMLInputElement>(null);
  const pwdInput = useRef<HTMLInputElement>(null);
  const confirmPwdInput = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState<RegisterFormError>({
    emailFailure: false,
    usernameFailure: false,
    displayNameFailure: false,
    passwordFailure: false,
    confirmPasswordFailure: false,
    registerFailure: false,
    accountExisted: false,
  });

  const onUserRegister = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault();

    setIsLoading(true);
    const email = emailInput.current?.value || '';
    const username = usnInput.current?.value || '';
    const displayName = displayNameInput.current?.value || '';
    const password = pwdInput.current?.value || '';
    const confirmPassword = confirmPwdInput.current?.value || '';

    const { errors, message } = await register({
      email,
      username,
      displayName,
      password,
      confirmPassword,
    });

    if (!errors && !message) {
      onAuthenticateCredentialSuccess();
    } else {
      if (errors || message) {
        const registerError: RegisterFormError = {
          emailFailure: errors?.[RegisterError.INVALID_EMAIL] || false,
          usernameFailure: errors?.[RegisterError.INVALID_USERNAME] || false,
          passwordFailure: errors?.[RegisterError.INVALID_PASSWORD] || false,
          confirmPasswordFailure:
            errors?.[RegisterError.INVALID_CONFIRM_PASSWORD] || false,
          displayNameFailure:
            errors?.[RegisterError.INVALID_DISPLAY_NAME] || false,
          registerFailure: errors?.[RegisterError.REGISTER_FAILED] || false,
          accountExisted:
            errors?.[RegisterError.ACCOUNT_EXISTED] ||
            message?.includes('exist') ||
            false,
        };
        onAuthenticateCredentialFail(registerError);
      }
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

  const onAuthenticateCredentialFail = (error: RegisterFormError): void => {
    if (_isMounted.current) {
      const {
        usernameFailure,
        emailFailure,
        displayNameFailure,
        passwordFailure,
        confirmPasswordFailure,
        registerFailure,
        accountExisted,
      } = error;
      setFormError((prevError: RegisterFormError) => ({
        ...prevError,
        usernameFailure,
        emailFailure,
        displayNameFailure,
        passwordFailure,
        confirmPasswordFailure,
        registerFailure,
        accountExisted,
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
        emailFailure: false,
        usernameFailure: false,
        displayNameFailure: false,
        passwordFailure: false,
        confirmPasswordFailure: false,
        registerFailure: false,
        accountExisted: false,
      });
    };
  }, []);

  const handleUsernameChange = (): void => {
    const error = {
      usernameFailure: false,
      registerFailure: false,
    };

    setFormError((prevState: RegisterFormError) => ({
      ...prevState,
      ...error,
    }));
  };

  const handleEmailChange = (): void => {
    const error = {
      emailFailure: false,
      registerFailure: false,
    };

    setFormError((prevState: RegisterFormError) => ({
      ...prevState,
      ...error,
    }));
  };

  const handleDisplayNameChange = (): void => {
    const error = {
      displayNameFailure: false,
      registerFailure: false,
    };

    setFormError((prevState: RegisterFormError) => ({
      ...prevState,
      ...error,
    }));
  };

  const handlePasswordChange = (): void => {
    const error = {
      passwordFailure: false,
      registerFailure: false,
    };

    setFormError((prevState: RegisterFormError) => ({
      ...prevState,
      ...error,
    }));
  };

  const handleConfirmPasswordChange = (): void => {
    const error = {
      confirmPasswordFailure: false,
      registerFailure: false,
    };

    setFormError((prevState: RegisterFormError) => ({
      ...prevState,
      ...error,
    }));
  };

  const {
    registerFailure,
    usernameFailure,
    displayNameFailure,
    emailFailure,
    passwordFailure,
    confirmPasswordFailure,
    accountExisted,
  } = formError;
  let invalidEmailError = null,
    invalidPasswordError = null,
    invalidConfirmPasswordError = null,
    invalidUsernameError = null,
    invalidDisplayNameError = null,
    accountExistedError = null,
    somethingWrongError = null;
  if (emailFailure) invalidEmailError = <div>Email Required</div>;
  if (usernameFailure) invalidUsernameError = <div>Username Required</div>;
  if (passwordFailure)
    invalidPasswordError = (
      <div>Password Required, min {PasswordRules.min} characters.</div>
    );
  if (confirmPasswordFailure)
    invalidConfirmPasswordError = <div>Passwords should be matched</div>;
  if (displayNameFailure)
    invalidDisplayNameError = (
      <div>Display Name Required, cannot include -</div>
    );
  if (accountExisted) accountExistedError = <div>Account already existed</div>;
  if (registerFailure) {
    somethingWrongError = <div>Something went wrong!</div>;
    invalidEmailError = '';
    invalidPasswordError = '';
    invalidUsernameError = '';
    invalidPasswordError = '';
  }

  const emailInputInvalid = emailFailure || registerFailure;
  const passwordInputInvalid = passwordFailure || registerFailure;
  const confirmPasswordInputInvalid = confirmPasswordFailure || registerFailure;
  const usernameInputInvalid = usernameFailure || registerFailure;
  const displayNameInputInvalid = displayNameFailure || registerFailure;

  return (
    <div className="grid gap-6">
      <form onSubmit={onUserRegister}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label htmlFor="email">
              Email <RequiredInput />
            </Label>
            <Input
              ref={emailInput}
              onChange={handleEmailChange}
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              className={`${emailInputInvalid ? 'ring-red-500' : ''}`}
            />
            {invalidEmailError && (
              <FormErrorMessage message={invalidEmailError} />
            )}
            {accountExistedError && (
              <FormErrorMessage message={accountExistedError} />
            )}
          </div>
          <div className="grid gap-1 mt-2">
            <Label htmlFor="username">
              Username <RequiredInput />
            </Label>
            <Input
              ref={usnInput}
              onChange={handleUsernameChange}
              id="username"
              placeholder="xyz"
              type="text"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isLoading}
              className={`${usernameInputInvalid ? 'ring-red-500' : ''}`}
            />
            {invalidUsernameError && (
              <FormErrorMessage message={invalidUsernameError} />
            )}
          </div>
          <div className="grid gap-1 mt-2">
            <Label htmlFor="displayName">
              Display Name <RequiredInput />
            </Label>
            <Input
              ref={displayNameInput}
              onChange={handleDisplayNameChange}
              id="displayName"
              placeholder="Xyz"
              type="text"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isLoading}
              className={`${displayNameInputInvalid ? 'ring-red-500' : ''}`}
            />
            {invalidDisplayNameError && (
              <FormErrorMessage message={invalidDisplayNameError} />
            )}
          </div>
          <div className="grid gap-1 mt-2">
            <Label htmlFor="password">
              Password <RequiredInput />
            </Label>
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
          </div>
          <div className="grid gap-1 mt-2">
            <Label htmlFor="confirm-password">
              Confirm Password <RequiredInput />
            </Label>
            <Input
              ref={confirmPwdInput}
              onChange={handleConfirmPasswordChange}
              id="confirm-password"
              placeholder="********"
              type="password"
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect="off"
              disabled={isLoading}
              className={`${confirmPasswordInputInvalid ? 'ring-red-500' : ''}`}
            />
            {invalidConfirmPasswordError && (
              <FormErrorMessage message={invalidConfirmPasswordError} />
            )}
            {somethingWrongError && (
              <FormErrorMessage message={somethingWrongError} />
            )}
          </div>
          <Button disabled={isLoading} className="mt-3">
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserAuthForm;
