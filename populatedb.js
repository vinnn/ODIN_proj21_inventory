#! /usr/bin/env node

console.log('This script populates some test categories and items to the database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Category = require('./models/category')
var Item = require('./models/item')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var categories = []
var items = []


function categoryCreate(name, description, cb) {
  // include the required fields:
  categorydetail = {name:name }
  // and for non required fields:
  if (description != false) categorydetail.description = description
  
  var category = new Category(categorydetail);
       
  category.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Category: ' + category);
    categories.push(category)
    cb(null, category)
  }  );
}

function itemCreate(text, title, author, source, year, category, cb) {
  // include the required fields:
  itemdetail = { text: text, category: category }
  // and for non required fields:
  if (title != false) itemdetail.title = title
  if (author != false) itemdetail.author = author  
  if (source != false) itemdetail.source = source
  if (year != false) itemdetail.year = year

  var item = new Item(itemdetail);
       
  item.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Item: ' + item);
    items.push(item)
    cb(null, item)
  }  );
}






function createCategories(cb) {
    async.series([
        function(callback) {
          categoryCreate('Garden', 'anything to do in the garden', callback);
        },
        function(callback) {
          categoryCreate('House', 'anything to do in the house', callback);
        },
        ],
        // optional callback
        cb);
}



function createItems(cb) {
    async.parallel([
        function(callback) {
          itemCreate("Cut the hedges all around", "hedges", "Davis McDerby", "The book of lawn and greens", 1923, categories[0], callback);
        },
        function(callback) {
          itemCreate("Vacuum the leaves", "ground", "Percy Square", "Evening Standard", 2009, categories[0], callback);
        },
        function(callback) {
          itemCreate("Mop on the first and second floors", "floor", "Bob", false, false, categories[1], callback);
        },
        ],
        // optional callback
        cb);
}



async.series([
  createCategories,
  createItems
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('ITEMS: '+items);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});



