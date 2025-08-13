const { connectMongoose } = require("../connect");
const collectionName = process.env.DB_COLL_NAME3;
const { Schema, model } = require("mongoose");

const viewedJobsSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  company: String,
  title: String,
  skills: String,
  job_type: String,
  url: String,
  date_expiration: Date,
  date_viewed: {
    type: Date,
    default: Date.now,
  },
});

class ViewedJobsClass {
  static async createNew(job) {
    try {
      const exists = await ViewedJobs.findOne({
        userId: job.userId,
        company: job.company,
        title: job.title,
      });

      if (!exists) {
        const created = await ViewedJobs.create(job);
        return created;
      }
    } catch (e) {
      console.error(e);
    }
  }

  static async readAll(userId) {
    try {
      return await ViewedJobs.find({ userId });
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  static async sortByCompany(userId, company) {
    try {
      return await ViewedJobs.find({ userId, company }).exec();
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  static async sortByKeyword(userId, keyword) {
    try {
      return await ViewedJobs.find({
        userId,
        $or: [
          { company: { $regex: keyword, $options: "i" } },
          { title: { $regex: keyword, $options: "i" } },
          { skills: { $regex: keyword, $options: "i" } },
          { job_type: { $regex: keyword, $options: "i" } },
        ],
      }).exec();
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  static async delete(viewedJobId, userId) {
    try {
      return await ViewedJobs.deleteOne({ _id: viewedJobId, userId });
    } catch (e) {
      console.error(e);
      return { deletedCount: 0 };
    }
  }

  static async findMostRecent(userId) {
    try {
      return await ViewedJobs.findOne({ userId })
        .sort({ date_viewed: -1 })
        .exec();
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  static async countViewedJobsWithinWeek(userId) {
    try {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return await ViewedJobs.countDocuments({
        userId,
        date_viewed: { $gte: weekAgo },
      });
    } catch (e) {
      console.error(e);
      return 0;
    }
  }
}

viewedJobsSchema.loadClass(ViewedJobsClass);
const ViewedJobs = model("ViewedJobs", viewedJobsSchema, collectionName);
module.exports = ViewedJobs;
