# Trackli

**Trackli** is a job application management tool designed to help users stay organized, streamline job tracking, and optimize their application workflow with AI-assisted tools.

## 🔧 Core Features

### 🎯 Job Tracker

* **Views**: Progress, List
* **Job Statuses**:

  * Saved → Applied → Interview → Offer → Accepted → Closed
* Ability to assign status from either views by dragging or pressing on an "actions" menu

### 📄 Resume Builder

* **Template**: [Resumatic Template](https://resumatic.rezi.ai/s/fYk7wxCgsM5Aj5w3yv31)
* **AI Support**:

  * Resume customization based on job descriptions
  * Smart editing suggestions (grammar, formatting, phrasing)
* **Version Control**: Track and manage resume variations
* **Export**: PDF

### 📊 Dashboard

* Applications submitted this week
* Last application date
* Suggested job listings

### 🔍 Job Listings Board

* Job cards with description, AI powered skills list, and link
* Filters & keyword search
* Clickable → external job post
* Prompt: *Did you apply?* → Auto-sort to **Applied** if Yes
  
* **Manual Entry**:

  * Paste a job link → auto-generate card

---

## 🤖 AI-Enhanced Features

* **AI Resume Assistant**: Tailors resume to job descriptions using Gemini Flash 2.5 API

---

## 💡 Scrapped / Roadmapped

### 🧠 Motivational Chatbot (Roadmap)

* Encouragement, mock interviews, skill suggestions
* Resume/job tracker integration via conversational UI

### 💬 Natural Language → MongoDB Query (Roadmap)

* Enables search/filter using natural phrases
* Useful for non-technical users

---

## 🧑‍💼 Target Audience

* Students seeking internships
* Recent grads
* Mid-career job switchers
* Freelancers & contract workers

---

## ⚙️ Tech Stack & Notes

* AI: **Gemini Flash 2.5** for all manners of AI assistance
* Resume format: Based on [Resumatic](https://resumatic.rezi.ai/s/fYk7wxCgsM5Aj5w3yv31)
* Job ingestion:
  * https://rapidapi.com/fantastic-jobs-fantastic-jobs-default/api/internships-api
  * User manually adds a job listing that we don't have, and we parse it

---

## 🗓 Status

MVP in progress. Prioritized features: job tracker, resume builder. Chatbot and natural language query planned for future updates.

---

## 📦 Setup
See [Setup Instructions](setup.md) for installation, environment variables, and deployment details.

