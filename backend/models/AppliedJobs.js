const { connectMongoose } = require("../connect");
const collectionName = process.env.DB_COLL_NAME4;
const { Schema, model } = require("mongoose");

const appliedJobsSchema = new Schema({
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
        company: appliedJob.company,
        title: appliedJob.title,
      });

      if (!exists) {
        const newAppliedJob = await AppliedJobs.create(appliedJob);
        return newAppliedJob;
      } else {
        console.log("Skipped duplicate applied job:", appliedJob.company, appliedJob.title);
      }
    } catch (e) {
      console.error(e);
    }
  }

  static async readAll() {
    try {
      return await AppliedJobs.find();
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  static async sortByCompany(company) {
    try {
      return await AppliedJobs.find({ company }).exec();
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  static async sortByKeyword(keyword) {
    try {
      return await AppliedJobs.find({
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

  static async delete(appliedJobId) {
    try {
      return await AppliedJobs.deleteOne({ _id: appliedJobId });
    } catch (e) {
      console.error(e);
      return { deletedCount: 0 };
    }
  }

  static async findMostRecent() {
    try {
      return await AppliedJobs.findOne().sort({ date_applied: -1 }).exec();
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  // Track applications submitted this week
  // returns the number not the actual jobs
  static async countAppliedJobsWithinWeek() {
    try {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return await AppliedJobs.countDocuments({
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
