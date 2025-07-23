# Quick Setup Guide - Fixing "User is not logged in" Issue

## Problem
The application shows "user is not logged in" or authentication errors because the Appwrite backend is not properly configured.

## Solution Steps

### 1. Create Environment File
```bash
# Copy the example environment file
cp .env.example .env
```

### 2. Set Up Appwrite Project

1. Go to [Appwrite Cloud](https://cloud.appwrite.io)
2. Create a new account or sign in
3. Create a new project
4. Note down your **Project ID** from the project settings

### 3. Set Up Authentication
1. In your Appwrite dashboard, go to **Auth**
2. Enable **Email/Password** authentication
3. Add your domain (e.g., `http://localhost:5173`) to **Platforms > Web**

### 4. Set Up Database
1. Go to **Databases** in your Appwrite dashboard
2. Create a new database and note the **Database ID**
3. Create a collection called "blogs" and note the **Collection ID**
4. Add these attributes to your collection:
   - `title` (String, Required)
   - `content` (String, Required) 
   - `author` (String, Required)
   - `createdAt` (DateTime, Required)
   - `image` (String, Optional)

### 5. Set Up Storage
1. Go to **Storage** in your Appwrite dashboard
2. Create a new bucket for images and note the **Bucket ID**
3. Configure permissions to allow read/write access

### 6. Update Environment File
Edit your `.env` file with your actual Appwrite credentials:

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_actual_project_id
VITE_APPWRITE_DATABASE_ID=your_actual_database_id  
VITE_APPWRITE_COLLECTION_ID=your_actual_collection_id
VITE_APPWRITE_BUCKET_ID=your_actual_bucket_id
```

### 7. Restart Development Server
```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

### 8. Test Authentication
1. Go to `http://localhost:5173`
2. You should see a debug panel in the bottom-right corner (development mode only)
3. It will show if your configuration is valid
4. Try registering a new account or logging in

## Verification
- ✅ Debug panel shows "Configuration Status: Valid"
- ✅ You can register a new account
- ✅ You can log in with existing credentials
- ✅ Protected routes work correctly
- ✅ No console errors about missing environment variables

## Common Issues

### Issue: "Invalid project" error
**Solution**: Double-check your `VITE_APPWRITE_PROJECT_ID` in the `.env` file

### Issue: CORS errors
**Solution**: Add your domain (`http://localhost:5173`) to Appwrite platforms

### Issue: Database errors
**Solution**: Verify database and collection IDs, check collection permissions

### Issue: Still not working?
1. Clear browser storage (localStorage, sessionStorage, cookies)
2. Check browser console for specific error messages
3. Verify all environment variables are set correctly
4. Ensure Appwrite project is active and properly configured