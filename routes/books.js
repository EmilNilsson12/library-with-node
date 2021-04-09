var express = require("express");
var router = express.Router();

const books = [
  {
    title: "Swann's Way: In Search of Lost Time",
    author: "Marcel Proust",
    pages: "468",
    stocked: false,
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
    stocked: false,
  },
];

const myBooksArr = [
  {
    title: "Swann's Way: In Search of Lost Time",
    author: "Marcel Proust",
    pages: "468",
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    pages: "180",
  },
];

const navBar = `
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/my-books">View your books!</a></li>
      <li><a href="/donate">Donate a book!</a></li>
      <li><a href="/our-story">Our story</a></li>
    </ul>
  </nav>`;

const booksHead = `
  <title>Available books</title>
  <link rel="stylesheet" href="/stylesheets/style.css" />
  <script defer src="/javascripts/activatebtns.js"></script>`;

/* GET books listing. */
router.get("/", function (req, res) {
  let booksDiv =
    booksHead +
    navBar +
    `<h1>Books in our library</h1>
     <div class='books-wrapper'>`;

  for (book of books) {
    booksDiv += `
        <div class="book-div">
          <h2>${book.title}</h2>
        `;

    book.stocked
      ? (booksDiv += `<form action="/books/${urlify(
          book.title
        )}" method="post"><input type="submit" name="${
          this.parentNode
        }" value="About this book"></form></div>`)
      : (booksDiv += `<button disabled>Unavailable</button></div>`);
  }

  booksDiv += "</div>";

  res.send(booksDiv);
});

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

router.post("/donate", (req, res) => {
  console.log("req.body");

  const newBook = {
    title: req.body.title,
    author: req.body.author,
    pages: req.body.pages,
    stocked: true,
  };

  books.push(newBook);

  res.redirect("/");
});

router.get("/my-books", (req, res) => {
  let myBooksPage = booksHead + navBar;

  if (!myBooksArr.length) {
    myBooksPage += "There doesn't seem to be anything here...";
  } else {
    myBooksPage += `
    <h1>Books you've currently checked out</h1>
    <div class='books-wrapper'><ul>`;

    for (book of myBooksArr) {
      myBooksPage += `
      <li>
        <div class="book-div">
          <h2>${book.title}</h2>
          <h3>Written by:<br />${book.author}</h3>
          <p class="pages">${book.pages} pages</p>
        </div>
        <button>Return this book</button>
      </li>`;
    }

    myBooksPage += "</ul></div>";
  }

  res.send(myBooksPage);
});

router.post("/books/:clickedBook", (req, res) => {
  console.log(req.body);
  console.log(req.body.name);

  let bookDesc = booksHead + navBar;

  bookDesc += `
    <div class="book-div">
      <h2>The clicked book</h2>
      <h3>Written by:<br />Author of book</h3>
      <p class="pages">10000 pages</p>
    </div>`;

  res.send(bookDesc);
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
