
import React, { useState, useEffect } from 'react';
import { BorrowedBook, getBorrowedBooks, returnBook } from '@/utils/bookData';
import BookCard from './BookCard';
import { Book, Clock } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const BorrowedBooks: React.FC = () => {
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
  
  useEffect(() => {
    setBorrowedBooks(getBorrowedBooks());
  }, []);
  
  const handleReturn = (bookId: string) => {
    const success = returnBook(bookId);
    if (success) {
      setBorrowedBooks(getBorrowedBooks());
    }
  };
  
  const getDaysRemaining = (dueDate: string): number => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  // Group books by due status
  const overdueBooks = borrowedBooks.filter(book => getDaysRemaining(book.dueDate) < 0);
  const dueSoonBooks = borrowedBooks.filter(book => {
    const days = getDaysRemaining(book.dueDate);
    return days >= 0 && days <= 3;
  });
  const otherBooks = borrowedBooks.filter(book => getDaysRemaining(book.dueDate) > 3);
  
  // Sort all groups by due date (ascending)
  const sortByDueDate = (a: BorrowedBook, b: BorrowedBook) => {
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  };
  
  overdueBooks.sort(sortByDueDate);
  dueSoonBooks.sort(sortByDueDate);
  otherBooks.sort(sortByDueDate);
  
  // Combine the groups in priority order
  const sortedBooks = [...overdueBooks, ...dueSoonBooks, ...otherBooks];
  
  return (
    <div className="w-full animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">My Borrowed Books</h2>
        <div className="text-sm text-muted-foreground">
          {borrowedBooks.length} / 3 books borrowed
        </div>
      </div>
      
      {borrowedBooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center glass rounded-xl">
          <Book className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold">No books borrowed yet</h3>
          <p className="text-muted-foreground mt-2 max-w-md">
            You can borrow up to 3 books at a time. Browse the library to find books you're interested in.
          </p>
        </div>
      ) : (
        <>
          {(overdueBooks.length > 0 || dueSoonBooks.length > 0) && (
            <div className="mb-6">
              {overdueBooks.length > 0 && (
                <div className="glass border-destructive border p-4 rounded-lg mb-3">
                  <h3 className="text-destructive font-medium flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4" />
                    Overdue Books ({overdueBooks.length})
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Please return these books as soon as possible to avoid penalties.
                  </p>
                  <ScrollArea className="h-[230px]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pr-4">
                      {overdueBooks.map((book) => (
                        <div key={book.id} className="p-3 bg-destructive/5 rounded-md border border-destructive/20">
                          <p className="font-medium">{book.title}</p>
                          <p className="text-sm text-muted-foreground">by {book.author}</p>
                          <p className="text-sm text-destructive mt-1">
                            {Math.abs(getDaysRemaining(book.dueDate))} day{Math.abs(getDaysRemaining(book.dueDate)) !== 1 ? 's' : ''} overdue
                          </p>
                          <button 
                            onClick={() => handleReturn(book.id)}
                            className="text-sm text-primary mt-2 hover:underline"
                          >
                            Return now
                          </button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
              
              {dueSoonBooks.length > 0 && (
                <div className="glass border-amber-400 border p-4 rounded-lg">
                  <h3 className="text-amber-500 font-medium flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4" />
                    Due Soon ({dueSoonBooks.length})
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    These books are due within the next 3 days.
                  </p>
                  <ScrollArea className="h-[230px]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pr-4">
                      {dueSoonBooks.map((book) => (
                        <div key={book.id} className="p-3 bg-amber-500/5 rounded-md border border-amber-400/20">
                          <p className="font-medium">{book.title}</p>
                          <p className="text-sm text-muted-foreground">by {book.author}</p>
                          <p className="text-sm text-amber-500 mt-1">
                            Due in {getDaysRemaining(book.dueDate)} day{getDaysRemaining(book.dueDate) !== 1 ? 's' : ''}
                          </p>
                          <button 
                            onClick={() => handleReturn(book.id)}
                            className="text-sm text-primary mt-2 hover:underline"
                          >
                            Return now
                          </button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedBooks.map((book) => (
              <BookCard 
                key={book.id} 
                book={book} 
                isBorrowed={true} 
                onReturn={handleReturn}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BorrowedBooks;
