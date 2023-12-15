const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const app = express();

// Middleware para análise do corpo da requisição
app.use(express.json()); // Para análise de JSON
app.use(express.urlencoded({ extended: true })); // Para análise de dados de formulário


let users = [];

const isValid = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });
      if(validusers.length > 0){
        return true;
      } else {
        return false;
      }
    }

    regd_users.post("/login", (req, res) => {
        const username = req.body.username;
        const password = req.body.password;
    
        if (!username || !password) {
            return res.status(404).json({message: "Error logging in"});
        }
       if (authenticatedUser(username,password)) {
          let accessToken = jwt.sign({
            data: password
          }, 'access', { expiresIn: 60 * 60 });
          req.session.authorization = {
            accessToken,username
        }
        return res.status(200).send("User successfully logged in");
        } else {
          return res.status(208).json({message: "Invalid Login. Check username and password"});
        }});
    

        regd_users.put("/auth/review/:isbn", (req, res) => {
            const isbn = req.params.isbn;
            const review = req.body.review;
            const username = req.session.authorization.username; // Ajuste conforme a lógica da sua sessão
        
            if (!books[isbn]) {
                return res.status(404).json({ message: "Book not found" });
            }
        
            if (!review) {
                return res.status(400).json({ message: "Review content is required" });
            }
        
            // Inicializa o objeto de reviews se não existir
            if (!books[isbn].reviews) {
                books[isbn].reviews = {};
            }
        
            // Adiciona ou atualiza a resenha
            books[isbn].reviews[username] = review;
        
            res.status(200).json({ message: "Review added or updated successfully" });
        });
        
        regd_users.delete("/auth/review/:isbn", (req, res) => {
            const isbn = req.params.isbn;
            const username = req.session.authorization.username; // Ajuste conforme a lógica da sua sessão
        
            if (!books[isbn] || !books[isbn].reviews || !books[isbn].reviews[username]) {
                return res.status(404).json({ message: "Review not found" });
            }
        
            // Remove a resenha
            delete books[isbn].reviews[username];
        
            res.status(200).json({ message: "Review deleted successfully" });
        });
        

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
