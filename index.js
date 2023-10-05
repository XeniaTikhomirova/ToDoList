import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import * as _ from 'lodash';

const app = express();
app.set('view engine', 'ejs');
//const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://admin-kseniia:testkseniia@cluster0.duxh12h.mongodb.net/todolistDB", {useNewUrlParser: true})

const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

const itemsSchema = {
   name: String
 };

 const Item = mongoose.model ("Item", itemsSchema);

 const item1 = new Item ({
   name: "Eat"
})
const item2 = new Item ({
   name: "Sleep"
})
const item3 = new Item ({
   name: "Repeat"
});

const defaultsItems = [item1, item2, item3];

const listSchema = {
   name: String,
   items: [itemsSchema]
}

const List = mongoose.model("List", listSchema)

app.get("/", (req, res) => {
   Item.find({})
     .then(function(foundItems){
      if (foundItems.length  === 0) {
         Item.insertMany(defaultsItems)
         .then(function(item){
         console.log("Succeded!")
         })
         .catch(function(err){
         console.log(err)
         })
         res.redirect("/")
      } else {
         res.render("list", {listTitle: "Today", newListItems: foundItems});
      }
   })
   .catch(function(err){
      console.log(err)
   })
   });

app.get("/:customListName", (req, res) => {
   const customListName = req.params.customListName.toUpperCase();
   List.findOne({name: customListName})
   .then(function(foundList) {
      if (!foundList) {
         const list = new List ({
               name: customListName,
               items: defaultsItems
            })
            list.save();
            res.redirect("/" + customListName)
         } else {
            res.render("list", {listTitle: foundList.name, newListItems: foundList.items})
         }
      })
   })

app.post("/", (req, res) => {
   const itemName = req.body.newItem;
   const listName = req.body.list;

   const item = new Item ({
      name: itemName
   })
   
   if (listName === "Today") {
      item.save();
      res.redirect("/");
   } else {
      List.findOne({name: listName})
      .then(function(foundList){
         foundList.items.push(item);
         foundList.save();
         res.redirect("/" + listName);
      })
   }
})

app.post("/delete", (req, res) => {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
   Item.findByIdAndRemove(checkedItemId)
   .then(function(items) {
      console.log("Succsessfully deleted!!")
      res.redirect("/")
   })
   .catch(function(err){
      console.log(err)
   })
  } else {
      List.findOneAndUpdate(
         {name: listName},
         {$pull: {items: {_id: checkedItemId }}}
      )
      .then(function(foundList){
         res.redirect("/" + listName);
      })
      .catch(function(err){
         console.log(err)
      })
  }
})

const port = process.env.PORT;
if (port == null || port == "") {
   port = 5000;
}
app.listen(port)

app.listen(port, () => {
   console.log(`Server has started`);
})
