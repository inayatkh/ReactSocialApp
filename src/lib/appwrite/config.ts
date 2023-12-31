import { Client, Account, Databases, Storage, Avatars} from 'appwrite'


// npm install appwrite
/*export const appwriteConfig ={
    projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    url: import.meta.env.VITE_APPWRITE_URL,

    cannot read envirnoment variable from .env.local return empty string
    i diagnose it later

};*/

export const appwriteConfig ={
    projectId: '657a91669c936828b2d7',
    url: 'https://cloud.appwrite.io/v1',
    databaseId: '657bd41909c7a605c8c1',
    storageId: '657bd38c9149bbe9a791',
    userCollectionId: '657bd90fb2cd839eafdf',
    postCollectionId: '657bd853ea3eb2f8b24f',
    savesCollectionId: '657bd9a88c9dfd639967',


};

//const sdk = require('node-appwrite');

export const client = new Client();
/*
const test= appwriteConfig.url || 'inayat check .env.local cannot read' ;

console.log(test);

console.log(test.replace('https://', 'wss://'));
*/
client.setEndpoint(appwriteConfig.url);
client.setProject(appwriteConfig.projectId);

export const databases = new Databases(client);
export const storage = new Storage(client);
export const account = new Account(client);
export const avatars = new Avatars(client);


