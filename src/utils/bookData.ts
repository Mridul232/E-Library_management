
import { toast } from "sonner";

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  coverImage: string;
  description: string;
  available: boolean;
}

export interface BorrowedBook extends Book {
  borrowDate: string;
  dueDate: string;
}

// Mock book data
const initialBooks: Book[] = [
  {
    id: "1",
    title: "The Design of Everyday Things",
    author: "Don Norman",
    category: "Design",
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1287&auto=format&fit=crop",
    description: "A powerful primer on how—and why—some products satisfy customers while others only frustrate them.",
    available: true,
  },
  {
    id: "2",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    category: "Psychology",
    coverImage: "https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=1376&auto=format&fit=crop",
    description: "A groundbreaking tour of the mind and explains the two systems that drive the way we think.",
    available: true,
  },
  {
    id: "3",
    title: "Creativity, Inc.",
    author: "Ed Catmull",
    category: "Business",
    coverImage: "https://images.unsplash.com/photo-1535398089889-dd807df1dfaa?q=80&w=1287&auto=format&fit=crop",
    description: "A book for managers who want to lead their employees to new heights, and a manual for creativity.",
    available: true,
  },
  {
    id: "4",
    title: "The Lean Startup",
    author: "Eric Ries",
    category: "Business",
    coverImage: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=1470&auto=format&fit=crop",
    description: "How Today's Entrepreneurs Use Continuous Innovation to Create Radically Successful Businesses.",
    available: true,
  },
  {
    id: "5",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    category: "History",
    coverImage: "https://images.unsplash.com/photo-1629992101753-56d196c8aabb?q=80&w=1290&auto=format&fit=crop",
    description: "A Brief History of Humankind explores what made homo sapiens the most successful human species.",
    available: true,
  },
  {
    id: "6",
    title: "Dune",
    author: "Frank Herbert",
    category: "Science Fiction",
    coverImage: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=1470&auto=format&fit=crop",
    description: "Set on the desert planet Arrakis, the story explores themes of politics, religion, and ecology.",
    available: true,
  },
  {
    id: "7",
    title: "1984",
    author: "George Orwell",
    category: "Dystopian",
    coverImage: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1288&auto=format&fit=crop",
    description: "A dystopian social science fiction novel that examines the consequences of totalitarianism.",
    available: true,
  },
  {
    id: "8",
    title: "The Alchemist",
    author: "Paulo Coelho",
    category: "Fiction",
    coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=1287&auto=format&fit=crop",
    description: "A philosophical story about a young Andalusian shepherd who travels to Egypt after a recurring dream.",
    available: true,
  }
];

// Local storage keys
const BOOKS_KEY = "library_books";
const BORROWED_BOOKS_KEY = "borrowed_books";

// Initialize local storage with books if empty
export const initializeBookData = (): void => {
  const storedBooks = localStorage.getItem(BOOKS_KEY);
  if (!storedBooks) {
    localStorage.setItem(BOOKS_KEY, JSON.stringify(initialBooks));
  }

  const borrowedBooks = localStorage.getItem(BORROWED_BOOKS_KEY);
  if (!borrowedBooks) {
    localStorage.setItem(BORROWED_BOOKS_KEY, JSON.stringify([]));
  }
};

// Get all books
export const getAllBooks = (): Book[] => {
  const storedBooks = localStorage.getItem(BOOKS_KEY);
  return storedBooks ? JSON.parse(storedBooks) : [];
};

// Get all borrowed books
export const getBorrowedBooks = (): BorrowedBook[] => {
  const borrowedBooks = localStorage.getItem(BORROWED_BOOKS_KEY);
  return borrowedBooks ? JSON.parse(borrowedBooks) : [];
};

// Borrow a book
export const borrowBook = (bookId: string): boolean => {
  const books = getAllBooks();
  const borrowedBooks = getBorrowedBooks();

  // Check if already borrowed 3 books
  if (borrowedBooks.length >= 3) {
    toast.error("You can only borrow up to 3 books at a time.");
    return false;
  }

  const bookIndex = books.findIndex(book => book.id === bookId);
  if (bookIndex === -1 || !books[bookIndex].available) {
    toast.error("This book is not available for borrowing.");
    return false;
  }

  // Set due date (14 days from now)
  const borrowDate = new Date();
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);

  // Update book availability
  books[bookIndex].available = false;
  
  // Add to borrowed books
  const borrowedBook: BorrowedBook = {
    ...books[bookIndex],
    borrowDate: borrowDate.toISOString(),
    dueDate: dueDate.toISOString()
  };
  
  borrowedBooks.push(borrowedBook);
  
  // Save changes
  localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
  localStorage.setItem(BORROWED_BOOKS_KEY, JSON.stringify(borrowedBooks));
  
  toast.success(`You have borrowed "${books[bookIndex].title}".`);
  return true;
};

// Return a book
export const returnBook = (bookId: string): boolean => {
  const books = getAllBooks();
  const borrowedBooks = getBorrowedBooks();
  
  const borrowedIndex = borrowedBooks.findIndex(book => book.id === bookId);
  if (borrowedIndex === -1) {
    toast.error("This book is not in your borrowed list.");
    return false;
  }
  
  // Find the book in the main library and make it available again
  const bookIndex = books.findIndex(book => book.id === bookId);
  if (bookIndex !== -1) {
    books[bookIndex].available = true;
  }
  
  // Remove from borrowed books
  borrowedBooks.splice(borrowedIndex, 1);
  
  // Save changes
  localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
  localStorage.setItem(BORROWED_BOOKS_KEY, JSON.stringify(borrowedBooks));
  
  toast.success("Book returned successfully.");
  return true;
};

// Search books
export const searchBooks = (query: string, category?: string): Book[] => {
  const books = getAllBooks();
  const searchQuery = query.toLowerCase().trim();
  
  return books.filter(book => {
    const matchesQuery = 
      book.title.toLowerCase().includes(searchQuery) || 
      book.author.toLowerCase().includes(searchQuery);
    
    const matchesCategory = !category || category === "All" || book.category === category;
    
    return matchesQuery && matchesCategory;
  });
};

// Get unique categories
export const getCategories = (): string[] => {
  const books = getAllBooks();
  const categories = new Set(books.map(book => book.category));
  return ["All", ...Array.from(categories)];
};

// Check due dates
export const checkDueDates = (): { soon: BorrowedBook[], overdue: BorrowedBook[] } => {
  const borrowedBooks = getBorrowedBooks();
  const today = new Date();
  
  // Books due within the next 3 days
  const soon = borrowedBooks.filter(book => {
    const dueDate = new Date(book.dueDate);
    const timeDiff = dueDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff > 0 && daysDiff <= 3;
  });
  
  // Overdue books
  const overdue = borrowedBooks.filter(book => {
    const dueDate = new Date(book.dueDate);
    return dueDate < today;
  });
  
  return { soon, overdue };
};
