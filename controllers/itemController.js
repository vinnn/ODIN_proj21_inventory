const Item = require("../models/item");
const Category = require("../models/category");
const async = require("async");
const { body, validationResult } = require("express-validator");


// Display list of all Item.
exports.item_list = (req, res, next) => {
  Item.find()
    .sort([["text", "ascending"]])
    .populate("category")
    .exec(function (err, list_items) {
      if (err) {
        return next(err);
      }
      // Successful, so render
      res.render("item_list", {
        title: "Item List",
        item_list: list_items,
      });
    });

};



// Display detail page for a specific Item.
exports.item_detail = (req, res, next) => {
    res.send("NOT IMPLEMENTED: Item detail");
};

// Display Item create form on GET.
exports.item_create_get = (req, res, next) => {
    res.send("NOT IMPLEMENTED: Item create GET");
};

// Handle Item create on POST.
exports.item_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Item create POST");
};

// Display Item delete form on GET.
exports.item_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Item delete GET");
};

// Handle Item delete on POST.
exports.item_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Item delete POST");
};

// Display Item update form on GET.
exports.item_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Item update GET");
};

// Handle Item update on POST.
exports.item_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Item update POST");
};

