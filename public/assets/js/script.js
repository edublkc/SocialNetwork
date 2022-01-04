//SCRIPT

//import { renderPosts } from "./posts.js";

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
        posts.push(
            {
                post: post.data(),
                id: post.id
            }
        )
    })

    let myFriendPosts = []

    for (let i = 0; i < posts.length; i++) {
        for (let j = 0; j < currentUserProfile.following.length; j++) {
            if (posts[i].post.ownerId == currentUserProfile.following[j]) {
                myFriendPosts.push(posts[i])
            }
        }
        if (posts[i].post.ownerId == currentUserUid) {
            myFriendPosts.push(posts[i])
        }
    }



    for (let i = 0; i < myFriendPosts.length; i++) {
        const storageRef = await firebase.ref(storage, `ProfilesImages/${myFriendPosts[i].post.ownerId}_pic`)
        const url = await firebase.getDownloadURL(storageRef)
            .then((urlImage) => myFriendPosts[i].post.pic = urlImage)
            .catch(() => myFriendPosts[i].post.pic = currentUserProfile.pic)

        for (let j = 0; j < allProfiles.length; j++) {
            if (myFriendPosts[i].post.ownerId == allProfiles[j].id) {
                myFriendPosts[i].post.owner = `${allProfiles[j].profile.name} ${allProfiles[j].profile.lastName}`
            }
        }
    }

    renderPosts(myFriendPosts, currentUserProfile)
}

export async function readProfileInformations(currentUserUid) {

    currentUserProfile = {}
    allProfiles = []

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
    const followingNumber = document.querySelector('#profile-home-following')
    const followerNumber = document.querySelector('#profile-home-follower')

    menuProfileName.textContent = `${currentUserProfile.name} ${currentUserProfile.lastName}`
    menuProfileTitle.textContent = `${currentUserProfile.title}`
    followingNumber.textContent = currentUserProfile.following.length
    followerNumber.textContent = currentUserProfile.follower.length

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
        like: [],
        comments: [],
        pic: currentUserProfile.pic,
        ownerId: currentUserProfile.id,
        owner: currentUserProfile.name + ' ' + currentUserProfile.lastName
    })

    readPosts(currentUserProfile.id)
}


logoutButton.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            window.location.replace('login.html')
        })
})


//TESTE POST

function renderPosts(posts, currentUserProfile) {
    const feedPostArea = document.querySelector('#feed-area')

    // console.log(posts)

    feedPostArea.innerHTML = ''

    for(let i = 0; i < posts.length; i++){
        for(let j = 0; j < posts[i].post.comments.length; j++){
            for(let x = 0; x < allProfiles.length; x++){
                if(posts[i].post.comments[j].userId == allProfiles[x].id){
                    posts[i].post.comments[j].pic = allProfiles[x].profile.pic
                    posts[i].post.comments[j].name = `${allProfiles[x].profile.name} ${allProfiles[x].profile.lastName}`
                }
            }
        }
    }

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
                    <span>${posts[i].post.comments.length}</span>
                </div>
            </div>
        <div class="line"></div>
    
        <div class="feed-area--all-comments" data-allcomments="id-${i}">

        </div>
    
        <div class="feed-area--new-comment">
            <div class="feed-area--new-comment__pic">
                <img src="${currentUserProfile.pic}">
            </div>
            <div class="feed-area--new-coment__input">
                <input data-comment="id-${i}" type="text" placeholder="Escreva um comentário">
            </div>
        </div>
        `
        for (let j = 0; j < posts[i].post.comments.length; j++) {
            let commentArea = document.querySelector(`[data-allcomments="id-${i}"]`)

            commentArea.innerHTML += `
            <div class="feed-area--comment">
            <div class="feed-area--comment__pic">
                <img src="${posts[i].post.comments[j].pic}">
            </div>
            <div class="feed-area--comment__wrap">
                <div class="feed-area--comment__user">
                    <a href=""><span>${posts[i].post.comments[j].name}</span></a>
                </div>
                <div class="feed-area--comment__text">
                    <p>${posts[i].post.comments[j].comment}</p>
                </div>
            </div>
        </div>   
            `
        }

        setTimeout(() => {

            let likeButton = document.querySelector(`[data-like="id-${i}"]`)
            likeButton.addEventListener('click', function () {

                systemLike(posts[i].id, posts[i].post.like, currentUserProfile.id, i)
            })

            let commentInput = document.querySelector(`[data-comment="id-${i}"]`)
            commentInput.addEventListener('focusin', () => {
                commentInput.onkeyup = (e) => {
                    if (e.keyCode == 13) {
                        systemComment(i, posts[i].id, posts, posts[i].post.comments)
                    }
                }
            })

        }, 200)


    }

    //renderCommentImageAndName(posts)
    renderLikes(posts, currentUserProfile.id)
}

async function systemComment(id, postId, posts, allComments) {
    let commentInput = document.querySelector(`[data-comment="id-${id}"]`).value.trim()

    let userId = currentUserProfile.id
    const postRef = doc(db, 'posts', postId)
    const profileUpdate = await updateDoc(postRef, {
        comments: [...allComments,
        {
            userId,
            comment: commentInput,
            pic: currentUserProfile.pic,
            name: `${currentUserProfile.name} ${currentUserProfile.lastName}`
        }]
    })

    console.log('funcionou')

    getUser()
    //readProfileInformations(userId)
}


//LIKE SYSTEM
async function renderLikes(posts, uid) {
    console.log(posts)

    for (let i = 0; i < posts.length; i++) {
        let likeStar = document.querySelector(`[data-ok="id-${i}"]`)
        let likeNum = document.querySelector(`[data-num="id-${i}"]`)

        for (let j = 0; j < posts[i].post.like.length; j++) {
            if (posts[i].post.like[j] == uid) {
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
    if (isLiking.length > 0) {
        let likesWithOutMyLike = amountLike.filter(likeId => likeId != uid)

        const postRef = doc(db, 'posts', postId)
        const profileUpdate = await updateDoc(postRef, { like: likesWithOutMyLike })

        likeStar.classList.remove('liked')
        likeStar.innerHTML = `<i class="far fa-star"></i>`
        likeNum.classList.remove('liked')
    }
    //adding like
    else {
        let likesWithMyLike = amountLike.filter(likeId => likeId != uid)

        const postRef = doc(db, 'posts', postId)
        const profileUpdate = await updateDoc(postRef, { like: [...likesWithMyLike, uid] })

        likeStar.classList.add('liked')
        likeStar.innerHTML = `<i class="fas fa-star"></i>`
        likeNum.classList.add('liked')
    }

    getUser()
    //readProfileInformations(uid)


}