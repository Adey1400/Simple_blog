import { database, DATABASE_ID, COLLECTION_ID, account } from "../appwriteConfig";

/**
 * Migration utility to update existing blogs with missing authorName
 * This should be run once to fix existing blogs that don't have authorName populated
 */
export const migrateAuthorNames = async () => {
  try {
    console.log("Starting author name migration...");
    
    // Get current user
    const currentUser = await account.get();
    if (!currentUser) {
      throw new Error("User must be logged in to run migration");
    }

    // Get all blogs
    const response = await database.listDocuments(DATABASE_ID, COLLECTION_ID);
    const blogs = response.documents;

    let updatedCount = 0;
    let totalBlogs = blogs.length;
console.log(`Found ${totalBlogs} blogs to check...`);
 // Update blogs that don't have authorName or have empty authorName
    for (const blog of blogs) {
      if (!blog.authorName || blog.authorName.trim() === "") {
        try {
          // If this blog belongs to the current user, update it with their info
          if (blog.userId === currentUser.$id) {
            await database.updateDocument(
              DATABASE_ID,
              COLLECTION_ID,
              blog.$id,
              {
                authorName: currentUser.name || currentUser.email
              }
            );
            updatedCount++;
            console.log(`Updated blog: ${blog.title}`);
          }
        } catch (error) {
          console.error(`Failed to update blog ${blog.$id}:`, error);
        }
      }
    }

    console.log(`Migration completed! Updated ${updatedCount} out of ${totalBlogs} blogs.`);
    return { updatedCount, totalBlogs };
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
};
export const checkMigrationNeeded = async () => {
  try {
    const response = await database.listDocuments(DATABASE_ID, COLLECTION_ID);
    const blogs = response.documents;
    
    const blogsNeedingMigration = blogs.filter(blog => 
      !blog.authorName || blog.authorName.trim() === ""
    );

    return {
      totalBlogs: blogs.length,
      blogsNeedingMigration: blogsNeedingMigration.length,
      needsMigration: blogsNeedingMigration.length > 0
    };
  } catch (error) {
    console.error("Failed to check migration status:", error);
    throw error;
  }
};