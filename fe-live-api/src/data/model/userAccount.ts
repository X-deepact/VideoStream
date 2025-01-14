import { EVENT_EMITTER_NAME, EventEmitter } from '@/lib/event-emitter';
import moment from 'moment-timezone';
import { LEFT_MAIN_MENU } from '../route';
import { USER_ROLE } from '@/data/types/role';
import { matchPath } from 'react-router-dom';

const STORAGE_KEY = 'authInfo';

export type UserAccountModel = {
  id: string | null;
  email: string | null;
  username: string | null;
  display_name: string | null;
  avatar_file_name: string | null;
  role_type: string | null;
  token: string | null;

  expiration_time?: moment.Moment | null;
  expired?: boolean | null;
  createdAt?: string | null;
};

let data: UserAccountModel = {
  id: null,
  email: null,
  username: null,
  display_name: null,
  avatar_file_name: null,
  role_type: null,
  token: null,

  expiration_time: null,
  expired: false,
  createdAt: null,
};

interface AccountStorage {
  id: string;
  email: string;
  username: string;
  display_name: string;
  avatar_file_name: string;
  role_type: string;
  token: string;

  expiration_time?: string;
  createdAt?: string;
}

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem(STORAGE_KEY);
};

export const isAuthorized = (pathname: string): boolean => {
  const currentUser = getLoggedInUserInfo();

  if (currentUser && !currentUser?.id && !currentUser?.role_type) return false;

  const allowedPaths = LEFT_MAIN_MENU[currentUser.role_type as USER_ROLE];
  return allowedPaths.some((allowedPath) =>
    matchPath({ path: allowedPath, end: false }, pathname)
  );
};

const onAccountChange = (): void => {
  const newData = { ...data };
  EventEmitter.emit(EVENT_EMITTER_NAME.USER_ACCOUNT_CHANGE, newData);
};

const clearData = (): void => {
  data = {
    id: null,
    email: null,
    username: null,
    display_name: null,
    avatar_file_name: null,
    role_type: null,
    token: null,

    expiration_time: null,
    expired: false,
  };

  localStorage.removeItem(STORAGE_KEY);
};

const onAuthExpired = (): void => {
  clearData();
  onAccountChange();
};

export const authAccount = (
  id: string,
  email: string,
  username: string,
  display_name: string,
  avatar_file_name: string,
  role_type: string,
  token: string,
  expiration_time: moment.Moment
): void => {
  data = {
    id,
    email,
    username,
    display_name,
    avatar_file_name,
    role_type,

    token,
    expiration_time,
    expired: false,
  };

  const utc = expiration_time.toISOString();
  const dataStorage: AccountStorage = {
    id,
    email,
    username,
    display_name,
    avatar_file_name,
    role_type,
    token,
    expiration_time: utc,
  };

  const storageStr = JSON.stringify(dataStorage);
  localStorage.setItem(STORAGE_KEY, storageStr);

  onAccountChange();
};

export const updateAccountProfile = (
  displayName?: string,
  avatarFileName?: string
): void => {
  if (displayName) data = { ...data, display_name: displayName };
  if (avatarFileName) data = { ...data, avatar_file_name: avatarFileName };

  const storedData = localStorage.getItem(STORAGE_KEY);
  let dataStorage: AccountStorage = {
    id: '',
    email: '',
    username: '',
    display_name: '',
    avatar_file_name: '',
    role_type: '',
    token: '',
    expiration_time: '',
    createdAt: '',
  };
  if (storedData) {
    dataStorage = JSON.parse(storedData);
    dataStorage = {
      ...dataStorage,
      display_name: displayName || 'Unknown',
      avatar_file_name: avatarFileName || '',
    };

    const storageStr = JSON.stringify(dataStorage);
    localStorage.setItem(STORAGE_KEY, storageStr);

    onAccountChange();
  }
};

export const invalidateAccount = (): void => {
  clearData();
  onAccountChange();
};

const loadStorage = (): void => {
  const dataStr = localStorage.getItem(STORAGE_KEY);
  if (dataStr) {
    const {
      id,
      email,
      username,
      display_name,
      avatar_file_name,
      role_type,
      token,
      expiration_time: expirationStr,
    }: AccountStorage = JSON.parse(dataStr);

    const nowMm = moment().add(2, 'minutes');
    const expirationMm = expirationStr ? moment(expirationStr) : null;
    if (expirationMm !== null && expirationMm.isAfter(nowMm)) {
      data = {
        id,
        email,
        username,
        display_name,
        avatar_file_name,
        role_type,

        token,
        expired: false,
        expiration_time: expirationMm,
      };

      onAccountChange();
    } else {
      clearData();
    }
  }
};
loadStorage();

export const getLoggedInUserInfo = (): UserAccountModel => {
  return { ...data };
};

export const retrieveAuthToken = (): string | null => {
  const { expiration_time, token } = data;
  const nowMm = moment().add(2, 'minutes');

  if (!!expiration_time && expiration_time.isAfter(nowMm)) return token;

  onAuthExpired();

  return null;
};

export const subscribeAccountChange = (
  onChange: (data: UserAccountModel) => void
): void => {
  EventEmitter.subscribe(EVENT_EMITTER_NAME.USER_ACCOUNT_CHANGE, onChange);
};

export const unsubscribeAccountChange = (
  onChange: (data: UserAccountModel) => void
): void => {
  EventEmitter.unsubscribe(EVENT_EMITTER_NAME.USER_ACCOUNT_CHANGE, onChange);
};

EventEmitter.subscribe(
  EVENT_EMITTER_NAME.EVENT_UNAUTHORIZED_USER,
  onAuthExpired
);
