import { ID, Query } from 'appwrite'

import { INewUser, IUpdatePost, INewPost,  IUpdateUser } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from './config';

export async function createUserAccount(user: INewUser) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
        );

        if (!newAccount) throw Error;

        const avatarurl = avatars.getInitials(user.name);

        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            email: newAccount.email,
            name: newAccount.name,
            imageurl: avatarurl,
            username: user.username,
        })

        return newUser;

    } catch (error) {
        console.log(error);
        return ;

    }
}

export async function saveUserToDB(user: {
    accountId: string;
    email: string;
    name: string;
    imageurl: URL;
    username?: string;
}) {
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user,
        )

        return newUser;

    } catch (error) {

        console.log(error);

    }

}

export async function signInAccount(user: {
    email: string;
    password: string;
}) {

    try {
        // create new email session
        const session = await account.createEmailSession(
            user.email, user.password
        );

        return session;

    } catch (error) {
        console.log(error)
    }
    
}

export async function signOutAccount() {

    try {
        // create new email session
        const session = await account.deleteSession("current");

        return session;

    } catch (error) {
        console.log(error)
    }
    
}

// ============================== GET ACCOUNT
export async function getAccount() {
    try {
      const currentAccount = await account.get();
  
      return currentAccount;
    } catch (error) {
      console.log(error);
    }
  }

export async function getCurrentUser(){
    try {

        const currentAccount = await account.get();

        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("accountId", currentAccount.$id)]
        );

        if(!currentUser) throw Error;


        return currentUser.documents[0];



    } catch (error){

        console.log(error);
        return null;


    };

}
// ============================== UPLOAD FILE
// this function uploads one file to appwrite storage media
export async function uploadFile(file: File) {
    try {
      // create and upload a media file to appwrite server
      const uploadedFile = await storage.createFile(
        appwriteConfig.storageId,
        ID.unique(),
        file
      );
  
      return uploadedFile;
    } catch (error) {
      console.log(error);
    }
  }
 // ============================== GET FILE URL
 // this function returns the url object of the media file already uploaded
 // to storage
export function getFilePreview(fileId: string) {
    try {
      const fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000, // width
        2000, // height check later
        "top",
        100
      );
  
      if (!fileUrl) throw Error;
  
      return fileUrl;
    } catch (error) {
      console.log(error);
    }
  }
// ============================== DELETE FILE
// delete the media file from the appwrite storage
export async function deleteFile(fileId: string) {
    try {
      await storage.deleteFile(appwriteConfig.storageId, fileId);
  
      return { status: "ok" };
    } catch (error) {
      console.log(error);
    }
  }
  
// ============================== CREATE POST
export async function createPost(post: INewPost) {
    try {
      // Upload file to appwrite storage
      
      const uploadedFile = await uploadFile(post.file[0]);
       
  
      if (!uploadedFile) throw Error;

      // now attach this uploaded file to post 


  
      // Get file url
      const fileUrl = getFilePreview(uploadedFile.$id);

      //console.log(`fileUrl' ${fileUrl}`)
      
      if (!fileUrl) {
        // if something goes wrong or corrupted then delete the media file from the storage
        await deleteFile(uploadedFile.$id);
        throw Error;
      }
  
      // Convert tags into array
      //console.log(post.tags)
      const tags = post.tags?.replace(/ /g, "").split(",") || [];
      //console.log(tags);

      //console.log(`tags ${tags}`)
  
      // Create post or now save the post to apprwrite database collection post

      
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
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // fetch recent posts from the appwrite collection
  export async function getRecentPosts(){
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.orderDesc(`$createdAt`), Query.limit(20)]
    )

    if(!posts) throw Error;

    return posts;


  }

  // ============================== GET USERS
export async function getUsers(limit?: number) {
  const queries: any[] = [Query.orderDesc("$createdAt")];

  if (limit) {
    queries.push(Query.limit(limit));
  }

  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      queries
    );

    if (!users) throw Error;

    return users;
  } catch (error) {
    console.log(error);
  }
}