const { connectMongoose } = require('../connect');
const collectionName = process.env.DB_COLL_NAME;
const { Schema, model } = require('mongoose');

const listingSchema = new Schema({
    company: String,
    title: String,
    skills: String,
    job_type: String,
    url: String,
    date_expiration: Date,
    description_text: String
  });

class ListingClass {
    static async createNew(listing) {
        try {
            const newListing = await Listing.create(listing);
            return newListing;
        }
        catch (e) {
            console.error(e);
            throw new Error("Server error. Failed to create new listing.");
        }
    }
    static async readAll() {
        try {
            const results = await Listing.find();
            return results;
        }
        catch (e) {
            console.error(e);
            return [];
        }
    }

    static async sortByCompany(company) {
        try {
            const results = await Listing.find({company: company}).exec();
            return results;
          }
          catch (e) {
            console.error(e);
            return [];
          }
    }

    static async sortByKeyword(keyword) {
        try {
            const results = await Listing.find({
                $or: [
                { company: { $regex: keyword, $options: 'i' } },
                { title: { $regex: keyword, $options: 'i' } },
                { skills: { $regex: keyword, $options: 'i' } },
                { job_type: { $regex: keyword, $options: 'i' } }
                ]
            }).exec();
            return results;
          }
          catch (e) {
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
    static async delete(listingId) {
        try {
            const result = await Listing.deleteOne({_id: listingId});
            return result;
        }
        catch (e) {
            console.error(e);
            return {deletedCount: 0};
        }
    }
}

listingSchema.loadClass(ListingClass);
const Listing = model('Listing', listingSchema, collectionName);
module.exports = Listing;