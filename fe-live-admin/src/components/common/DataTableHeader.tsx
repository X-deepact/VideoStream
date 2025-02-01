import React from 'react';
import { ArrowDown, ArrowDownUp, ArrowUp } from 'lucide-react';
import { SORT_ORDER } from '@/lib/validation';

interface DataTableColumnHeaderProps {
  title: string;
  sort?: {
    sortKey: string;
    sortBy: string;
    sortOrder: SORT_ORDER;
    setSortBy: (field: string) => void;
    setSortOrder: (order: SORT_ORDER) => void;
  };
}

const DataTableColumnHeader: React.FC<DataTableColumnHeaderProps> = ({
  title,
  sort,
}) => {
  if (sort) {
    const { sortKey, sortBy, sortOrder, setSortBy, setSortOrder } = sort;

    const handleSort = () => {
      if (sortBy === sortKey)
        setSortOrder(
          sortOrder === SORT_ORDER.ASC ? SORT_ORDER.DESC : SORT_ORDER.ASC
        );
      else {
        setSortBy(sortKey);
        setSortOrder(SORT_ORDER.ASC);
      }
    };

    return (
      <div
        onClick={handleSort}
        className="flex items-center gap-1 cursor-pointer select-none hover:text-black"
      >
        {title}
        {sortBy !== sortKey && <ArrowDownUp size={16} />}
        {sortBy === sortKey &&
          (sortOrder === SORT_ORDER.ASC ? (
            <ArrowUp size={16} />
          ) : (
            <ArrowDown size={16} />
          ))}
      </div>
    );
  }

  return <div className="select-none">{title}</div>;
};

export default DataTableColumnHeader;
