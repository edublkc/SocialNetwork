import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, serverTimestamp, query, orderBy, where } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

import { readProfileInformations } from "./script.js"



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



var fakeLike = 0

export function renderPosts(posts, currentUserProfile) {
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
                    <span data-num="id-${i}">${posts[i].post.like.length + fakeLike}</span>
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


