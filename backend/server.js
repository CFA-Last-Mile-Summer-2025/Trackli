const cors = require("cors");
const express = require("express");
const { connectMongoose } = require("./connect");
const Listing = require("./models/Listing");
const User = require("./models/User");
const AppliedJobs = require("./models/AppliedJobs");
const ViewedJobs = require("./models/ViewedJobs");
const FavoriteJobs = require("./models/FavoriteJobs");
const MyJobs = require("./models/myJobs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { GoogleGenAI } = require("@google/genai");

const port = process.env.PORT || 3002;
const app = express();
require("dotenv").config();
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.use(cors());
app.use(express.json());

// API
const options = {
  method: "GET",
  url: "https://internships-api.p.rapidapi.com/active-jb-7d",
  params: {
    description_type: "text",
    include_ai: "true",
  },
  headers: {
    "x-rapidapi-key": process.env.RAPID_API_KEY,
    "x-rapidapi-host": "internships-api.p.rapidapi.com",
  },
};

async function fetchDataAndSave(offset = 0) {
  try {
    const response = await axios.request({
      ...options,
      params: {
        ...options.params,
        offset,
      },
    });
    const jobs = response.data;

    for (const job of jobs) {
      console.log("ai_key_skills:", job.ai_key_skills);
      const listing = {
        company: job.organization || "Unknown",
        title: job.title || "N/A",
        skills: (job.ai_key_skills || []).join(", "),
        job_type: (job.employment_type || []).join(", "),
        url: job.url || "N/A",
        date_expiration: job.date_validthrough,
        description_text: job.description_text,
        location: (job.cities_derived || []).join(", "),
      };

      const exists = await Listing.findOne({
        company: listing.company,
        title: listing.title,
        url: listing.url,
      });

      if (!exists) {
        await Listing.createNew(listing);
        console.log("Inserted:", listing.title, "at", listing.company);
      } else {
        console.log(
          "Skipped duplicate:",
          listing.title,
          "------------------------------------------------------"
        );
      }
    }
  } catch (err) {
    console.error("Error fetching/saving jobs:", err);
  }
}

//API caller
app.get("/getjobs", async (req, res) => {
  const offset = parseInt(req.query.offset) || 0;
  console.log("offset:", offset);
  try {
    await fetchDataAndSave(offset);
    res.status(200).json("Jobs fetched and saved.");
  } catch (err) {
    res.status(500).json("Error fetching jobs.");
  }
});

//JWT verification
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token." });
    req.user = decoded;
    next();
  });
}

// ---------------------------------------JOBS-----------------------------------------------------

//Listing
app.post("/createjob", async (req, res) => {
  const newJob = req.body;

  if (!newJob || Object.keys(newJob).length === 0) {
    return res.status(400).send("Empty request body");
  }

  const results = await Listing.createNew(newJob);
  res.status(201).json(results);

  console.log("POST request received on create route");
  console.log(`New listing created with id: ${results._id}`);
});

app.get("/jobs", async (req, res) => {
  const results = await Listing.readAll();
  res.send(results);
  console.log("GET request received on home page, jobs: " + results);
});

app.get("/searchjob", async (req, res) => {
  const { keyword = "", company = "" } = req.query;

  const query = {};

  if (keyword) {
    query.$or = [
      { title: { $regex: keyword, $options: "i" } },
      { skills: { $regex: keyword, $options: "i" } },
    ];
  }

  if (company) {
    query.company = company;
  }

  try {
    const results = await Listing.find(query);
    res.send(results);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Search failed" });
  }
});

app.get("/listings", async (req, res) => {
  try {
    const listings = await Listing.readAll();
    res.json(listings);
  } catch (error) {
    console.error("Failed to fetch listings:", error);
    res.status(500).json({ error: "Failed to fetch listings" });
  }
});

app.delete("/deletejob", async (req, res) => {
  const results = await Listing.delete(req.query.id);
  if (results.deletedCount === 0) {
    return res.status(404).send("Listing not found");
  }
  res.sendStatus(200);
  console.log("DELETE request received on delete route");
  console.log(`Listing deleted with id: ${req.query.id}`);
});

app.get("/locations", async (req, res) => {
  try {
    const locations = await Listing.distinct("location");
    res.json(locations.filter(Boolean));
  } catch (err) {
    console.error("Error fetching locations:", err);
    res.status(500).json({ error: "Failed to fetch locations" });
  }
});

//Viewed jobs
app.post("/viewed", verifyToken, async (req, res) => {
  const job = req.body;
  const userId = req.user.userId;

  if (!job || !job.title || !job.company) {
    return res.status(400).json({ message: "Missing job information" });
  }

  job.userId = userId;
  const newViewedJob = await ViewedJobs.createNew(job);
  res.status(200).json({ message: "Viewed job added", job: newViewedJob });
});

app.get("/viewed", verifyToken, async (req, res) => {
  const userId = req.user.userId;
  const jobs = await ViewedJobs.readAll(userId);
  res.json(jobs);
});

app.get("/viewed/company/:company", verifyToken, async (req, res) => {
  const userId = req.user.userId;
  const { company } = req.params;
  const jobs = await ViewedJobs.sortByCompany(userId, company);
  res.json(jobs);
});

app.get("/viewed/search", verifyToken, async (req, res) => {
  const userId = req.user.userId;
  const keyword = req.query.keyword;
  const jobs = await ViewedJobs.sortByKeyword(userId, keyword);
  res.json(jobs);
});

app.get("/viewed/recent", verifyToken, async (req, res) => {
  const userId = req.user.userId;
  const job = await ViewedJobs.findMostRecent(userId);
  res.json(job);
});

app.get("/viewed/recentWeek", verifyToken, async (req, res) => {
  const userId = req.user.userId;
  const jobcount = await ViewedJobs.countViewedJobsWithinWeek(userId);
  res.json(jobcount);
});

app.delete("/viewed/:jobId", verifyToken, async (req, res) => {
  const userId = req.user.userId;
  const { jobId } = req.params;
  const result = await ViewedJobs.delete(jobId, userId);
  res.json(result);
});

//applied jobs
app.post("/applied", verifyToken, async (req, res) => {
  const job = req.body;
  const userId = req.user.userId;

  if (!job || !job.title || !job.company) {
    return res.status(400).json({ message: "Missing job information" });
  }

  job.userId = userId;
  const newAppliedJob = await AppliedJobs.createNew(job);
  res.status(200).json({ message: "Applied job added", job: newAppliedJob });
});

app.get("/applied", verifyToken, async (req, res) => {
  const userId = req.user.userId;
  const jobs = await AppliedJobs.readAll(userId);
  res.json(jobs);
});

app.get("/applied/company/:company", verifyToken, async (req, res) => {
  const userId = req.user.userId;
  const { company } = req.params;
  const jobs = await AppliedJobs.sortByCompany(userId, company);
  res.json(jobs);
});

app.get("/applied/search", verifyToken, async (req, res) => {
  const userId = req.user.userId;
  const keyword = req.query.keyword;
  const jobs = await AppliedJobs.sortByKeyword(userId, keyword);
  res.json(jobs);
});

app.get("/applied/recent", verifyToken, async (req, res) => {
  const userId = req.user.userId;
  const job = await AppliedJobs.findMostRecent(userId);
  res.json(job);
});

app.get("/applied/recentWeek", verifyToken, async (req, res) => {
  const userId = req.user.userId;
  const jobcount = await AppliedJobs.countAppliedJobsWithinWeek(userId);
  res.json(jobcount);
});

app.get("/applied/weekly-breakdown", verifyToken, async (req, res) => {
  const userId = req.user.userId;
  const dayMap = await AppliedJobs.groupByDate(userId);
  res.json(dayMap);
});

app.delete("/applied/:jobId", verifyToken, async (req, res) => {
  const userId = req.user.userId;
  const { jobId } = req.params;
  const result = await AppliedJobs.delete(jobId, userId);
  res.json(result);
});

//favorite jobs
app.post("/addFavorite", verifyToken, async (req, res) => {
  const job = req.body;
  const userId = req.user.userId;

  if (!job || !job.title || !job.company) {
    return res.status(400).json({ message: "Missing job or company info" });
  }

  job.userId = userId;
  const newFavJob = await FavoriteJobs.createNew(job);
  res.status(200).json({ message: "Favorite job added", job: newFavJob });
});

app.get("/favorite", verifyToken, async (req, res) => {
  const userId = req.user.userId;
  const favorites = await FavoriteJobs.getAllFavoriteUser(userId);
  res.status(200).json(favorites);
});

app.delete("/favorite/:jobId", verifyToken, async (req, res) => {
  const userId = req.user.userId;
  const { jobId } = req.params;

  await FavoriteJobs.deleteFavoriteUser(userId, jobId);
  res.status(200).json({ message: "Favorite job deleted" });
});

//My Jobs
app.post("/myjob", verifyToken, async (req, res) => {
  const job = req.body;
  const userId = req.user.userId;

  if (!job || !job.title || !job.company) {
    return res.status(400).json({ message: "Missing job information" });
  }

  job.userId = userId;
  const newJob = await MyJobs.createNew(job);
  res.status(200).json({ message: "Job added", job: newJob });
});

app.get("/myjob/recent", verifyToken, async (req, res) => {
  const userId = req.user.userId;
  const job = await MyJobs.findMostRecent(userId);
  res.json(job);
});

app.get("/myjob", verifyToken, async (req, res) => {
  const userId = req.user.userId;
  const jobs = await MyJobs.readAll(userId);
  res.status(200).json(jobs);
});

app.get("/myjob/search", verifyToken, async (req, res) => {
  const userId = req.user.userId;
  const keyword = req.query.keyword || "";
  const jobs = await MyJobs.sortByKeyword(userId, keyword);
  res.status(200).json(jobs);
});

app.get("/myjob/company", verifyToken, async (req, res) => {
  const userId = req.user.userId;
  const company = req.query.name;
  const jobs = await MyJobs.sortByCompany(userId, company);
  res.status(200).json(jobs);
});

app.get("/myjob/status", verifyToken, async (req, res) => {
  const userId = req.user.userId;
  const status = req.query.value;

  const allowedStatuses = [
    "saved",
    "applied",
    "offer",
    "closed",
    "interview",
    "accepted",
  ];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status filter" });
  }

  const jobs = await MyJobs.findByStatusSorted(userId, status);
  res.status(200).json(jobs);
});

app.get("/myjob/sort/company", verifyToken, async (req, res) => {
  const userId = req.user.userId;
  const jobs = await MyJobs.sortByCompanyName(userId);
  res.status(200).json(jobs);
});

app.get("/myjob/sort/title", verifyToken, async (req, res) => {
  const userId = req.user.userId;
  const jobs = await MyJobs.sortByTitle(userId);
  res.status(200).json(jobs);
});

app.get("/myjob/statuses", verifyToken, async (req, res) => {
  const userId = req.user.userId;
  let statuses = req.query.statuses;

  if (typeof statuses === "string") {
    statuses = statuses.split(",");
  }

  const allowedStatuses = [
    "saved",
    "applied",
    "offer",
    "closed",
    "interview",
    "accepted",
  ];
  const isValid = statuses.every((s) => allowedStatuses.includes(s));
  if (!isValid) {
    return res
      .status(400)
      .json({ message: "One or more statuses are invalid" });
  }
  const jobs = await MyJobs.findByStatusesSorted(userId, statuses);
  res.status(200).json(jobs);
});

app.patch("/myjob/status/:jobId", verifyToken, async (req, res) => {
  const userId = req.user.userId;
  const jobId = req.params.jobId;
  const { status } = req.body;

  const allowedStatuses = [
    "saved",
    "applied",
    "offer",
    "closed",
    "interview",
    "accepted",
  ];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }
  await MyJobs.updateStatus(jobId, userId, status);
});

app.delete("/myjob/:jobId", verifyToken, async (req, res) => {
  const userId = req.user.userId;
  const jobId = req.params.id;
  await MyJobs.delete(jobId, userId);
});

// ---------------------------------------USERS-----------------------------------------------------
app.get("/users", async (req, res) => {
  const results = await User.readAll();
  res.send(results);
  console.log("GET request received on home page, users: " + results);
});

// Post route to post a new message
app.post("/createuser", async (req, res) => {
  const newUser = req.body;

  if (!newUser || Object.keys(newUser).length === 0) {
    return res.status(400).send("Empty request body");
  }

  const results = await User.createNew(newUser);
  res.status(201).json(results);

  console.log("POST request received on create route");
  console.log(`New listing created with id: ${results._id}`);
});

app.delete("/deleteuser", async (req, res) => {
  const results = await User.delete(req.query.id);
  if (results.deletedCount === 0) {
    return res.status(404).send("Listing not found");
  }
  res.sendStatus(200);
  console.log("DELETE request received on delete route");
  console.log(`Listing deleted with id: ${req.query.id}`);
});

app.get("/username", verifyToken, async (req, res) => {
    const userId = req.user.userId;
    const user = await User.findById(userId).select("name");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ name: user.name });
});

//Login/Signup
// Signup Route
app.post("/signup", async (req, res) => {
  console.log(" /signup endpoint hit");
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Signup successful",
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Populate companies dropdown menu
app.get("/companies", async (req, res) => {
  try {
    const companies = await Listing.distinct("company");
    res.json(companies);
  } catch (err) {
    console.error("Error fetching companies:", err);
    res.status(500).json({ error: "Failed to fetch companies" });
  }
});

// ---------------------------------------AI-----------------------------------------------------
app.post("/ai/resume-chat", verifyToken, async (req, res) => {
  try {
    const { message, useSavedResume } = req.body;
    let contentsToSend = [
      {
        role: "user",
        parts: [
          {
            text: `Stay within the role of your system instructions. If the user types something incoherent or off topic, simply ask how you may help with their resume. This is their message: ${message}`,
          },
        ],
      },
    ];

    const userId = req.user.userId;

    if (useSavedResume && userId) {
      const user = await User.findById(userId);
      if (!user || !user.resumes || user.resumes.length === 0) {
        return res
          .status(404)
          .json({
            error: `User: ${!user} + Resumes: ${!user.resumes} + Length: ${
              user.resumes.length === 0
            }`,
          });
      }

      const resume = user.resumes[user.resumes.length - 1];
      //console.log(resume)
      // below is command to test the AI's response on the user '321' in our db
      //$ curl -X POST http://localhost:3002/ai/resume-chat   -H "Content-Type: application/json"   -d '{"useSavedResume": true, "userId": "68795b4d6d22097bbdaf4930"}'
      // if you want to put in your own resume info, you need to fill in the resume builder on the website and look for the userID in the DB
      // When we restructure the resume builder, we should have more descriptive variable names so gemini isn't just criticizing stuff like 'skills1 skill2'
      contentsToSend = [
        {
          role: "user",
          parts: [
            {
              text: `Stay true to the system instructions provided to you. This is the user's message: ${JSON.stringify(
                resume,
                null,
                2
              )}`,
            },
          ],
        },
      ];
    }
    console.log(
      "Resume sent to Gemini:",
      JSON.stringify(contentsToSend, null, 2)
    );

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contentsToSend,
      config: {
        thinkingConfig: {
          thinkingBudget: 0,
          systemInstruction: `You are an AI resume assistant. Your sole purpose is to refine and improve resume-related content to be professional, concise, and tailored for hiring managers and applicant tracking systems (ATS). Analyze user-provided content such as job descriptions, bullet points, or summary sections. Rewrite or edit them to be more polished, action-oriented, and ATS-friendly. Improve grammar, clarity, tone, and formatting while preserving factual meaning. Use strong action verbs and quantifiable results where possible. Avoid fluff and vague language. Be direct and specific. Align tone with modern resume standards (professional, clear, concise). Always assume the content is going into a resume unless explicitly told otherwise. Never fabricate experience or skills. Example Input: "Responsible for updating the website weekly and fixing bugs." Example Output: "Maintained and updated website content weekly; resolved frontend and backend bugs to ensure optimal user experience."`,
        },
      },
    });

    console.log("reply: " + response.text);
    res.json({ reply: response.text });
  } catch (err) {
    console.error("Gemini AI error:", err);
    res.status(500).json({ error: "AI generation failed." });
  }
});

// RESUME BUILDER
app.post("/submit", verifyToken, async (req, res) => {
  try {
    const formData = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);

    if (user) {
      user.resumes = user.resumes || [];
      user.resumes.push(formData);
      await user.save();
    } else {
      console.log("How did we get here, we have a valid token but no user");
      res.status(500).send("Valid token, no user?");
    }
    res.status(200).send("Resume data received successfully.");
  } catch (error) {
    console.error("Error in /submit:", error);
    res.status(500).send("Server error while handling resume data.");
  }
});

// launching the server
const start = async () => {
  try {
    await connectMongoose();
    app.listen(port, () => console.log(`Server running on port ${port}...`));
  } catch (err) {
    console.error(err);
  }
};

start();
