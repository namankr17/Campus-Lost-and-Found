# Campus Lost & Found App

## Overview

A full-stack  web application for managing lost and found items. Users can post items they've lost or found, interact through comments, and help reunite items with their owners.

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

### API Routes

#### Auth Routes

- `POST /api/auth/register` - Register new user (with optional profile picture)
- `POST /api/auth/login` - User login

#### User Routes

- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `PUT /api/users/:id/profile-picture` - Update profile picture

#### Upload Routes

- `POST /api/upload/profile` - Upload profile picture
- `POST /api/upload/post` - Upload post images (max 3)

#### Post Routes

- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post with images
- `PUT /api/posts/:id` - Update post and images
- `DELETE /api/posts/:id` - Delete post and cleanup images

#### Comment Routes

- `POST /api/posts/:id/comments` - Add comment
- `DELETE /api/posts/:id/comments/:commentId` - Delete comment

#### Admin Routes

- `GET /api/admin/users` - Get all users
- `GET /api/admin/stats` - Get statistics
- `POST /api/admin/create` - Create new admin
- `DELETE /api/admin/users/:id` - Delete user and cleanup associated images

#### Notification Routes

- `GET /api/notifications/user/:id` - Get user's notifications
- `PUT /api/notifications/user/:id/viewed` - Mark notifications as viewed
- `DELETE /api/notifications/:id` - Delete specific notification

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
