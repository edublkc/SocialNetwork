import {header, closeModal} from "./components.js"

header()

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

var currentUserProfile = {}


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


async function readProfileInformations (currentUserUid){
    
    const profile = await getDocs(allProfileCollection)
    profile.docs.forEach((profile)=>{
        if(profile.id == currentUserUid){
            currentUserProfile = profile.data()
        }
        
    })

    renderProfileInfo(currentUserProfile)
}


function renderProfileInfo(currentUserProfile){
    console.log(currentUserProfile)
    const fullName = currentUserProfile.name +' '+currentUserProfile.lastName
    const location = `${currentUserProfile.city},${currentUserProfile.state} - ${currentUserProfile.country}`

    const profileName = document.querySelector('.profile-header--infos__about--name')
    const profileTitle = document.querySelector('.profile-header--infos__about--local')
    const profileBirth = document.querySelector('#profile-birth')
    const profileLocation = document.querySelector('#profile-location')


    profileName.textContent = fullName
    profileTitle.textContent = currentUserProfile.title
    profileBirth.innerHTML += currentUserProfile.birth
    profileLocation.innerHTML += location
}

window.onload = () =>{
    getUser()
}



const logoutButton = document.querySelector('#logout-button')
logoutButton.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            window.location.replace('login.html')
        })
})


const editProfileButton = document.querySelector('.profile-edit')
const modal = document.querySelector('.modal')
const body = document.querySelector('body')

editProfileButton.addEventListener('click',()=>{
    modal.classList.add('openned-big')
    body.style.overflow = "hidden"
    closeModal()
})