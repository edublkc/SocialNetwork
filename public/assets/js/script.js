import { renderPosts, renderProfileInfo } from "./index.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, serverTimestamp,query,orderBy,where } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBA3z6tyOTfwlExomg10Fq9eX95-8TQw10",
    authDomain: "blkc-network.firebaseapp.com",
    projectId: "blkc-network",
    storageBucket: "blkc-network.appspot.com",
    messagingSenderId: "761736032089",
    appId: "1:761736032089:web:2dbcbc5a10ede25c692648",
    measurementId: "G-M8GRSD3B7C"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
const allPostsCollection = collection(db, 'posts')
const allProfileCollection = collection(db,'profiles')
let posts = []
let currentUserProfile = {}

function getUser() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const userProfileName = document.querySelector('#menu-profile--name')
            readProfileInformations(user.uid)
            userProfileName.innerHTML = user.email

        } else {
            window.location.replace('login.html')
        }
    })
}


async function readPosts() {
    posts = []
    document.querySelector('#post-input').textContent = ''

    const postsQuery = query(allPostsCollection,orderBy('date','desc'))
    const allPosts = await getDocs(postsQuery)
      allPosts.docs.forEach((post)=>{
          posts.push(post.data())
      })
      renderPosts(posts)
}

async function readProfileInformations (currentUserUid){
    
    const profile = await getDocs(allProfileCollection)
    profile.docs.forEach((profile)=>{
        if(profile.id == currentUserUid){
            currentUserProfile = profile.data()
        }
        
    })

    renderProfileInfo(currentUserProfile)
}


window.onload = () => {
    getUser()
    readPosts()
}


const logoutButton = document.querySelector('#logout-button')
const newPostSendButton = document.querySelector('#send-new-post');

newPostSendButton.addEventListener('click',addNewPost)

async function addNewPost(){
    const newPostInput = document.querySelector('#post-input').textContent.trim()
    const docRef = await addDoc(allPostsCollection,{
        text: newPostInput,
        date: serverTimestamp(),
        like: 0,
        comments: '',
        owner: currentUserProfile.name +' '+ currentUserProfile.lastName
    }) 

    readPosts()
}


logoutButton.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            window.location.replace('login.html')
        })
})

