import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CategoryResponse } from '@/data/dto/category';
import {
  CATEGORY_FILTER_KEYWORD,
  FEED_SEARCH_PATH,
  SEARCH_QUERY_KEYWORD,
} from '@/data/route';
import { FixedCategories } from '@/data/types/category';
import { Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SearchBox = ({
  filteredCategory,
  onSearch,
}: {
  filteredCategory: CategoryResponse;
  onSearch: (value: string) => void;
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputValue(e.target.value);

  const handleClear = () => {
    setInputValue('');
    onSearch('');

    const params = new URLSearchParams(location.search);
    params.delete(SEARCH_QUERY_KEYWORD);
    navigate(`${location.pathname}?${params.toString()}`);
  };

  const handleSearch = () => {
    const _query = inputValue.trim();
    if (_query) {
      onSearch(_query);

      const params = new URLSearchParams(location.search);
      params.set(SEARCH_QUERY_KEYWORD, _query);

      if (filteredCategory && filteredCategory.id !== FixedCategories[0].id)
        params.set(CATEGORY_FILTER_KEYWORD, String(filteredCategory.id));

      navigate(`${FEED_SEARCH_PATH}?${params.toString()}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    const query = new URLSearchParams(location.search).get(
      SEARCH_QUERY_KEYWORD
    );
    if (query) setInputValue(query);
  }, [location]);

  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus(); // Focus the input box
      }
    };

    window.addEventListener('keydown', handleShortcut);
    return () => {
      window.removeEventListener('keydown', handleShortcut);
    };
  }, []);

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyPress}
        type="text"
        placeholder="Search"
        className="pl-4 py-[16px] text-sm bg-zinc-200/50 dark:bg-muted/50 border-none focus-visible:outline focus-visible:dark:outline-gray-700 outline-gray-300 min-w-[300px] focus:shadow-md"
      />
      {inputValue ? (
        <X
          className="w-3 h-3 absolute right-16 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
          onClick={handleClear}
        />
      ) : (
        <kbd className="absolute right-16 top-1/2 transform -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      )}
      <Button
        variant="secondary"
        className="absolute right-0 top-0 px-4 rounded-none rounded-tr-md rounded-br-md border-none focus-visible:outline focus-visible:dark:outline-gray-700 outline-gray-300 bg-primary/10 hover:bg-primary/20"
        onClick={handleSearch}
      >
        <Search />
      </Button>
    </div>
  );
};

export default SearchBox;
