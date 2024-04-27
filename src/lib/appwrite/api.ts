import { ID, Query } from "appwrite";

import { TNewPost, TNewUser, TUpdatePost } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";

// ============================= AUTH =============================

/** SIGN UP
 * 
 * Authenticate: Creates a new account for the user, then saves that user to the database.
 */
export async function createUserAccount(user: TNewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name,
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(user.name);

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      email: newAccount.email,
      name: newAccount.name,
      username: user.username,
      imageUrl: avatarUrl,
    });

    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}

/** SAVE USER TO DB
 * 
 *  Saves the user to the database
 */
export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  username?: string;
  imageUrl: URL;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user,
    );

    return newUser;
  } catch (error) {
    console.log(error);
  }
}

/** SIGN IN
 * 
 *  Creates user's session and returns that session 
 * */
export async function signInAccount(user: { email: string; password: string; }) {
  try {
    const session = await account.createEmailSession(user.email, user.password);

    return session;
  } catch (error) {
    console.log(error);
  }
}

/** GET ACCOUNT */
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    console.log(error);
  }
}

/** GET USER
 * 
 * If found in the database, returns the user(document). Otherwise returns undefined.
 */
export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

/** SIGN OUT */
export async function signOutAccount() {
  try {
    const session = await account.deleteSession('current');

    return session;
  } catch (error) {
    console.log(error);
  }
}

// ============================= POST =============================

/** CREATE POST
 *  1. Uploads the post's image to appwrite storage
 *  2. Then gets:
 *      - the **preview url** of the newly uploaded image file
 *      - the **id** of this image file
 *  3. Converts post's *`tags`* into **string[]**
 *  4. Saves the post to database
 *  5. **Returns this newly created post** as *Models.Document*
 * 
 * @param post `type TNewPost`
 * @returns Models.Document 
 */
export async function createPost(post: TNewPost) {
  try {
    // upload file to appwrite storage
    const uploadedFile = await uploadFile(post.file[0]);

    if (!uploadedFile) throw Error;

    // Get file url
    const fileUrl = getFilePreview(uploadedFile.$id);

    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    // Convert tags ino array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // create post
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newPost;
  } catch (error) { console.log(error); }
}

/** UPLOAD FILE
 * 
 * Uploads a file to appwrite storage and returns the newly uploaded file.
 * @param file `type File`
 * @returns Models.File
 */
export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );

    return uploadedFile;
  } catch (error) { console.log(error); }
}

/** GET FILE URL
 * 
 * Returns the preview URL of the file
 * @param fileId `type string`
 * @returns URL
 */
export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      'top',
      100
    );

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) { console.log(error); }
}

/** DELETE FILE
 * 
 * Deletes a file from appwrite storage by given file id.
 * @param fileId `type string`
 * @returns `{ status: 'ok' }` if deletion is successfull. Otherwise throws an Appwrite exeption
 */
export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);

    return { status: 'OK' };
  } catch (error) {
    console.log(error);
  }
}

/** GET RECENT POSTS */
export async function getRecentPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.orderDesc('$createdAt'), Query.limit(20)]
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.error(error);
  }
}

/** GET POST BY ID */
export async function getPostById(postId?: string) {
  if (!postId) throw Error;

  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
}

/** UPDATE POST
 * 1. Handles the logic to update the post's file if there is one.
 * 2. Updates the post itself.
 * 3. If both operations are successful, returns the newly updated post.
 * @param post `type TUpdatePost`
 * @returns `Models.Document`
 */
export async function updatePost(post: TUpdatePost) {
  const hasFileToUpdate = post.file.length > 0;

  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };

    if (hasFileToUpdate) {
      // upload a new file to appwrite storage
      const uploadedFile = await uploadFile(post.file[0]);

      if (!uploadedFile) throw Error;

      // get the new file url
      const fileUrl = getFilePreview(uploadedFile.$id);

      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    // convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // update post
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags
      }
    );

    // Failed to update
    if (!updatedPost) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }

      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    if (hasFileToUpdate) {
      await deleteFile(post.imageId);
    }

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

/** DELETE POST BY ID */
export async function deletePost(postId?: string, imageId?: string) {
  if (!postId || !imageId) return;

  try {
    const result = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    if (!result) throw Error;

    await deleteFile(imageId);

    return { status: 'OK' };
  } catch (error) {
    console.log(error);
  }
}

// =========================== POST ACTIONS ===========================

/** LIKE / UNLIKE POST */
export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray
      }
    );

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

/** SAVE POST */
export async function savePost(userId: string, postId: string) {
  try {
    const savedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    );

    if (!savedPost) throw Error;

    return savedPost;
  } catch (error) {
    console.log(error);
  }
}

/** DELETE SAVED POST */
export async function deleteSavedPost(savedRecordId: string) {
  try {
    const result = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId
    );

    if (!result) throw Error;

    return { status: 'OK' };
  } catch (error) {
    console.log(error);
  }
}