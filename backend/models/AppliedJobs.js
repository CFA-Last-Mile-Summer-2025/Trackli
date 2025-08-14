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

static async groupByDate(userId) {
  try {
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - 7); // 7 days ago

    const jobs = await AppliedJobs.find({
      userId,
      date_applied: { $gte: startDate },
    });

    // Initialize date map for the last 8 days (today + 7 previous days)
    const dateMap = {};
    for (let i = 0; i <= 7; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const formatted = d.toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        timeZone: "UTC",
      });
      dateMap[formatted] = 0;
    }

    // Count job applications per day
    jobs.forEach((job) => {
      const formatted = new Date(job.date_applied).toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        timeZone: "UTC",
      });
      if (dateMap.hasOwnProperty(formatted)) {
        dateMap[formatted]++;
      }
    });

    // Return array for frontend charting
    return Object.entries(dateMap).map(([date, count]) => ({
      date,
      desktop: count,
    }));
  } catch (e) {
    console.error(e);
    return [];
  }
}

static async countTotalAppliedJobs(userId) {
  try {
    return await AppliedJobs.countDocuments({ userId });
  } catch (e) {
    console.error(e);
    return 0;
  }
}


}

appliedJobsSchema.loadClass(AppliedJobsClass);
const AppliedJobs = model("AppliedJobs", appliedJobsSchema, collectionName);
module.exports = AppliedJobs;
