// pages/api/books.js
class Book {
  constructor(title, author, ISBN) {
    this.title = title;
    this.author = author;
    this.ISBN = ISBN;
  }

  displayInfo() {
    return `${this.title} written by ${this.author}, ISBN: ${this.ISBN}`;
  }
}

class EBook extends Book {
  constructor(title, author, ISBN, fileFormat) {
    super(title, author, ISBN);
    this.fileFormat = fileFormat;
  }

  displayInfo() {
    return `${super.displayInfo()}, Format: ${this.fileFormat}`;
  }
}

class Library {
  constructor() {
    this.books = [];
  }

  addBook(book) {
    this.books.push(book);
  }

  displayBooks() {
    return this.books.map((book) => book.displayInfo());
  }
}

const library = new Library();

export default function handler(req, res) {
  if (req.method === 'POST') {
    const books = req.body;

    if (Array.isArray(books) && books.length > 0) {
      books.forEach((bookData) => {
        const { title, author, ISBN, fileFormat } = bookData;

        if (fileFormat) {
          const eBook = new EBook(title, author, ISBN, fileFormat);
          library.addBook(eBook);
          console.log(eBook);
        } else {
          const book = new Book(title, author, ISBN);
          library.addBook(book);
          console.log(book);
        }
      });

      res.status(201).json({ message: 'Books added successfully' });
    } else {
      res.status(400).json({ error: 'Invalid data format' });
    }
  } else if (req.method === 'GET') {
    res.json(library.displayBooks());
  } else if (req.method === 'DELETE') {
    const { ISBN } = req.body;
    const index = library.books.findIndex((book) => book.ISBN === ISBN);

    if (index !== -1) {
      library.books.splice(index, 1);
      res.json({ message: 'Book deleted successfully' });
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
