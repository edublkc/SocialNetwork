import { header, closeModal } from "./components.js"

header()

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import * as firebase from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, serverTimestamp, query, orderBy, where } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

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

const allProfileCollection = collection(db, 'profiles')

const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('search');

var currentUserProfile = {}
var allProfiles = []


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

    search()
    renderHeader()
}

function renderHeader() {
    if (currentUserProfile.pic) {
        const profileHeaderPic = document.querySelector('#profile-pic-header')
        profileHeaderPic.src = currentUserProfile.pic
    }
}



function search() {
    let resultArray = []
    let allLetterLower = myParam.toLocaleLowerCase()

    if(allLetterLower){
        for (let i = 0; i < allProfiles.length; i++) {
            if (allProfiles[i].profile.name.toLocaleLowerCase().includes(allLetterLower)) {
                resultArray.push(allProfiles[i])
            }else if(allProfiles[i].profile.lastName.toLocaleLowerCase().includes(allLetterLower)){
                resultArray.push(allProfiles[i])
            } else if(allProfiles[i].profile.title.toLocaleLowerCase().includes(allLetterLower)){
                resultArray.push(allProfiles[i])
            }
        }
    }
  
    renderResult(resultArray)
}

function renderResult(resultArray) {
    const containerWithResult = document.querySelector('.wrap')

    
    if(resultArray.length > 0){
        for(let i = 0; i < resultArray.length; i++){
            containerWithResult.innerHTML += `
            <div class="search-result">
                <div class="search-result--profile__pic">
                    <img src="${resultArray[i].profile.pic}">
                </div>
                <div class="search-result--infos">
                    <a href="profile.html?id=${resultArray[i].id}" id="search-result--infos__name">${resultArray[i].profile.name} ${resultArray[i].profile.lastName}</a>
                    <a href="profile.html?id=${resultArray[i].id}" id="search-result--infos__title">${resultArray[i].profile.title}</a>
                </div>
            </div>
            `
        }
    }else{
        containerWithResult.innerHTML += `
            <h3>Nenhum resultado para sua busca!</h3>
            `
    }
    
}


window.onload = () => {
    getUser()
}