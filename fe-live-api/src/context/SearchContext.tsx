import { createContext, useContext, useState, ReactNode } from 'react';

interface SearchContextProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchContext = createContext<SearchContextProps | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>
      {children}
    </SearchContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useFeedSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useFeedSearch must be used within a SearchProvider');
  }
  return context;
};
