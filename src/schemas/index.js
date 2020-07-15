const mongoose = require("mongoose");
module.exports = () => {
  const connect = () => {
    if (process.env.NODE_ENV !== "production") {
      mongoose.set("debug", true);
    }
    mongoose.connect(
      `mongodb+srv://btime906:gg304a778@cluster0.5uznu.gcp.mongodb.net/<dbname>?retryWrites=true&w=majority`,
      {
        dbName: "emo",
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      (err) => {
        if (err) {
          console.log("몽고디비 연결 에러", err);
        } else {
          console.log("몽고디비 연결 성공");
        }
      }
    );
  };
  connect();
  mongoose.connection.on("error", (err) => {
    console.error("몽고디비 연결 에러", err);
  });
  mongoose.connection.on("disconnected", () => {
    console.error("몽고디비 연결이 끊겼습니다. 연결을 재 시도합니다");
    connect();
  });
  require("./User");
};
