const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  items: [{ type: Schema.Types.ObjectId, ref: "Item", required: false }], // reference to the associated items (many-to-many relationship, although a category may have no item)
});

// Virtual for book's URL
CategorySchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/category/${this._id}`;
});

// Export model
module.exports = mongoose.model("Category", CategorySchema);

