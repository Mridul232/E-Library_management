
import React from 'react';
import { Book, BorrowedBook } from '@/utils/bookData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertTriangle } from 'lucide-react';

interface BookCardProps {
  book: Book | BorrowedBook;
  isBorrowed?: boolean;
  onBorrow?: (id: string) => void;
  onReturn?: (id: string) => void;
}

const BookCard: React.FC<BookCardProps> = ({ 
  book, 
  isBorrowed = false, 
  onBorrow, 
  onReturn 
}) => {
  const isOverdue = isBorrowed && 'dueDate' in book && new Date(book.dueDate) < new Date();
  const isDueSoon = isBorrowed && 'dueDate' in book && !isOverdue && new Date(book.dueDate).getTime() - new Date().getTime() <= 3 * 24 * 60 * 60 * 1000;
  
  let cardClassName = "book-hover transition-all overflow-hidden relative h-full flex flex-col";
  if (isOverdue) cardClassName += " alert-overdue";
  else if (isDueSoon) cardClassName += " alert-soon";

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className={cardClassName}>
      <div className="relative h-48 overflow-hidden">
        <img 
          src={book.coverImage} 
          alt={book.title} 
          className="w-full h-full object-cover transition-transform duration-700 ease-in-out hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="opacity-80">
            {book.category}
          </Badge>
        </div>
      </div>
      
      <CardContent className="flex-grow pt-4 space-y-2">
        <h3 className="font-semibold text-lg leading-tight line-clamp-1">{book.title}</h3>
        <p className="text-sm text-muted-foreground">by {book.author}</p>
        <p className="text-sm line-clamp-2 mt-1">{book.description}</p>
        
        {isBorrowed && 'dueDate' in book && (
          <div className="mt-3">
            {isOverdue ? (
              <div className="flex items-center text-destructive gap-1 text-sm">
                <AlertTriangle className="h-4 w-4" />
                <span>Overdue since {formatDate(book.dueDate)}</span>
              </div>
            ) : (
              <div className={`flex items-center ${isDueSoon ? 'text-amber-500' : 'text-muted-foreground'} gap-1 text-sm`}>
                <Clock className="h-4 w-4" />
                <span>Due by {formatDate(book.dueDate)}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 pb-4">
        {isBorrowed ? (
          <Button 
            onClick={() => onReturn && onReturn(book.id)} 
            variant="outline" 
            className="w-full"
          >
            Return Book
          </Button>
        ) : (
          <Button 
            onClick={() => onBorrow && onBorrow(book.id)} 
            variant="default" 
            className="w-full"
            disabled={!book.available}
          >
            {book.available ? 'Borrow' : 'Unavailable'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default BookCard;
