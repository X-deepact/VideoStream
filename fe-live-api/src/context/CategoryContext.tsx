import { createContext, useContext, useState, ReactNode } from 'react';
import { CategoryResponse } from '@/data/dto/category';
import { FixedCategories } from '@/data/types/category';

interface CategoryContextType {
  filteredCategory: CategoryResponse;
  setFilteredCategory: (category: CategoryResponse) => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined
);

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const [filteredCategory, setFilteredCategory] = useState<CategoryResponse>(
    FixedCategories[0]
  );

  return (
    <CategoryContext.Provider
      value={{
        filteredCategory,
        setFilteredCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCategory = (): CategoryContextType => {
  const context = useContext(CategoryContext);
  if (!context)
    throw new Error('useCategory must be used within a CategoryProvider');
  return context;
};
