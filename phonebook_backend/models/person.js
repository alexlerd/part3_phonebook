const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("connecting to", url);
mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: function (v) {
        const regex = /^\d{2,3}-\d{6,}$|^\d{8,}$/;
        return regex.test(v);
      },
      message: "Phone number must be in the format XX-XXXXXXX or XXX-XXXXXXXX",
    },
    required: true,
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
personSchema.methods.validate = function () {
  if (this.name.length < 3) {
    throw new Error("Name must be at least 3 characters long");
  }
};

module.exports = mongoose.model("Person", personSchema);
