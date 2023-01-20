// const mongoose = require("mongoose");
// mongoose.set("strictQuery", true);
// const mongoConnection = async () => {
//   try {
//     const mongoString = process.env.MONGO_STRING;
//     const conn = await mongoose.connect(mongoString, {
//       useNewUrlParser: true,
//     });
//     console.log(
//       `Database Connect Successfully to host : ${conn.connection.host}`
//         .bgMagenta.black
//     );
//   } catch (err) {
//     console.log(`${err.message}`.bgRed.white);
//     process.exit(1);
//   }
// };

// module.exports = mongoConnection;

let mongoose = require("mongoose");
mongoose.set("strictQuery", true);
async function mongoConnection() {
  try {
    let mongoString = process.env.MONGO_STRING;
    let conn = await mongoose.connect(mongoString, {
      useNewUrlParser: true,
    });

    console.log(
      `Database Connect Successfully to host : ${conn.connection.host}`
        .bgMagenta.black
    );
  } catch (err) {
    console.log(`${err.message}`.bgRed.white);
    // process.exit(1);
  }
}

module.exports = mongoConnection;
