const { connectMongoose } = require("../connect");
const collectionName = process.env.DB_COLL_NAME6;
const { Schema, model } = require("mongoose");

const myJobsSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  company: String,
  title: String,
  skills: String,
  job_type: String,
  url: String,
  date_expiration: Date,
  date_added: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["saved", "applied", "offered", "closed", "interview"],
    default: "saved",
  },
});

class MyJobsClass {
  static async createNew(job) {
    try {
      const exists = await MyJobs.findOne({
        userId: job.userId,
        company: job.company,
        title: job.title,
      });

      if (!exists) {
        const created = await MyJobs.create(job);
        return created;
      } else {
        console.log(
          "Skipped duplicate job:",
          job.company,
          job.title,
          job.userId
        );
      }
    } catch (e) {
      console.error(e);
    }
  }

  static async readAll(userId) {
    try {
      return await MyJobs.find({ userId });
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  static async sortByCompany(userId, company) {
    try {
      return await MyJobs.find({ userId, company }).exec();
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  //A-Z company names
  static async sortByCompanyName(userId) {
    try {
      return await MyJobs.find({ userId }).sort({ company: 1 }).exec();
    } catch (e) {
      console.error(e);
      return [];
    }
  }
  
  //A-Z job titles
  static async sortByTitle(userId) {
    try {
      return await MyJobs.find({ userId }).sort({ title: 1 }).exec();
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  static async sortByKeyword(userId, keyword) {
    try {
      return await MyJobs.find({
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

  static async delete(myJobId, userId) {
    try {
      return await MyJobs.deleteOne({ _id: myJobId, userId });
    } catch (e) {
      console.error(e);
      return { deletedCount: 0 };
    }
  }

  static async findMostRecent(userId) {
    try {
      return await MyJobs.find({ userId }).sort({ date_added: -1 }).exec();
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  static async updateStatus(jobId, userId, newStatus) {
    try {
      const updated = await MyJobs.findOneAndUpdate(
        { _id: jobId, userId },
        { status: newStatus },
        { new: true }
      );
      return updated;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  static async findByStatusSorted(userId, status) {
    try {
      return await MyJobs.find({ userId, status })
        .sort({ date_added: -1 })
        .exec();
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  static async findByStatusesSorted(userId, statuses) {
    try {
      return await MyJobs.find({
        userId,
        status: { $in: statuses },
      }).sort({ date_added: -1 });
    } catch (e) {
      console.error(e);
      return [];
    }
  }
}

myJobsSchema.loadClass(MyJobsClass);
const MyJobs = model("MyJobs", myJobsSchema, collectionName);
module.exports = MyJobs;
