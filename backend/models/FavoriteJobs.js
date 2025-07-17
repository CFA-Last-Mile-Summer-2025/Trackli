const { connectMongoose } = require("../connect");
const collectionName = process.env.DB_COLL_NAME5;
const { Schema, model } = require("mongoose");

const favoriteJobsSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  company: String,
  title: String,
  skills: String,
  job_type: String,
  url: String,
  date_saved: {
    type: Date,
    default: Date.now,
  },
});

class FavoriteJobClass {
  static async createNew(favJob) {
    try {
      const exists = await FavoriteJob.findOne({
        userId: favJob.userId,
        title: favJob.title,
        company: favJob.company,
      });

      if (!exists) {
        const newFavJob = await FavoriteJob.create(favJob);
        return newFavJob;
      } else {
        console.log("Skipped duplicate favorite job:", favJob.title);
      }
    } catch (e) {
      console.error(e);
    }
  }

  static async getAllFavoriteUser(userId) {
    try {
      return await FavoriteJob.find({ userId }).exec();
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  static async deleteFavoriteUser(userId, jobId) {
    try {
      return await FavoriteJob.deleteOne({ _id: jobId, userId });
    } catch (e) {
      console.error(e);
      return { deletedCount: 0 };
    }
  }
}

favoriteJobsSchema.loadClass(FavoriteJobClass);
const FavoriteJobs = model("FavoriteJobs", favoriteJobsSchema, collectionName);
module.exports = FavoriteJobs;
