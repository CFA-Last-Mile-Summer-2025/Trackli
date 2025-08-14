# 🚀 Setup Instructions

Follow these steps to get **Trackli** up and running locally, including development and deployment options.

---

## 1. Prerequisites

* **Node.js**
* **MongoDB**
* **Git**
* Optional: **Visual Studio Code** for development and shell tools

---

## 2. Clone the Repository

```bash
git clone https://github.com/CFA-Last-Mile-Summer-2025/Trackli.git
cd Trackli
```

---

## 3. Environment Variables

Create a `.env` at `backend/` folder including:

```
MONGOOSE_CONN="..."
JWT_SECRET=...
DB_COLL_NAME=listings
DB_COLL_NAME2=users
DB_COLL_NAME3=viewedjobs
DB_COLL_NAME4=appliedjobs
DB_COLL_NAME5=favoritejobs
DB_COLL_NAME6=myjobs
RAPID_API_KEY="..."
GEMINI_API_KEY=...
EMAIL_USERNAME=...
EMAIL_PASSWORD=...
```

* Make sure to secure any secrets (don’t commit `.env` to git).
* Since it's self-hosted, JWT_SECRET can be anything (ex: '123')
* Rapid is from: https://rapidapi.com/fantastic-jobs-fantastic-jobs-default/api/internships-api
* EMAIL_USERNAME and EMAIL_PASSWORD are for email verification. The email you put into EMAIL_USERNAME will be the email used to send out verification emails. Read this article to create the relevant credentials: https://support.google.com/accounts/answer/185833?hl=en

---

## 4. Start the Application

### From the root directory (Trackli), run:

```bash
npm run start
```
---

## 5. Troubleshooting

* **Server errors**: ensure MongoDB is running and `MONGODB_URI` is correct
* **Frontend build fails**: check matching Node versions (use `nvm`)
* **Env vars not loaded**: make sure you restart servers after editing `.env`
---

### ✅ Quick‐start Summary

```bash
git clone https://github.com/CFA-Last-Mile-Summer-2025/Trackli.git
cd Trackli
npm run start # everything will install automatically
```
The website will be hosted on:
http://localhost:5173/
