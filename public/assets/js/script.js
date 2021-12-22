import { renderPosts } from "./posts.js";

import { header, newPost } from "./components.js"

header()
newPost()


import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, serverTimestamp, query, orderBy, where } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import * as firebase from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

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
const storage = firebase.getStorage()
const allPostsCollection = collection(db, 'posts')
const allProfileCollection = collection(db, 'profiles')
let posts = []
let currentUserProfile = {}
let allProfiles = []

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


async function readPosts(currentUserUid) {
    posts = []
    document.querySelector('#post-input').textContent = ''

    const postsQuery = query(allPostsCollection, orderBy('date', 'desc'))
    const allPosts = await getDocs(postsQuery)
    allPosts.docs.forEach((post) => {
        posts.push(post.data())
    })

    for (let i = 0; i < posts.length; i++) {
        const storageRef = await firebase.ref(storage, `ProfilesImages/${posts[i].ownerId}_pic`)
        const url = await firebase.getDownloadURL(storageRef)
            .then((urlImage) => posts[i].pic = urlImage)
            .catch(() => posts[i].pic = currentUserProfile.pic)

        for(let j = 0; j < allProfiles.length; j++){
            if(posts[i].ownerId == allProfiles[j].id){
                posts[i].owner = `${allProfiles[j].profile.name} ${allProfiles[j].profile.lastName}`
            }
        }
    }

    renderPosts(posts, currentUserProfile)
}

async function readProfileInformations(currentUserUid) {

    const profile = await getDocs(allProfileCollection)
    profile.docs.forEach((profile) => {
        if (profile.id == currentUserUid) {
            currentUserProfile = profile.data()
            currentUserProfile.id = profile.id
        }

            allProfiles.push({
                profile: profile.data(),
                id: profile.id
            })
        

    })

    console.log(allProfiles)
    readPosts(currentUserUid)
    renderProfileInfo(currentUserProfile)
}

function renderProfileInfo(currentUserProfile) {
    console.log(currentUserProfile)

    const allImages = document.querySelectorAll('[data-src]')
    const profileCover = document.querySelector('.profile-cover')
    const menuProfileName = document.querySelector('.profile-name')
    const menuProfileTitle = document.querySelector('#profile-title')


    menuProfileName.textContent = `${currentUserProfile.name} ${currentUserProfile.lastName}`
    menuProfileTitle.textContent = `${currentUserProfile.title}`

    if (currentUserProfile.cover) {
        profileCover.style.backgroundImage = `url(${currentUserProfile.cover})`
    }

    for (let i = 0; i < allImages.length; i++) {
        const imageAttribute = allImages[i].getAttribute('data-src')

        if (currentUserProfile[imageAttribute]) {
            allImages[i].src = currentUserProfile[imageAttribute]
        }
    }

}

window.onload = () => {
    getUser()
    //readPosts()
}


const logoutButton = document.querySelector('#logout-button')
const newPostSendButton = document.querySelector('#send-new-post');

newPostSendButton.addEventListener('click', addNewPost)

async function addNewPost() {
    const newPostInput = document.querySelector('#post-input').textContent.trim()
    const docRef = await addDoc(allPostsCollection, {
        text: newPostInput,
        date: serverTimestamp(),
        like: 0,
        comments: '',
        pic: currentUserProfile.pic,
        ownerId: currentUserProfile.id,
        owner: currentUserProfile.name + ' ' + currentUserProfile.lastName
    })

    readPosts()
}


logoutButton.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            window.location.replace('login.html')
        })
})

