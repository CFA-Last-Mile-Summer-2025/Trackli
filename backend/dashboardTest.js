require("dotenv").config();
const { connectMongoose } = require("./connect");
const mongoose = require("mongoose");
const ViewedJobs = require("./models/ViewedJobs");
const AppliedJobs = require("./models/AppliedJobs");

async function superSimpleTests() {
  try {
    await connectMongoose();

    const viewed = await ViewedJobs.createNew({
      company: "Computing For All",
      title: "Frontend Developer Intern",
      skills: "React, CSS, HTML, JS, & Python",
      job_type: "Internship",
      url: "https://www.computingforall.org/",
      date_expiration: new Date("2025-08-01"),
    });
    console.log("Created viewed job:", viewed);

    const viewed2 = await ViewedJobs.createNew({
      company: "LikedJOB",
      title: "Intern",
      skills: "",
      job_type: "Internship",
      url: "https://www.example.com",
      favorite: true,
      date_expiration: new Date("2025-08-01"),
    });
    console.log("Created viewed job:", viewed2);

    const viewed3 = await ViewedJobs.createNew({
      company: "SYEP",
      title: "Intern",
      skills: "",
      job_type: "Internship",
      url: "https://www.seattle.gov/human-services/services-and-programs/youth-and-young-adults/seattle-youth-employment-program",
      date_expiration: new Date("2025-08-01"),
    });
    console.log("Created viewed job:", viewed3);

    await ViewedJobs.setFavorite(viewed._id);
    console.log("Marked first viewed job as favorite");

    const mostRecent = await ViewedJobs.findMostRecent();
    console.log("Most recent viewed job:", mostRecent); // should be SYEP

    const sorted = await ViewedJobs.getSortedByFavorite();
    console.log("All viewed jobs sorted by favorite:", sorted); // should be likedJOB -> CFA -> SYEP

    const randomFavorite = await ViewedJobs.getRandomFavorite();
    console.log("Random favorite viewed job:", randomFavorite); // Either likedJOB or CFA

    const applied = await AppliedJobs.createNew({
      company: "MicroSoft Explorer",
      title: "Backend Developer Intern",
      skills: "Node, MongoDB",
      job_type: "Intern",
      url: "https://www.computingforall.org/",
      date_expiration: new Date("2025-08-01"),
    });
    console.log("Created applied job:", applied);

    const appliedCount = await AppliedJobs.countAppliedJobsWithinWeek();
    console.log(`Number of applied jobs in last 7 days: ${appliedCount}`); // should be 1 unless db wasn't cleared out and multiple tests were ran
  } catch (e) {
    console.error(e);
  } finally {
    await mongoose.disconnect();
  }
}

superSimpleTests();
