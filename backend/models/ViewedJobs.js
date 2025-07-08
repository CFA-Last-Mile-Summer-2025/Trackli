const { connectMongoose } = require('../connect');
const collectionName = process.env.DB_COLL_NAME;
const { Schema, model } = require('mongoose');

const viewedJobsSchema = new Schema({
    company: String,
    title: String,
    skills: String,
    job_type: String,
    url: String,
    date_expiration: Date,
    favorite: { 
        type: Boolean,
        default: false
    },
    date_viewed: {
        type: Date,
        default: Date.now
    }
});

class ViewedJobsClass {
    static async createNew(viewedJob) {
        try {
            const newViewedJob = await ViewedJobs.create(viewedJob);
            return newViewedJob;
        } catch (e) {
            console.error(e);
            throw new Error("Server error. Failed to create new viewed job.");
        }
    }

    static async readAll() {
        try {
            return await ViewedJobs.find();
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    static async sortByCompany(company) {
        try {
            return await ViewedJobs.find({ company }).exec();
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    static async sortByKeyword(keyword) {
        try {
            return await ViewedJobs.find({
                $or: [
                    { company: { $regex: keyword, $options: 'i' } },
                    { title: { $regex: keyword, $options: 'i' } },
                    { skills: { $regex: keyword, $options: 'i' } },
                    { job_type: { $regex: keyword, $options: 'i' } }
                ]
            }).exec();
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    static async delete(viewedJobId) {
        try {
            return await ViewedJobs.deleteOne({ _id: viewedJobId });
        } catch (e) {
            console.error(e);
            return { deletedCount: 0 };
        }
    }

    static async findMostRecent() {
        try {
            return await ViewedJobs.findOne().sort({ date_viewed: -1 }).exec();
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    static async setFavorite(viewedJobId) {
        try {
            return await ViewedJobs.updateOne(
            { _id: viewedJobId },
            { $set: { favorite: true } }
            );
        } catch (e) {
            console.error(e);
            return { favoritedItems: 0}
        }
    }

    static async unsetFavorite(viewedJobId) {
        try {
            return await ViewedJobs.updateOne(
            { _id: viewedJobId },
            { $set: { favorite: false } }
            );
        } catch (e) {
            console.error(e);
            return { unfavoritedItems: 0}
        }
    }

    // sort by favorites, tie break with date viewed
    static async getSortedByFavorite() {
        try {
            return await ViewedJobs.find().sort({ favorite: -1, date_viewed: -1 }).exec();
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    // get a random job from the ones favorited
    static async getRandomFavorite() {
        try {
            const [randomFavorite] = await ViewedJobs.aggregate([
            { $match: { favorite: true } },
            { $sample: { size: 1 } }
            ]);
            return randomFavorite || null;
        } catch (e) {
            console.error(e);
            return null;
        }
    }
}

viewedJobsSchema.loadClass(ViewedJobsClass);
const ViewedJobs = model('ViewedJobs', viewedJobsSchema, collectionName);
module.exports = ViewedJobs;
