const { connectMongoose } = require("../connect");
const collectionName = process.env.DB_COLL_NAME2;
const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  resumes: [
    {
      type: Object,
      required: false,
    },
  ],
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

  static async getUsernameById(userId) {
    try {
      const user = await User.findById(userId).select("name");
      return user ? user.name : null;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  static async updateName(userId, newName) {
    try {
      const result = await User.updateOne(
        { _id: userId },
        { $set: { name: newName } }
      );
      return result;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  static async updateEmail(userId, newEmail) {
    try {
      const result = await User.updateOne({ _id: userId }, { email: newEmail });
      return result;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  static async updatePassword(userId, oldPassword, newPassword) {
    try {
      const user = await User.findById(userId);
      if (!user) return { message: "User not found" };

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) return { message: "Incorrect current password" };

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      await User.updateOne(
        { _id: userId },
        { $set: { password: hashedNewPassword } }
      );

      return { message: "Password updated" };
    } catch (e) {
      console.error(e);
      return { message: "Server error" };
    }
  }
}

userSchema.pre(
  "deleteOne",
  { document: false, query: true },
  async function (next) {
    try {
      const filter = this.getFilter();
      const userId = filter._id;

      const AppliedJobs = require("./AppliedJobs");
      const ViewedJobs = require("./ViewedJobs");
      const FavoriteJobs = require("./FavoriteJobs");
      const MyJobs = require("./myJobs");

      await AppliedJobs.deleteMany({ userId });
      await ViewedJobs.deleteMany({ userId });
      await FavoriteJobs.deleteMany({ userId });
      await MyJobs.deleteMany({ userId });
      next();
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
);

userSchema.loadClass(UserClass);
const User = model("User", userSchema, collectionName);
module.exports = User;
