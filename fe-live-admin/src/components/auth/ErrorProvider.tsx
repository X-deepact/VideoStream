import React, { createContext, useState, useContext } from 'react';

const ErrorContext = createContext();

export const useError = () => useContext(ErrorContext);

export const ErrorProvider = ({ children }) => {
	const [hasError, setHasError] = useState(false);

	const triggerError = () => setHasError(true);
	const clearError = () => setHasError(false);

	return (
		<ErrorContext.Provider value={{ hasError, triggerError, clearError }}>
			{children}
		</ErrorContext.Provider>
	);
};
