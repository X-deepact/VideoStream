import {
  getLoggedInUserInfo,
  subscribeAccountChange,
  unsubscribeAccountChange,
  UserAccountModel,
} from '@/data/model/userAccount';
import { useEffect, useRef, useState } from 'react';

function useUserAccount(): UserAccountModel {
  const [account, setAccount] = useState<UserAccountModel>(
    getLoggedInUserInfo()
  );

  const _isMounted = useRef<boolean>(false);

  useEffect(() => {
    _isMounted.current = true;
    setAccount(getLoggedInUserInfo());

    const onNewData = (): void => {
      if (_isMounted.current) {
        const newInfo = getLoggedInUserInfo();
        setAccount(newInfo);
      }
    };

    subscribeAccountChange(onNewData);

    return () => {
      _isMounted.current = false;
      unsubscribeAccountChange(onNewData);
    };
  }, []);

  return account;
}

export default useUserAccount;
