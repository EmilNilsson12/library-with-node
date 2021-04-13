var express = require("express");
var router = express.Router();

var cors = require("cors");
router.use(cors());

const books = [
  {
    title: "Swann's Way: In Search of Lost Time",
    author: "Marcel Proust",
    pages: "468",
    stocked: true,
  },
  {
    title: "Ulysses",
    author: "James Joyce",
    pages: "736",
    stocked: true,
  },
  {
    title: "Don Quixote",
    author: "Miguel De Cervantes Saavedra",
    pages: "1072",
    stocked: true,
  },
  {
    title: "One Hundred Years of Solitude",
    author: "Gabriel Garcia Marquez",
    pages: "417",
    stocked: true,
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    pages: "180",
    stocked: true,
  },
];

let myBooksArr = [];

const navBar = `
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/books">View our selection!</a></li>
      <li><a href="/my-books">View your collection!</a></li>
      <li><a href="/donate">Donate a book!</a></li>
    </ul>
  </nav>`;

const booksHead = `
  <title>Available books</title>
  <link rel="stylesheet" href="/stylesheets/style.css" />
  <script defer src="/javascripts/activatebtns.js"></script>`;

/* GET /books */
/* Displays all books in the books array*/
router.get("/books", function (req, res) {
  let booksDiv =
    booksHead +
    navBar +
    `<h1>Books in our library</h1>
     <div class='books-wrapper'>`;

  for (book of books) {
    booksDiv += `
        <div class="book-div-wrapper">
        <div class="book-div">
          <h2>${book.title}</h2>
    `;
    booksDiv += `<a href="/books/${urlify(
      book.title
    )}" class="book-about">About this book...</a></div>`;
    book.stocked
      ? (booksDiv += `<form action="/books/borrow/${urlify(
          book.title
        )}" method="post">
      <input type="text" name="title" style="display: none" value="${
        book.title
      }">
      <input type="submit" value="Borrow this book">
    </form></div>`)
      : (booksDiv += `<button disabled>Unavailable</button></div>`);
  }
  booksDiv += "</div>";
  res.send(booksDiv);
});

/* GET /my-books */
/* Shows all books you have currently borrowed from the library */
router.get("/my-books", (req, res) => {
  let myBooksPage = booksHead + navBar;
  console.log(myBooksArr);
  console.log(books);

  if (!myBooksArr.length) {
    myBooksPage += "There doesn't seem to be anything here...";
  } else {
    myBooksPage += `
    <h1>Books you've currently checked out</h1>
    <div class='books-wrapper'>`;

    for (book of myBooksArr) {
      myBooksPage += `
      <div class="book-div-wrapper">
        <div class="book-div">
          <h2>${book.title}</h2>
          <h3>Written by:<br />${book.author}</h3>
          <p class="pages">${book.pages} pages</p>
        </div>
        <form action="/books/return/${urlify(book.title)}" method="post">
          <input type="text" name="title" style="display: none" value="${
            book.title
          }">
        <input type="submit" value="Return this book">
        </form>
      </div>`;
    }
    myBooksPage += "</div>";
  }
  res.send(myBooksPage);
});

/* POST /books/return/:clickedBook */
/* Removes the clicked book from myBooks */
/* Redirects to /books after */
router.post("/books/return/:clickedBook", (req, res) => {
  const clickedBook = req.body.title;

  // Find the book obj with the clickedbook title in books array
  let bookIndexLibrary = books.findIndex((book) => book.title == clickedBook);

  // Find the book obj with the clickedbook title in mybooks array
  let bookIndexMyBooks = myBooksArr.findIndex(
    (book) => book.title == clickedBook
  );
  console.log("index in my books: ", bookIndexMyBooks);
  console.log("index in the library: ", bookIndexLibrary);

  // Remove book from myBooks array
  myBooksArr.splice(bookIndexMyBooks, 1);

  console.log(myBooksArr);

  // Change property 'stocked' in books array
  books[bookIndexLibrary].stocked = true;

  // Style page
  let page = booksHead;
  page += `
    <p>${clickedBook} has been returned to the library!</p>
    <p><a href="/books">Back to the library --></a></p>
    <p><a href="/my-books">See your collection --></a></p>`;

  // Show all books currently borrowed by user
  res.send(page);
});

/* GET /donate */
/* Displays form for adding a book to books array */
router.get("/donate", (req, res) => {
  let bookRequestForm =
    booksHead +
    navBar +
    `<div class="form-wrapper">
      <form action="/donate" method="post">
        <label for="title">Title:</label><br />
        <input type="text" name="title" value="The Catcher in the Rye" placeholder="The Catcher in the Rye"><br />
        <label for="author">Author:</label><br />
        <input type="text" name="author" value="J.D. Salinger" placeholder="J.D. Salinger"><br />
        <label for="pages">Number of pages:</label><br />
        <input type="number" name="pages" value="240" placeholder="240"><br />
        <input type="submit">
      </form>
    </div>
  `;
  res.send(bookRequestForm);
});

/* POST /donate */
/* Adds a new book to the books array */
/* Redirects to /books after */
router.post("/donate", (req, res) => {
  console.log("req.body");
  console.log(req.body);

  const newBook = {
    title: req.body.title,
    author: req.body.author,
    pages: req.body.pages,
    stocked: true,
  };

  books.unshift(newBook);

  res.redirect("/books");
});

/* GET /books/clickedbook */
/* Shows additional info about a particular book */
router.get("/books/:clickedBook", (req, res) => {
  const clickedBook = req.params.clickedBook;
  console.log("clickedBook: ", clickedBook);
  console.log("typeof clickedBook: ", typeof clickedBook);

  let displayedBook = books.find((book) => urlify(book.title) == clickedBook);
  console.log(displayedBook);

  let bookDesc = booksHead + navBar;
  bookDesc += `
    <div class="book-div-wrapper">
      <div class="book-div">
        <h2>${displayedBook.title}</h2>
        <h3>Written by:<br />${displayedBook.author}</h3>
        <p class="pages">${displayedBook.pages} pages</p>
      </div>`;

  displayedBook.stocked
    ? (bookDesc += `<form action="/books/borrow/${urlify(
        displayedBook.title
      )}" method="post">
      <input type="text" name="title" style="display: none" value="${
        displayedBook.title
      }">
      <input type="submit" value="Borrow this book">
    </form></div></div>`)
    : (bookDesc += `<button disabled>Unavailable</button></div></div>`);

  res.send(bookDesc);
});

/* POST /books/borrow/:clickedBook */
/* Adds the clicked book to myBooks */
/* Page only contains a confimation and links to the library and your collection*/
router.post("/books/borrow/:clickedBook", (req, res) => {
  const clickedBook = req.body.title;

  // Find the book obj with the clickedbook title
  let bookToBorrow = books.find((book) => book.title == clickedBook);
  let bookIndex = books.findIndex((book) => book.title == clickedBook);

  // Add book to myBooks array
  myBooksArr.unshift(bookToBorrow);

  // Change property 'stocked' in books array
  books[bookIndex].stocked = false;

  // Style page
  let page = booksHead;
  page += `
    <p>${clickedBook} has been added to your account!</p>
    <p><a href="/books">Back to the library --></a></p>
    <p><a href="/my-books">See your collection --></a></p>`;

  // Show a page confirming that the book has been borrowed
  res.send(page);
});

// Helper function
// Converts title of book to a url acceptable route
function urlify(bookTitle) {
  return bookTitle
    .split(/\s|_|(?=[A-Z])/)
    .join("-")
    .toLowerCase();
}

module.exports = router;
