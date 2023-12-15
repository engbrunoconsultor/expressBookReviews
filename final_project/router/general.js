const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
        const getBooks = () => Promise.resolve(books); // Mimicking an async operation
        const bookList = await getBooks();
        res.send(JSON.stringify(bookList, null, 4));
    } catch (error) {
        res.status(500).json({ message: "Error fetching books" });
    }
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const getBookByISBN = isbn => Promise.resolve(books[isbn]); // Mimicking an async operation
        const book = await getBookByISBN(req.params.isbn);
        if (book) {
            res.send(book);
        } else {
            res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching book by ISBN" });
    }
});

  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    try {
        const getBookByAuthor = author => Promise.resolve(Object.values(books).find(book => book.author === author));
        const book = await getBookByAuthor(req.params.author);
        if (book) {
            res.json(book);
        } else {
            res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching book by author" });
    }
});

   
// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    try {
        const getBookByTitle = title => Promise.resolve(Object.values(books).find(book => book.title === title));
        const book = await getBookByTitle(req.params.title);
        if (book) {
            res.json(book);
        } else {
            res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching book by title" });
    }
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
   let isbn = req.params.isbn;

  // Verifica se o livro com o ISBN fornecido existe
  if (books[isbn]) {
    let reviewData = books[isbn].reviews;
    res.json(reviewData);
} else {
    // Se nenhum livro foi encontrado, envia uma resposta 404
    res.status(404).json({ message: "No book found for the given ISBN" });
}
});

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (!isValid(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register user."});
  });



module.exports.general = public_users;
