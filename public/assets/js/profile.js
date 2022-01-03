//import { renderPosts } from "./posts.js";
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

const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('id');


//var profileImages = storageRef.child('ProfilesImages')

const allPostsCollection = collection(db, 'posts')
const allProfileCollection = collection(db, 'profiles')


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

    checkIfFollow()
    readPosts(currentUserUid)
    renderProfileInfo(currentUserProfile)
}

async function readPosts(currentUserUid) {
    let posts = []

    const postsQuery = query(allPostsCollection, orderBy('date', 'desc'))
    const allPosts = await getDocs(postsQuery)
    allPosts.docs.forEach((post) => {
        if (myParam) {
            if (post.data().ownerId == myParam) {
                posts.push(
                    {
                        post: post.data(),
                        id: post.id
                    }
                )
            }
        } else {
            if (post.data().ownerId == currentUserUid) {
                posts.push(
                    {
                        post: post.data(),
                        id: post.id
                    }
                )
            }
        }


    })

    for (let i = 0; i < posts.length; i++) {
        const storageRef = await firebase.ref(storage, `ProfilesImages/${posts[i].post.ownerId}_pic`)
        const url = await firebase.getDownloadURL(storageRef)
            .then((urlImage) => posts[i].post.pic = urlImage)
            .catch(() => posts[i].post.pic = currentUserProfile.pic)

        for (let j = 0; j < allProfiles.length; j++) {
            if (posts[i].post.ownerId == allProfiles[j].id) {
                posts[i].post.owner = `${allProfiles[j].profile.name} ${allProfiles[j].profile.lastName}`
            }
        }
    }

    renderPosts(posts, currentUserProfile)
}



function renderProfileInfo(currentUserProfile) {
    console.log(currentUserProfile)



    if (myParam == null || myParam == currentUserProfile.id) {
        const profileImgCover = document.querySelector('#profile-cover-img')
        const allImages = document.querySelectorAll('[data-src]')

        const fullName = currentUserProfile.name + ' ' + currentUserProfile.lastName
        const location = `${currentUserProfile.city},${currentUserProfile.state} - ${currentUserProfile.country}`

        const profileName = document.querySelector('.profile-header--infos__about--name')
        const profileTitle = document.querySelector('.profile-header--infos__about--local')

        const profileFollowers = document.querySelector('#profile-followers')
        const profileFollowing = document.querySelector('#profile-following')

        const profileBirth = document.querySelector('#profile-birth')
        const profileLocation = document.querySelector('#profile-location')

        const editProfileButton = document.querySelector('#profile-edit')

        if (currentUserProfile.cover) {
            profileImgCover.style.backgroundImage = `url(${currentUserProfile.cover})`
        }

        for (let i = 0; i < allImages.length; i++) {
            const imageAttribute = allImages[i].getAttribute('data-src')

            if (currentUserProfile[imageAttribute]) {
                allImages[i].src = currentUserProfile[imageAttribute]
            }
        }

        profileName.textContent = fullName
        profileTitle.textContent = currentUserProfile.title
        profileFollowers.textContent = currentUserProfile.follower.length
        profileFollowing.textContent = currentUserProfile.following.length
        profileBirth.innerHTML += currentUserProfile.birth
        profileLocation.innerHTML += location

        editProfileButton.style.display = "block"
    } else {

        if (currentUserProfile.pic) {
            const profileHeaderPic = document.querySelector('#profile-pic-header')
            profileHeaderPic.src = currentUserProfile.pic
        }

        renderOtherProfiles(myParam)
    }
}

function renderOtherProfiles(myParam) {
    console.log(myParam)
    let currentProfile = allProfiles.filter(profile => profile.id == myParam)

    const fullName = currentProfile[0].profile.name + ' ' + currentProfile[0].profile.lastName
    const location = `${currentProfile[0].profile.city},${currentProfile[0].profile.state} - ${currentProfile[0].profile.country}`

    const profileName = document.querySelector('.profile-header--infos__about--name')
    const profileTitle = document.querySelector('.profile-header--infos__about--local')

    const profileFollowers = document.querySelector('#profile-followers')
    const profileFollowing = document.querySelector('#profile-following')

    const profileBirth = document.querySelector('#profile-birth')
    const profileLocation = document.querySelector('#profile-location')

    profileBirth.textContent = ''
    profileLocation.textContent = ''

    const followProfileButton = document.querySelector('#profile-follow')

    const profilePic = document.querySelector('#profile-pic-img')
    const profileCover = document.querySelector('#profile-cover-img')


    profilePic.src = currentProfile[0].profile.pic
    profileCover.style.backgroundImage = `url(${currentProfile[0].profile.cover})`

    profileName.textContent = fullName
    profileTitle.textContent = currentProfile[0].profile.title
    profileFollowers.textContent = currentProfile[0].profile.follower.length
    profileFollowing.textContent = currentProfile[0].profile.following.length
    profileBirth.innerHTML += `<i class="fas fa-calendar-week"></i> ${currentProfile[0].profile.birth}`
    profileLocation.innerHTML += `<i class="fas fa-map-marker-alt"></i> ${location}`

    followProfileButton.style.display = "block"


    console.log(currentProfile)
}

window.onload = () => {
    getUser()
}


//LOGOUT
const logoutButton = document.querySelector('#logout-button')
logoutButton.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            window.location.replace('login.html')
        })
})



//UPDATE PROFILE INFORMATIONS
const editProfileButton = document.querySelector('#profile-edit')
const modal = document.querySelector('.modal')
const body = document.querySelector('body')

editProfileButton.addEventListener('click', () => {
    modal.classList.add('openned-big')
    body.style.overflow = "hidden"
    closeModal()
})


const saveChangesButton = document.querySelector('#profile-save-changes')

saveChangesButton.addEventListener('click', updateProfileInformations)


async function updateProfileInformations() {
    const updateInfosObj = {}


    const allUploadInputs = document.querySelectorAll('[data-image]')



    for (let i = 0; i < allUploadInputs.length; i++) {

        let uploadInputField = allUploadInputs[i].getAttribute('id').split('-')

        if (allUploadInputs[i].files.length > 0) {
            const storageRef = firebase.ref(storage, `ProfilesImages/${currentUserProfile.id}_${uploadInputField[1]}`)
            const upload = await firebase.uploadBytesResumable(storageRef, allUploadInputs[i].files[0])
            const url = await firebase.getDownloadURL(storageRef).then((urlImage) => updateInfosObj[uploadInputField[1]] = urlImage)
        }

    }



    const allInputs = document.querySelectorAll('[data-profile]')


    for (let i = 0; i < allInputs.length; i++) {
        let idInput = allInputs[i].getAttribute('id')
        let updateName = allInputs[i].getAttribute('id').split('-')
        let documentValue = document.querySelector(`#${idInput}`).value.trim()

        if (documentValue) {
            updateInfosObj[updateName[1]] = documentValue
        }

    }

    const userProfileRef = doc(db, 'profiles', currentUserProfile.id)
    const profileUpdate = await updateDoc(userProfileRef, updateInfosObj)


    window.location.reload()
}


//FOLLOW AND UNFOLLOW PERSONS
const followProfileButton = document.querySelector('#profile-follow')
followProfileButton.addEventListener('click', followSomePerson)

function checkIfFollow() {

    let isFollwing = currentUserProfile.following.filter(id => id == myParam)

    if (isFollwing.length > 0) {
        followProfileButton.innerHTML = `<i class="fas fa-user-minus"></i> Deixar de seguir`
    } else {
        followProfileButton.innerHTML = `<i class="fas fa-user-plus"></i> Seguir`
    }

}

async function followSomePerson() {
    let isFollwing = currentUserProfile.following.filter(id => id == myParam)

    if (isFollwing.length > 0) {
        unFollowSomePerson()


    } else {
        const currentFollwers = currentUserProfile.following
        const userProfileRef = doc(db, 'profiles', currentUserProfile.id)
        const profileUpdate = await updateDoc(userProfileRef, { following: [...currentFollwers, myParam] })


        const otherPersonProfileInformations = allProfiles.filter(profile => profile.id == myParam)
        const followersOtherPerson = otherPersonProfileInformations[0].profile.follower
        const otherPersonProfileRef = doc(db, 'profiles', otherPersonProfileInformations[0].id)
        const otherPersoprofileUpdate = await updateDoc(otherPersonProfileRef, { follower: [...followersOtherPerson, currentUserProfile.id] })

        currentUserProfile = {}
        allProfiles = []

        getUser()
    }
}

async function unFollowSomePerson() {

    const currentFollwersWithOutUnFollow = currentUserProfile.following.filter(id => id != myParam)
    const userProfileRef = doc(db, 'profiles', currentUserProfile.id)
    const profileUpdate = await updateDoc(userProfileRef, { following: currentFollwersWithOutUnFollow })


    const otherPersonProfileInformations = allProfiles.filter(profile => profile.id == myParam)
    const followersOtherPerson = otherPersonProfileInformations[0].profile.follower
    const followersOtherPersonWithOutMyId = followersOtherPerson.filter(id => id != currentUserProfile.id)
    const otherPersonProfileRef = doc(db, 'profiles', otherPersonProfileInformations[0].id)
    const otherPersoprofileUpdate = await updateDoc(otherPersonProfileRef, { follower: followersOtherPersonWithOutMyId })
    
    currentUserProfile = {}
    allProfiles = []

    getUser()

}


//TESTE POST

function renderPosts(posts, currentUserProfile) {
    const feedPostArea = document.querySelector('#feed-area')

   // console.log(posts)

    feedPostArea.innerHTML = ''

    for (let i = 0; i < posts.length; i++) {
        feedPostArea.innerHTML += `
        <div class="feed-area">
        <div class="feed-area--header">
            <div class="feed-area--header__left-side">
                <div class="feed-area--pic">
                    <img src="${posts[i].post.pic}">
                </div>
                <div class="feed-area--infos">
                    <a href="/public/profile.html?id=${posts[i].post.ownerId}"><span class="feed-area--infos__name">${posts[i].post.owner}</span></a>
                    <span class="feed-area--infos__date">${posts[i].post.date.toDate()}</span>
                </div>
            </div>
    
            <div class="feed-area--header__right-side">
                <i class="fas fa-ellipsis-v feed-area--more__button"></i>
            </div>
        </div>
    
        <div class="feed-area--post">
            <p>${posts[i].post.text}</p>
        </div>
    
        <div class="line"></div>
            <div class="feed-area--interactions">
                <div class="feed-area--stars__button" data-like="id-${i}">
                    <span data-ok="id-${i}"><i class="far fa-star"></i></span>
                    <span data-num="id-${i}">${posts[i].post.like.length}</span>
                </div>
                <div class="feed-area--comments__button">
                    <span><i class="far fa-comment-alt"></i></span>
                    <span>0</span>
                </div>
            </div>
        <div class="line"></div>
    
        <div class="feed-area--all-comments">

            <div class="feed-area--comment">
                <div class="feed-area--comment__pic">
                    <img src="./assets/images/avatar.jpg">
                </div>
                <div class="feed-area--comment__wrap">
                    <div class="feed-area--comment__user">
                        <a href=""><span>Eduardo Mota</span></a>
                    </div>
                    <div class="feed-area--comment__text">
                        <p>${posts[i].post.comments}</p>
                    </div>
                </div>
            </div>     
           
        </div>
    
        <div class="feed-area--new-comment">
            <div class="feed-area--new-comment__pic">
                <img src="${currentUserProfile.pic}">
            </div>
            <div class="feed-area--new-coment__input">
                <input type="text" placeholder="Escreva um comentário">
            </div>
        </div>
        `

        setTimeout(() => {
            
            let likeButton = document.querySelector(`[data-like="id-${i}"]`)
           

            likeButton.addEventListener('click', function () {

                systemLike(posts[i].id, posts[i].post.like, currentUserProfile.id, i)
            })

            
        }, 200)

        
    }

    renderLikes(posts,currentUserProfile.id)
}


async function renderLikes(posts,uid){
    console.log(posts)

    for(let i = 0; i < posts.length; i++){
        let likeStar = document.querySelector(`[data-ok="id-${i}"]`)
        let likeNum = document.querySelector(`[data-num="id-${i}"]`)

        for(let j = 0; j < posts[i].post.like.length; j++){
            if(posts[i].post.like[j] == uid){
                    likeStar.classList.add('liked')
                    likeStar.innerHTML = `<i class="fas fa-star"></i>`
                    likeNum.classList.add('liked')
            }
        }
    }
}

async function systemLike(postId, amountLike, uid, id) {
    let likeStar = document.querySelector(`[data-ok="id-${id}"]`)
    let likeNum = document.querySelector(`[data-num="id-${id}"]`)


    let isLiking = amountLike.filter(likeId => likeId == uid)

    //removing like
    if(isLiking.length > 0){
        let likesWithOutMyLike = amountLike.filter(likeId => likeId != uid)

        const postRef = doc(db, 'posts', postId)
        const profileUpdate = await updateDoc(postRef, { like: likesWithOutMyLike })

        likeStar.classList.remove('liked')
        likeStar.innerHTML = `<i class="far fa-star"></i>`
        likeNum.classList.remove('liked')
    }
    //adding like
    else{
        let likesWithMyLike = amountLike.filter(likeId => likeId != uid)

        const postRef = doc(db, 'posts', postId)
        const profileUpdate = await updateDoc(postRef, { like: [...likesWithMyLike, uid] })

        likeStar.classList.add('liked')
        likeStar.innerHTML = `<i class="fas fa-star"></i>`
        likeNum.classList.add('liked')
    }

    
        readProfileInformations(uid)
    
    
}