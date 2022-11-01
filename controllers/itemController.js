const Item = require("../models/item");
const Category = require("../models/category");
const async = require("async");
const { body, validationResult } = require("express-validator");

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Display list of all Items.
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
exports.item_list = (req, res, next) => {
  Item.find()
    .sort([["text", "ascending"]])
    .populate("categories")
    .exec(function (err, list_items) {
      if (err) {
        return next(err);
      }
      // Successful, so render
      res.render("item_list", {
        title: "All Items",
        item_list: list_items,
      });
    });
};


// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Display detail page for a specific Item.
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
exports.item_detail = (req, res, next) => {
  async.parallel(
    {
      item(callback) {
        Item.findById(req.params.id)
          .populate("categories")
          .exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.item == null) {
        // No results.
        const err = new Error("Item not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render("item_detail", {
        item: results.item,
        title: results.item.title,
        text: results.item.text,
        author: results.item.author,
        source: results.item.source,
        year: results.item.year,
        categories: results.item.categories,
      });
    }
  );
};






// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Display Item create form on GET.
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
exports.item_create_get = (req, res, next) => {

  async.parallel(
    {
      items(callback) {
        Item.find(callback);
      },
      categories(callback) {
        Category.find(callback);
      }
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render("item_form", {
        form_title: "Create Item",
        categories: results.categories,
        errors: [],
      })
    }
  )
};

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Handle Item create on POST.
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
exports.item_create_post = [
  // Convert the categories to an array.
  (req, res, next) => {
    console.log("req.body", req.body);
    if (!Array.isArray(req.body.item_category_ids)) {
      req.body.item_category_ids =
        typeof req.body.item_category_ids === "undefined" ? [] : [req.body.item_category_ids];
    }
    console.log("req.body.item_category_ids", req.body.item_category_ids)
    next();
  },

  // Validate and sanitize fields.
  body("item_title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("item_text", "Text must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("item_author", "Author - escape.")
    .trim()
    .escape(),
  body("item_source", "Source - escape.")
    .trim()
    .escape(),
  body("item_year", "Year - escape    !!!! FORMAT TO CHECK")
    .trim()
    .escape(),
  body("item_category_ids.*").escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Book object with escaped and trimmed data.
    const item = new Item({
      title: req.body.item_title,
      text: req.body.item_text,
      author: req.body.item_author,
      source: req.body.item_source,
      year: req.body.item_year,
      categories: req.body.item_category_ids,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again 
      // but pre-filled and
      // with sanitized values/error messages.

      // Get all categories for form.
      async.parallel(
        {
          categories(callback) {
            Category.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }

          // Mark our selected categories as checked.
          // for (const category of results.categories) {
          //   if (item.categories.includes(category._id)) {
          //     category.checked = "true";  
          // // (dont know ehere this checked property is from...)
          //   }
          // }

          console.log("errors", errors);

          res.render("item_form", {
            form_title: "Create Item (try again)",
            item_title: req.body.item_title,
            item_text: req.body.item_text,
            item_author: req.body.item_author,
            item_source: req.body.item_source,
            item_year: req.body.item_year,
            item_categories: req.body.item_category_ids,
            categories: results.categories,
            errors: errors.array(),
          });
        }
      );
      return;
    }

    // Data from form is valid. Save book.
    item.save((err) => {
      if (err) {
        return next(err);
      }
      // Successful: redirect to new book record.
      res.redirect(item.url);
    });
  },
];




// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Display Item delete form on GET.
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
exports.item_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Item delete GET");
};

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Handle Item delete on POST.
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
exports.item_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Item delete POST");
};




// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Display Item update form on GET.
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
exports.item_update_get = (req, res) => {
  // Get items for form.
  async.parallel(
    {
      item(callback) {
        Item.findById(req.params.id)
          .populate("categories")
          .exec(callback);
      },
      categories(callback) {
        Category.find(callback);
      },
    },
    (err, results) => {

      console.log(results.item)

      if (err) {
        return next(err);
      }
      if (results.item == null) {
        // No results.
        const err = new Error("Item not found");
        err.status = 404;
        return next(err);
      }
      // Success.
      res.render("item_form", {
        form_title: "Update Item",
        item_title: results.item.title,
        item_text: results.item.text,
        item_author: results.item.author,
        item_source: results.item.source,
        item_year: results.item.year,
        item_categories: results.item.categories,
        categories: results.categories,
        errors: [],
      });
    }
  );
};

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Handle Item update on POST.
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
exports.item_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Item update POST");
};

