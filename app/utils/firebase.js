import firebase from 'firebase/app';

const firebaseConf = {
    apiKey: "AIzaSyADO7g0y8AHX32yTAGPk5hB-PmkVY4HsBA",
    authDomain: "tenedores-a7149.firebaseapp.com",
    databaseURL: "https://tenedores-a7149.firebaseio.com",
    projectId: "tenedores-a7149",
    storageBucket: "tenedores-a7149.appspot.com",
    messagingSenderId: "457962131034",
    appId: "1:457962131034:web:96f08aa79baa3343701263"
}

export const firebaseApp =  firebase.initializeApp(firebaseConf);