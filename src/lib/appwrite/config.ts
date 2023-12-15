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


