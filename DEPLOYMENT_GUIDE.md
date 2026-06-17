# 🌐 Production Deployment Guide

This document provides step-by-step instructions for deploying the **Book A Doctor (MediCareBook)** MERN stack application to production using **Vercel** (for React frontend) and **Render** (for Node/Express backend).

---

## 1. MongoDB Atlas Setup

1. **Create Account/Cluster:**
   * Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
   * Create a new Shared Cluster (Free Tier).
2. **Configure Network Access:**
   * Navigate to **Network Access** under Security.
   * Click **Add IP Address** and choose **Allow Access From Anywhere** (`0.0.0.0/0`) to allow connections from Render hosting servers.
3. **Configure Database Access:**
   * Create a new Database User under **Database Access**.
   * Choose Password authentication and assign the user the role **Read and write to any database**.
4. **Get Connection String:**
   * Go to **Database** under Deployment.
   * Click **Connect** on your cluster, then choose **Drivers** (Node.js).
   * Copy the connection string. Replace `<password>` with the actual database user's password (ensure special characters like `@` are URL-encoded as `%40`).

---

## 2. Backend Deployment (Render)

1. **Log in to Render:**
   * Connect your GitHub account at [Render](https://render.com).
2. **Create Web Service:**
   * Click **New +** and select **Web Service**.
   * Link your GitHub repository.
3. **Configure Service Parameters:**
   * **Name:** `book-a-doctor-backend`
   * **Region:** Choose the closest region to your target audience.
   * **Branch:** `main`
   * **Root Directory:** `Server`
   * **Runtime:** `Node`
   * **Build Command:** `npm install`
   * **Start Command:** `node server.js`
4. **Set Environment Variables:**
   Under the **Environment** tab, click **Add Environment Variable** and enter:
   * `PORT` = `8001`
   * `MONGO_DB` = `your_mongodb_connection_string`
   * `JWT_KEY` = `your_secure_jwt_secret_key`
5. **Deploy:**
   * Click **Create Web Service**. Render will build and launch your backend container. Keep track of your live URL (e.g. `https://book-a-doctor-backend-rqr8.onrender.com`).

---

## 3. Frontend Deployment (Vercel)

1. **Log in to Vercel:**
   * Sign in at [Vercel](https://vercel.com) using your GitHub account.
2. **Import Project:**
   * Click **Add New** ➔ **Project**.
   * Select your `book-a-doctor-mern-stack` repository.
3. **Configure Build Settings:**
   * **Framework Preset:** `Vite`
   * **Root Directory:** `Client`
   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`
4. **Configure Environment Variables:**
   Under **Environment Variables**, add:
   * `VITE_API_URL` = `https://book-a-doctor-backend-rqr8.onrender.com` (Your live Render backend URL without trailing slash).
5. **Route Rewrite Configuration (`vercel.json`):**
   Ensure that [vercel.json](file:///c:/book-a-doctor/Client/vercel.json) is present in the `Client` directory to route all single-page application requests to `index.html` on refresh:
   ```json
   {
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```
6. **Deploy:**
   * Click **Deploy**. Vercel will bundle the frontend and generate your live deployment link (e.g. `https://book-a-doctor-mern-stack.vercel.app`).

---

## 4. Troubleshooting & Checklist

### ⚠️ React Router Page Refresh (404 Error)
* **Problem:** Refreshing the browser on pages like `/userhome` or `/notifications` displays a Vercel 404 error.
* **Fix:** Verify [vercel.json](file:///c:/book-a-doctor/Client/vercel.json) is present inside the `Client` directory and committed to GitHub.

### ⚠️ CORS / Network Connection Error
* **Problem:** Logging in or fetching data hangs or returns a network error.
* **Fix:** Ensure that `VITE_API_URL` configured on Vercel contains no trailing slash (e.g. `https://book-a-doctor-backend-rqr8.onrender.com` not `https://book-a-doctor-backend-rqr8.onrender.com/`). Also verify that Render has finished starting up (Render free instance web services spin down after inactivity and may take up to 50 seconds to boot up on the first request).

### ⚠️ Doctor Approved but Not Appearing on Discovery Page
* **Problem:** Patient discovery page says "No Doctors Available".
* **Fix:** Newly registered doctors have a default status of `"pending"`. An administrator must log in, visit the admin dashboard under All Doctors, and click **Approve** to make the practitioner active.

---

## 🌐 Live Production URLs

* **Frontend Client (Vercel):** [https://book-a-doctor-mern-stack.vercel.app](https://book-a-doctor-mern-stack.vercel.app)
* **Backend REST API (Render):** [https://book-a-doctor-backend-rqr8.onrender.com](https://book-a-doctor-backend-rqr8.onrender.com)
