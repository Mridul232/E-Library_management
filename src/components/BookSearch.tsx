
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { getCategories } from '@/utils/bookData';

interface BookSearchProps {
  onSearch: (query: string, category: string) => void;
}

const BookSearch: React.FC<BookSearchProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState<string[]>(['All']);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setCategories(getCategories());
  }, []);

  const handleSearch = () => {
    onSearch(searchQuery, selectedCategory);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    onSearch('', 'All');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="glass px-4 py-3 rounded-xl shadow-sm border border-gray-100 transition-all duration-300">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative w-full">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Search books by title or author..."
              className="pr-10 h-11 pl-4 border-none shadow-none bg-white bg-opacity-80"
            />
            {searchQuery && (
              <button 
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex w-full md:w-auto gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsExpanded(!isExpanded)}
              className="md:hidden w-full"
            >
              {selectedCategory !== 'All' ? selectedCategory : 'Categories'}
            </Button>

            <div className="hidden md:flex items-center gap-2 flex-wrap">
              {categories.map(category => (
                <Button
                  key={category}
                  type="button"
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="h-9 px-3 transition-all"
                  onClick={() => {
                    setSelectedCategory(category);
                    onSearch(searchQuery, category);
                  }}
                >
                  {category}
                </Button>
              ))}
            </div>

            <Button 
              type="button"
              onClick={handleSearch}
              className="min-w-[90px] h-11"
            >
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-3 md:hidden flex flex-wrap gap-2 animate-slide-down">
            {categories.map(category => (
              <Button
                key={category}
                type="button"
                variant={selectedCategory === category ? "default" : "outline"}
                className="h-8 px-3 text-sm transition-all"
                onClick={() => {
                  setSelectedCategory(category);
                  onSearch(searchQuery, category);
                  setIsExpanded(false);
                }}
              >
                {category}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookSearch;
