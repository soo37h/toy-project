import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search, RotateCcw, ChevronDown } from 'lucide-react';
import type { SearchType } from '@/pages/board/types';

const searchOptions: { value: SearchType; label: string }[] = [
  { value: 'title_content', label: '전체' },
  { value: 'title', label: '제목' },
  { value: 'content', label: '내용' },
];

interface SearchFormProps {
  onSearch: (searchType: SearchType, keyword: string, startDate?: string, endDate?: string) => void;
}

export default function SearchForm({ onSearch }: SearchFormProps) {
  const [searchType, setSearchType] = useState<SearchType>('title_content');
  const [keyword, setKeyword] = useState('');
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLabel = searchOptions.find((o) => o.value === searchType)?.label || '전체';

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchType, keyword);
  };

  const handleReset = () => {
    setSearchType('title_content');
    setKeyword('');
    onSearch('title_content', '');
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      {/* 검색유형 드롭다운 */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="inline-flex h-9 items-center gap-1 rounded border border-border bg-white px-3 text-sm font-medium transition-colors hover:bg-muted"
        >
          {selectedLabel}
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
        {open && (
          <div className="absolute top-full left-0 mt-1 z-50 min-w-[80px] rounded border border-border bg-white py-1 shadow-md">
            {searchOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`block w-full px-3 py-1.5 text-left text-sm transition-colors hover:bg-muted ${
                  searchType === opt.value ? 'text-primary font-medium' : ''
                }`}
                onClick={() => {
                  setSearchType(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 검색어 */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="검색어를 입력하세요"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="h-9 w-[200px] pl-8 text-sm rounded"
        />
      </div>

      {/* 조회 */}
      <button
        type="submit"
        className="inline-flex h-9 items-center gap-1.5 rounded bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <Search className="h-3.5 w-3.5" />
        조회
      </button>

      {/* 초기화 */}
      <button
        type="button"
        className="inline-flex h-9 items-center gap-1.5 rounded border border-border bg-white px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        onClick={handleReset}
      >
        <RotateCcw className="h-3.5 w-3.5" />
        초기화
      </button>
    </form>
  );
}
