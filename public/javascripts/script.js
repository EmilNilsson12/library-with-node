const btns = document.getElementById("featured-books");

fetch("http://localhost:3000/books")
  .then((res) => res.json())
  .then((data) => {
    console.log(data);

    let booksDiv;
    for (book of data) {
      booksDiv += `
          <div class="book-div">
            <h2>${book.title}</h2>
      `;
      booksDiv += `<a href="/books/${urlify(
        book.title
      )}" class="book-about">About this book...</a>`;
      booksDiv += `<a href="/books/borrow/${urlify(
        book.title
      )}" class="book-stocked">Borrow this book</a></div>`;
    }
    booksDiv += "</div>";
  });
