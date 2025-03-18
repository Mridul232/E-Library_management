
import React, { useState, useEffect } from 'react';
import { initializeBookData, getAllBooks, borrowBook, searchBooks, Book as BookType } from '@/utils/bookData';
import Header from '@/components/Header';
import BookSearch from '@/components/BookSearch';
import BookCard from '@/components/BookCard';
import BorrowedBooks from '@/components/BorrowedBooks';
import { LibraryBig } from 'lucide-react';

const Index = () => {
  const [books, setBooks] = useState<BookType[]>([]);
  const [showingBorrowed, setShowingBorrowed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize book data in local storage
    initializeBookData();
    
    // Load all books
    const allBooks = getAllBooks();
    setBooks(allBooks);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Re-fetch books when showing library (not borrowed books)
    if (!showingBorrowed) {
      handleSearch(searchQuery, selectedCategory);
    }
  }, [showingBorrowed]);

  const handleBorrow = (bookId: string) => {
    const success = borrowBook(bookId);
    if (success) {
      // Refresh the book list to update availability
      handleSearch(searchQuery, selectedCategory);
    }
  };

  const handleSearch = (query: string, category: string) => {
    setSearchQuery(query);
    setSelectedCategory(category);
    const filteredBooks = searchBooks(query, category);
    setBooks(filteredBooks);
  };

  const toggleBorrowedView = () => {
    setShowingBorrowed(!showingBorrowed);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Header 
        onToggleBorrowed={toggleBorrowedView} 
        showingBorrowed={showingBorrowed} 
      />
      
      <main className="container px-4 py-8">
        {!showingBorrowed && (
          <>
            <div className="mb-8 animate-slide-down">
              <h1 className="text-4xl font-bold tracking-tight mb-4 text-center">Digital Library</h1>
              <p className="text-muted-foreground text-center max-w-2xl mx-auto">
                Search, borrow, and enjoy a vast collection of digital books from our library.
              </p>
            </div>
            
            <BookSearch onSearch={handleSearch} />
            
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-pulse text-muted-foreground">Loading books...</div>
              </div>
            ) : (
              <>
                {books.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-slide-up">
                    {books.map((book) => (
                      <BookCard 
                        key={book.id} 
                        book={book} 
                        onBorrow={handleBorrow}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center glass rounded-xl animate-fade-in">
                    <LibraryBig className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold">No books found</h3>
                    <p className="text-muted-foreground mt-2 max-w-md">
                      Try changing your search query or category filter.
                    </p>
                  </div>
                )}
              </>
            )}
          </>
        )}
        
        {showingBorrowed && <BorrowedBooks />}
      </main>
    </div>
  );
};

export default Index;
