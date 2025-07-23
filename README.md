# SereneScribe Blog Application

A modern React blog application built with Vite, React Router, and Appwrite backend services.

## Features

- User authentication (login/register)
- Create, read, update, and delete blog posts
- Rich text editor with TinyMCE
- Image upload functionality
- Responsive design with Tailwind CSS
- Protected routes

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Appwrite account and project setup

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd simple-blog
npm install
```

### 2. Appwrite Configuration

1. Create an account at [Appwrite Cloud](https://cloud.appwrite.io)
2. Create a new project
3. Set up the following services:

#### Database Setup:
- Create a database
- Create a collection for blog posts with the following attributes:
  - `title` (string, required)
  - `content` (string, required)
  - `author` (string, required)
  - `createdAt` (datetime, required)
  - `image` (string, optional)

#### Storage Setup:
- Create a storage bucket for image uploads
- Configure appropriate permissions

#### Authentication Setup:
- Enable Email/Password authentication
- Configure your domain in the allowed origins

### 3. Environment Configuration

Create a `.env` file in the root directory with your Appwrite credentials:

```env
# Appwrite Configuration
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id_here
VITE_APPWRITE_DATABASE_ID=your_database_id_here
VITE_APPWRITE_COLLECTION_ID=your_collection_id_here
VITE_APPWRITE_BUCKET_ID=your_bucket_id_here

# TinyMCE Configuration (optional, for rich text editor)
VITE_TINYMCE_API_KEY=your_tinymce_api_key_here
```

### 4. Getting Your Appwrite IDs

1. **Project ID**: Found in your Appwrite project settings
2. **Database ID**: Found in your database settings
3. **Collection ID**: Found in your collection settings
4. **Bucket ID**: Found in your storage bucket settings

### 5. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Troubleshooting

### "User is not logged in" Issues

This error typically occurs due to:

1. **Missing Environment Variables**: Ensure all required environment variables are set in your `.env` file
2. **Incorrect Appwrite Configuration**: Verify your project ID, endpoint, and other credentials
3. **Network Issues**: Check if Appwrite services are accessible
4. **Session Expiry**: User sessions may have expired

### Common Solutions:

1. **Check Environment Variables**:
   ```bash
   # Verify your .env file exists and contains all required variables
   cat .env
   ```

2. **Clear Browser Storage**:
   - Clear localStorage and sessionStorage
   - Clear cookies for the application domain

3. **Verify Appwrite Project Status**:
   - Ensure your Appwrite project is active
   - Check if authentication is properly configured
   - Verify database and collection permissions

4. **Check Console Errors**:
   - Open browser developer tools
   - Look for network errors or authentication failures
   - Check for CORS issues

### Development Tips

- The application uses localStorage to persist some data locally
- Protected routes automatically redirect to login if user is not authenticated
- Authentication state is managed through React Context API

## Project Structure

```
src/
├── components/          # Reusable components
├── pages/              # Page components (Login, Register, etc.)
├── utils/              # Utility functions and context
├── assets/             # Static assets
└── App.jsx            # Main application component
```

## Technologies Used

- React 19
- Vite
- React Router DOM
- Appwrite (Backend as a Service)
- Tailwind CSS
- TinyMCE (Rich text editor)
- Framer Motion (Animations)
- React Toastify (Notifications)
