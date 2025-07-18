const { connectMongoose } = require("../connect");
const collectionName = process.env.DB_COLL_NAME4;
const { Schema, model } = require("mongoose");

const appliedJobsSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  company: String,
  title: String,
  skills: String,
  job_type: String,
  url: String,
  date_expiration: Date,
  date_applied: {
    type: Date,
    default: Date.now,
  },
});

class AppliedJobsClass {
  static async createNew(appliedJob) {
    try {
      const exists = await AppliedJobs.findOne({
        userId: appliedJob.userId,
        company: appliedJob.company,
        title: appliedJob.title,
      });

      if (!exists) {
        const newAppliedJob = await AppliedJobs.create(appliedJob);
        return newAppliedJob;
      } else {
        console.log(
          "Skipped duplicate applied job:",
          appliedJob.company,
          appliedJob.title,
          userId
        );
      }
    } catch (e) {
      console.error(e);
    }
  }

  static async readAll(userId) {
    try {
      return await AppliedJobs.find({ userId }).exec();
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  static async sortByCompany(userId, company) {
    try {
      return await AppliedJobs.find({ userId, company }).exec();
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  static async sortByKeyword(userId, keyword) {
    try {
      return await AppliedJobs.find({
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

  static async delete(appliedJobId, userId) {
    try {
      return await AppliedJobs.deleteOne({ _id: appliedJobId, userId });
    } catch (e) {
      console.error(e);
      return { deletedCount: 0 };
    }
  }

  static async findMostRecent(userId) {
    try {
      return await AppliedJobs.findOne({ userId })
        .sort({ date_applied: -1 })
        .exec();
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  static async countAppliedJobsWithinWeek(userId) {
    try {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return await AppliedJobs.countDocuments({
        userId,
        date_applied: { $gte: weekAgo },
      });
    } catch (e) {
      console.error(e);
      return 0;
    }
  }
}

appliedJobsSchema.loadClass(AppliedJobsClass);
const AppliedJobs = model("AppliedJobs", appliedJobsSchema, collectionName);
module.exports = AppliedJobs;
