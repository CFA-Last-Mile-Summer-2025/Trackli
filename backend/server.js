const cors = require("cors");
const express = require("express");
const { connectMongoose } = require("./connect");
const Listing = require("./models/Listing");
const User = require("./models/User");
const AppliedJobs = require("./models/AppliedJobs");
const ViewedJobs = require("./models/ViewedJobs");
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
  params: { include_ai: "true" },
  headers: {
    "x-rapidapi-key": process.env.RAPID_API_KEY,
    "x-rapidapi-host": "internships-api.p.rapidapi.com",
  },
};

async function fetchDataAndSave() {
  try {
    const response = await axios.request(options);
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
      };

      const exists = await Listing.findOne({
        company: listing.company,
        title: listing.title,
      });

      if (!exists) {
        await Listing.createNew(listing);
        console.log("Inserted:", listing.title, "at", listing.company);
      } else {
        console.log("Skipped duplicate:", listing.title);
      }
    }
  } catch (err) {
    console.error("Error fetching/saving jobs:", err);
  }
}

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

app.delete("/deletejob", async (req, res) => {
  const results = await Listing.delete(req.query.id);
  if (results.deletedCount === 0) {
    return res.status(404).send("Listing not found");
  }
  res.sendStatus(200);
  console.log("DELETE request received on delete route");
  console.log(`Listing deleted with id: ${req.query.id}`);
});

app.post("/viewed", async (req, res) => {
  const job = req.body;
  if (!job || !job.title || !job.company) {
    return res.status(400).json({ message: "missing job information" });
  }

  const newViewedJob = await ViewedJobs.createNew(job);
  res.status(200).json({ message: "Viewed job added", job: newViewedJob });
});

app.post("/applied", async (req, res) => {
  const job = req.body;
  if (!job || !job.title || !job.company) {
    return res.status(400).json({ message: "missing job information" });
  }

  const newAppliedJob = await AppliedJobs.createNew(job);
  res.status(200).json({ message: "applied job added", job: newAppliedJob });
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
      { expiresIn: "2h" }
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

// AI
app.post("/ai/resume-chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userMessage,
      config: {
        thinkingConfig: {
          thinkingBudget: 0,
          systemInstruction: "You are a professional AI assistant that provides expert resume assistance to job seekers. Your primary responsibilities are: 1. Review uploaded resumes and provide detailed feedback on: Grammar and spelling errors, Formatting consistency and readability, Clarity, tone, and strength of phrasing, Professional presentation and structure. 2. Tailor resumes based on job descriptions provided by the user: Identify key skills, experiences, and terminology in the job posting, Recommend phrasing and content changes to better align the resume with employer expectations, Suggest additions or deletions that improve relevance and impact. 3. Assist users in building resumes from scratch using a structured template based on: Standard professional formats, Best practices in layout, sectioning, and wording, Appropriate tone for the user's industry and experience level. Your feedback should be practical, actionable, and concise. Always maintain a supportive and professional tone. Assume the user may upload documents (e.g., `.docx`, `.pdf`, or text content) representing resumes and/or job descriptions. Your role is to analyze, compare, and suggest enhancements. Do not invent or fabricate work history or skills. Only work with the information the user provides or requests assistance with. You are designed to support a resume-building application where users can: Create new resumes from templates, Edit existing ones, Tailor applications to specific job postings, Track and version their resumes. Stay focused on helping users improve their chances of success in the job market through resume and cover letter refinement.",
        },
      },
    });

    res.json({ reply: response.text });
  } catch (err) {
    console.error("Gemini AI error:", err);
    res.status(500).json({ error: "AI generation failed." });
  }
});

// RESUME BUILDER
app.post("/submit", async (req, res) => {
  try {
    const formData = req.body;
    console.log("Received resume data:", formData);

    const authHeader = req.headers["authorization"];
    let token = null;
    if (authHeader) {
      token = authHeader.split(" ")[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (user) {
          user.resumes = user.resumes || [];
          user.resumes.push(formData);
          await user.save();
          console.log(`Resume saved for user: ${userId}`);
        } else {
          console.log("How did we get here, we have a valid token but no user");
        }
      } catch (err) {
        console.log("Internal error: " + err);
      }
    } else {
      console.log("No token provided, resume not saved");
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
    await fetchDataAndSave();
    app.listen(port, () => console.log(`Server running on port ${port}...`));
  } catch (err) {
    console.error(err);
  }
};

start();
