import { createContext, useState, useContext, ReactNode, FC } from "react";

interface ErrorContextValue {
  hasError: boolean;
  triggerError: () => void;
  clearError: () => void;
}

interface ErrorProviderProps {
  children: ReactNode;
}

const ErrorContext = createContext<ErrorContextValue | undefined>(undefined);
export const useError = (): ErrorContextValue => {
  const context = useContext(ErrorContext);

  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }

  return context;
};

export const ErrorProvider: FC<ErrorProviderProps> = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  const triggerError = () => setHasError(true);
  const clearError = () => setHasError(false);

  return (
    <ErrorContext.Provider value={{ hasError, triggerError, clearError }}>
      {children}
    </ErrorContext.Provider>
  );
};
