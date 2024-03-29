import { ID, Query } from 'appwrite'

import { INewUser, IUpdatePost, INewPost, IUpdateUser } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from './config';
import { EditFile } from '../utils';
import { object } from 'zod';

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
      imageUrl: avatarurl,
      username: user.username,
    })

    return newUser;

  } catch (error) {
    console.log(error);
    return;

  }
}

export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: URL;
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
    return null;
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
export function deleteFile(fileId: string) {
  try {
    console.log('deleteFile')
    console.log(fileId)

    storage.deleteFile(appwriteConfig.storageId, fileId);

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

// ============================== CREATE POST
export async function createPost(post: INewPost) {
  try {
    // Upload file to appwrite storage
    //console.log('createPost')
    //console.log(post)
    //(async ()=>{
    let fileUrls: Array<string>=[];
    let uploadedFilesIds: Array<string> =[];
    
    
    const promises = Array.from(post.filesMap).map(async ([key, file]) => {
      //for( let [key, file] of Object.entries(post.filesMap)){

      if (file.isLocal) { // a local file is added
        // Upload file to appwrite storage
       const uploadedFile = await uploadFile(file.localFile);
          
        return uploadedFile;
      }

    });

    const fileIds = await Promise.all(promises);

    fileIds.forEach((file)=>{
      if(file?.$id){
              
        const fileUrl=getFilePreview(file.$id);
        
        if (!fileUrl) {
          // if something goes wrong or corrupted then delete the media file from the storage
          deleteFile(file.$id);
          throw Error;
        }
        uploadedFilesIds.push(file.$id);
        fileUrls.push(fileUrl.toString())

      }
    })

    post.filesMap.forEach( (file: EditFile, key: string) => {
      //for( let [key, file] of Object.entries(post.filesMap)){

      if (!file.isLocal) { // a local file is added
        // Upload file to appwrite storage

        fileUrls.push(file.remoteFileUrl);
        uploadedFilesIds.push(file.remoteFileId);

      }

    });

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

          // Create post or now save the post to apprwrite database collection post
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        location: post.location,
        tags: tags,
        imageIds: uploadedFilesIds,
        imageUrls: fileUrls,
      }
    );

    if (!newPost) {
      fileIds.forEach((file)=>{
        if(file?.$id){
          deleteFile(file.$id);
         
        }
      })
      //await deleteFile(uploadedFile.$id);
      //throw Error;
    }

    return newPost;
    //});

  } catch (error) {
    console.log(error);
    return null;
  }
  
}

// fetch recent posts from the appwrite collection
export async function getRecentPosts() {
  const posts = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    [Query.orderDesc(`$createdAt`), Query.limit(20)]
  )

  if (!posts) throw Error;

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

// ============================== GET USERS
export async function getPostLikedUsers(userIds: string | string[]) {
  //const queries: any[] = [Query.orderDesc("$createdAt")];


  if (typeof userIds === "string") {
    userIds = [userIds];
  } else {
    userIds = userIds;
  }

  //console.log(userIds)

  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.orderDesc("$createdAt"),
      Query.equal('$id', userIds)

      ]
    );

    if (!users) throw Error;

    return users;
  } catch (error) {
    console.log(error);
  }
}
// ============================== like Post 
// this post returns the ids of the users that have liked the post
export async function likePost(postId: string, likesArray: string[]) {
  try {
    //console.log("likePost",postId)
    //console.log("likePost", {likes: likesArray})
    // likesArray.splice(0)
    // console.log({likes: likesArray})
    // filter out undefined if any
    //likesArray=likesArray.filter(item => !!item);

    //console.log("likePost--2", {likes: likesArray})
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray,
      }
    );

    if (!updatedPost) throw Error;

    return updatedPost;


  } catch (error) {
    console.log("LIKE didnot update");
    console.log(error);

  }


}


// ==========
// to save post of postId by userId
// by creating a document 
export async function savePost(postId: string, userId: string) {
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

    if (!savedPost) return Error;

    return savedPost;


  } catch (error) {
    console.log(error);

  }


}

// ====================== delete saved post
export async function deleteSavedPost(savedRecordId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId
    );

    if (!statusCode)
      return Error;

    return { status: 'ok' };


  } catch (error) {
    console.log(error);

  }
}

export async function getPostById(postId: string) {
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


// ============================== Update POST
export async function updatePost(post: IUpdatePost) {

  //const hasFileToUpdate = post.files.length > 0;
  const hasFileToUpdate = post.filesMap.size > 0;

  try {
    // Upload file to appwrite storage
    //console.log('createPost')
    //console.log(post)
    //(async ()=>{
    let fileUrls: Array<string>=[];
    let uploadedFilesIds: Array<string> =[];
    
    
    const promises = Array.from(post.filesMap).map(async ([key, file]) => {
      //for( let [key, file] of Object.entries(post.filesMap)){

      if (file.isLocal) { // a local file is added
        // Upload file to appwrite storage
       const uploadedFile = await uploadFile(file.localFile);
          
        return uploadedFile;
      }

    });

    const fileIds = await Promise.all(promises);

    fileIds.forEach((file)=>{
      if(file?.$id){
      
        const fileUrl=getFilePreview(file.$id);
        
        if (!fileUrl) {
          // if something goes wrong or corrupted then delete the media file from the storage
          deleteFile(file.$id);
          throw Error;
        }
        uploadedFilesIds.push(file.$id);
        fileUrls.push(fileUrl.toString())

      }
    })

    post.filesMap.forEach( (file: EditFile, key: string) => {
      //for( let [key, file] of Object.entries(post.filesMap)){

      if (!file.isLocal) { // a local file is added
        // Upload file to appwrite storage

        fileUrls.push(file.remoteFileUrl);
        uploadedFilesIds.push(file.remoteFileId);

      }

    });

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrls: fileUrls,
        imageIds: uploadedFilesIds,
        location: post.location,
        tags: tags,
      });

    if(!updatedPost) {
     
      fileIds.forEach((file)=>{
        if(file?.$id){
           // if something goes wrong or corrupted then delete the media file from the storage
            deleteFile(file.$id);
           
        }
      })
      //await deleteFile(uploadedFile.$id);
      //throw Error;
    }

    return updatedPost;



    
  } catch (error) {
    console.log(error);
    return null;
  }
}

// ============================== DELETE POST
export async function deletePost(postId: string, imageIds: string[]) {
  if (!postId || !imageIds) return;

  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

   

    if (!statusCode) throw Error;
    console.log("deletepost")
    console.log(imageIds)
    imageIds.forEach(async (imageId)=>{
       await deleteFile(imageId);
    })

    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET USER'S POST
export async function getUserPosts(userId?: string) {
  if (!userId) return;

  try {
    const post = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
    );

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
}


export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(10)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
    // for the second page skip the first 10 and give me the next 10
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET POSTS
export async function searchPosts(searchTerm: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search("caption", searchTerm)]
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

// ============================== UPDATE USER
export async function updateUser(user: IUpdateUser) {
  const hasFileToUpdate = user.file.length > 0;
  try {
    let image = {
      imageUrl: user.imageUrl,
      imageId: user.imageId,
    };

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(user.file[0]);
      if (!uploadedFile) throw Error;

      // Get new file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    //  Update user
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user.userId,
      {
        name: user.name,
        bio: user.bio,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
      }
    );

    // Failed to update
    if (!updatedUser) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }
      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    if (user.imageId && hasFileToUpdate) {
      await deleteFile(user.imageId);
    }

    return updatedUser;
  } catch (error) {
    console.log(error);
  }
}


// ============================== GET USER BY ID
export async function getUserById(userId: string) {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );

    if (!user) throw Error;

    return user;
  } catch (error) {
    console.log(error);
  }
}