import express from "express";
import bodyParser from "body-parser";
import dayjs from 'dayjs'
import superheroes from "superheroes";

import { dirname } from "path"
import { fileURLToPath } from "url"
//import jquery from "jquery";
//import  jsdom from 'jsdom'

const app = express();
const port = 3000;
const todos = [];
//let name = superheroes.random();
const __dir = dirname(fileURLToPath(import.meta.url))

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());

//function checkFunc(req, res, next) {
//   const input = document.getElementById("checkbox")
//   if (input.checked) {
//      input.style.textDecoration = "line-through";
//   }
//   next()
//}
//app.use(checkFunc)

app.get("/", (req, res) => {
   res.render("index.ejs", {todos: todos});
});

app.post("/", (req, res) => {
   todos.push(req.body)
   res.redirect("/")
})

app.get("/work", (req, res) => {
   res.render("work.ejs", {todos: todos});
});

app.post("/work", (req, res) => {
   todos.push(req.body)
   res.redirect("/")
});

app.listen(3000, () => {
   console.log(`Listening on port ${port}`);
})
