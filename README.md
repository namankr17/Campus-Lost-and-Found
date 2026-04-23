# Campus Lost and Found 🎒🔍

A web-based platform designed to help students and staff report, search, and recover lost items within the campus community. Users can post lost or found items, browse listings, and connect with rightful owners easily.

---

## 🚀 Features

* Report lost items with details
* Post found items for claiming
* Search and browse listings
* User-friendly interface
* Responsive design for all devices
* Manage lost/found posts

---

## Backend Implementation

### Technology Stack

- Node.js
- Express
- MongoDB
- JWT Authentication
- Cloudinary (Image Management)

### Authentication & Authorization

- JWT-based authentication
- Protected routes
- Role-based access (Admin/User)
- Token verification middleware


### Database Models

- User (includes profile picture)
- Post (includes multiple images)
- Comment
- Notification

### Image Management

- Cloudinary integration for image storage
- Profile picture upload and management
- Multiple image upload for posts (max 3)
- Automatic image cleanup on deletion
- Image validation and optimization
- Secure image upload handling

### Notification System

- Automatic notifications when users receive comments on their posts
- Notification count tracking
- Auto-cleanup of old notifications (3-day TTL)
- Cascade deletion with posts and comments
- Last viewed timestamp tracking

## 📂 Installation

```bash
git clone https://github.com/namankr17/Campus-Lost-and-Found.git
cd Campus-Lost-and-Found
npm install
```

---

## ▶️ Run the Project

```bash
npm start
```

or

```bash
npm run dev
```

---

## 🌐 Open in Browser

```bash
http://localhost:3000
```

---

## 📁 Project Structure

```bash
Campus-Lost-and-Found/
│── client/
│── server/
│── models/
│── routes/
│── public/
│── package.json
│── README.md
```

---


## 👨‍💻 Contributors 

Naman Kumar,
Neela Ajay,
Nikhil Kumar,
Nikhil Kumar
