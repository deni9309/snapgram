# Snapgram - A Social Media Application

## Introduction

Built with Vite and React.js, Snapgram is a Social media platform with user-friendly interface that has a nice modern look and lots of features including infinite scroll.    
Users can easily create, explore posts, and view other users profiles and post activity.  
Snapgram has a strong authentication system and performs a quick data fetching using React Query for a smooth user experience.

## Tech Stack

- React.js
- Vite
- Appwrite
- React Query
- TypeScript
- Shadcn
- Tailwind CSS

## Features

- **Secure Authentication System:** An advanced authentication system prioritizing both user security and privacy.

- **Discover Page:** A dynamic homepage for users to discover new posts, featuring a dedicated section for top creators.

- **Like & Save Options:** Allow users to like and save posts, with separate pages to organize and manage their liked and saved content.

- **Post Detail View:** A comprehensive post page offering detailed content with recommendations for related posts to enhance the user experience.

- **User Profile Page:** A profile page that displays liked posts and offers easy-to-use options to edit personal details.

- **Explore User Profiles:** Enable users to explore and navigate through other users' profiles and posts effortlessly.

- **Create Post Interface:** Develop a user-friendly post creation page, with drag-and-drop file uploads, seamless storage, and efficient file management.

- **Post Editing Features:** Give users the ability to edit their posts' content at any time with a smooth editing interface.

- **Responsive Design with Navigation Bar:** A fully responsive design equipped with a mobile-style bottom navigation bar for intuitive, seamless navigation.

- **React Query Implementation:** Integrate React Query (Tanstack Query) for enhanced performance through auto-caching, parallel data fetching, efficient mutations, and more.

- **Appwrite Backend Integration:** Leverage Appwrite for Backend as a Service, providing features like authentication, database management, file storage, and more for streamlined backend operations.

- **Additional Enhancements:** Focus on optimized code architecture for reusability, modular design, and enhanced scalability.

## Installation

Clone the repository and install the project dependencies using npm:    
``npm install``

**Set Up Environment Variables**

Create a new file named .env in the root of your project and add the following content:  

```bash
VITE_APPWRITE_URL='appwrite-url'
VITE_APPWRITE_PROJECT_ID='your-project-id'
VITE_APPWRITE_DATABASE_ID='your-database-id'
VITE_APPWRITE_STORAGE_ID='your-storage-id'
VITE_APPWRITE_USER_COLLECTION_ID='user-collection-id'
VITE_APPWRITE_POST_COLLECTION_ID='post-collection-id'
VITE_APPWRITE_SAVES_COLLECTION_ID='saves-collection-id'
```

Replace the placeholder values with your actual Appwrite credentials. You can obtain these credentials by signing up on the Appwrite website.

**Running the Project**

``npm start``  

Open ``http://localhost:3000`` in your browser to view the project.

## Credits and Attribution

This project was inspired and made with the great mentoring of [JavaScript Mastery](https://www.youtube.com/@javascriptmastery). The tutorial I followed can be found [here](https://www.youtube.com/watch?v=_W3R2VwRyF4).