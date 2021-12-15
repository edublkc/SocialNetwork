import { renderPosts } from "./index.js";
import * as effect from "./effects.js"



import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

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

function getUser() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const userProfileName = document.querySelector('#menu-profile--name')

            userProfileName.innerHTML = user.email

        } else {
            window.location.replace('login.html')
        }
    })
}


let posts = []
const allPostsCollection = collection(db, 'posts')





async function readPosts() {
    const allPosts = await getDocs(allPostsCollection)
      allPosts.docs.forEach((post)=>{
          posts.push(post.data())
          
      })

      renderPosts(posts)
}



window.onload = () => {
    getUser()
    readPosts()
}




const logoutButton = document.querySelector('#logout-button')
const newPostSendButton = document.querySelector('.new-post-pic');

newPostSendButton.addEventListener('click',function(){
    alert('pegou')
})




logoutButton.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            window.location.replace('login.html')
        })

})

