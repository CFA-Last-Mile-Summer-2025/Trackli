const { connectMongoose } = require("../connect");
const collectionName = process.env.DB_COLL_NAME2;
const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  resumes: [
  {
    type: Object,
    required: false,
  }
]
});

class UserClass {
  static async createNew(user) {
    try {
      const newUser = await User.create(user);
      return newUser;
    } catch (e) {
      console.error(e);
      res.status(500).send("Server error. Fail to create new user.");
    }
  }
  static async readAll() {
    try {
      const results = await User.find();
      return results;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  static async sortByKeyword(keyword) {
    try {
      const results = await User.find(
        $or[
          ({ name: { $regex: keyword, $options: "i" } },
          { _id: { $regex: keyword, $options: "i" } })
        ]
      ).exec();
      return results;
    } catch (e) {
      console.error(e);
      return [];
    }
  }
  // static async update(messageId, messageUpdate) {
  //     try {
  //     const result = await Message.updateOne({_id: messageId}, messageUpdate);
  //     return result;
  //     }
  //     catch (e) {
  //     console.error(e);
  //     return {
  //         modifiedCount: 0,
  //         acknowledged: false
  //     }
  //     }
  // }
  static async delete(userId) {
    try {
      const result = await User.deleteOne({ _id: userId });
      return result;
    } catch (e) {
      console.error(e);
      return { deletedCount: 0 };
    }
  }
}

userSchema.loadClass(UserClass);
const User = model("User", userSchema, collectionName);
module.exports = User;
