
import React from 'react';
import { getBorrowedBooks, checkDueDates } from '@/utils/bookData';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  onToggleBorrowed: () => void;
  showingBorrowed: boolean;
}

const Header: React.FC<HeaderProps> = ({ onToggleBorrowed, showingBorrowed }) => {
  const borrowedBooks = getBorrowedBooks();
  const { soon, overdue } = checkDueDates();
  const totalAlerts = soon.length + overdue.length;

  return (
    <header className="w-full py-6 px-8 flex justify-between items-center bg-white bg-opacity-80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-100 animate-fade-in">
      <div className="flex items-center">
        <h1 className="text-2xl font-semibold tracking-tight">E-Library</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        {totalAlerts > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[1.25rem] flex items-center justify-center">
                  {totalAlerts}
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              {overdue.length > 0 && (
                <>
                  <h3 className="text-sm font-medium text-destructive px-2 py-1.5">Overdue Books</h3>
                  {overdue.map(book => (
                    <DropdownMenuItem key={`overdue-${book.id}`} className="flex flex-col items-start">
                      <span className="font-medium">{book.title}</span>
                      <span className="text-xs text-destructive">
                        Due on {new Date(book.dueDate).toLocaleDateString()}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </>
              )}
              
              {soon.length > 0 && (
                <>
                  <h3 className="text-sm font-medium text-amber-500 px-2 py-1.5">Due Soon</h3>
                  {soon.map(book => (
                    <DropdownMenuItem key={`soon-${book.id}`} className="flex flex-col items-start">
                      <span className="font-medium">{book.title}</span>
                      <span className="text-xs text-amber-500">
                        Due on {new Date(book.dueDate).toLocaleDateString()}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        
        <Button 
          variant={showingBorrowed ? "default" : "outline"} 
          onClick={onToggleBorrowed}
          className="transition-all"
        >
          {showingBorrowed ? "Browse Library" : "My Books"}
          {!showingBorrowed && borrowedBooks.length > 0 && (
            <Badge className="ml-2">{borrowedBooks.length}</Badge>
          )}
        </Button>
      </div>
    </header>
  );
};

export default Header;
