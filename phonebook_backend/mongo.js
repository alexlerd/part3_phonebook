const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);

mongoose
  .connect(url)
  .then(() => {
    console.log("connected to MongoDB");
    const personSchema = new mongoose.Schema(
      {
        name: String,
        number: String,
        id: String,
      },
      { collection: "people" }
    );

    const Person = mongoose.model("Person", personSchema);

    Person.find({})
      .then((persons) => {
        console.log("phonebook:");
        persons.forEach((person) => {
          console.log(`${person.name} ${person.number}`);
        });
        mongoose.connection.close();
      })
      .catch((error) => {
        console.log("error finding persons:", error.message);
      });
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });
