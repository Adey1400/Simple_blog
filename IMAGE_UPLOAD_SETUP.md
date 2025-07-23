# TinyMCE Image Upload Fix

## What was fixed:

### 1. **BlogForm.jsx**
- ✅ Improved error handling with proper validation for file size (5MB limit) and file type
- ✅ Added loading toasts for better user feedback
- ✅ Simplified URL generation logic using consistent Appwrite endpoint format
- ✅ Added `images_upload_handler` as an alternative upload method
- ✅ Enhanced toolbar with preview functionality
- ✅ Added proper button disabled state styling

### 2. **EditBlog.jsx** 
- ✅ **Fixed: Added missing image upload functionality** - This was the main issue!
- ✅ Implemented the same robust file upload logic as BlogForm
- ✅ Added proper error handling and user feedback
- ✅ Added file validation and size limits
- ✅ Enhanced toolbar with image and preview capabilities

### 3. **Environment Configuration**
- ✅ Created `.env.example` with all required environment variables
- ✅ Added setup instructions for TinyMCE API key and Appwrite configuration

## Setup Instructions:

1. **Copy environment file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Configure TinyMCE:**
   - Get a free API key from: https://www.tiny.cloud/
   - Add it to `VITE_TINYMCE_API_KEY` in your `.env.local`

3. **Configure Appwrite:**
   - Set up your Appwrite project
   - Create a storage bucket for images
   - Add all Appwrite configuration to `.env.local`

4. **Install and run:**
   ```bash
   npm install
   npm run dev
   ```

## Features Added:

- 📸 **Image Upload**: Click the image button in TinyMCE toolbar
- 📋 **Drag & Drop**: Paste or drag images directly into the editor
- 🔒 **File Validation**: Size limit (5MB) and type checking
- 🔄 **Loading States**: Visual feedback during upload
- ⚡ **Error Handling**: Clear error messages for failed uploads
- 🎨 **Preview Mode**: Preview button to see how content looks

## Image Upload Process:

1. User clicks image button or drags image into editor
2. File is validated (size, type)
3. Loading toast appears
4. File is uploaded to Appwrite storage
5. Image URL is generated and inserted into editor
6. Success toast confirms upload

The image upload now works in both creating new blogs and editing existing ones!