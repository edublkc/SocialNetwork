import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";


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


const loginButton = document.querySelector('#login-bt')
loginButton.addEventListener('click', login)




function login() {
    if(getAuth().currentUser){
        signOut(auth)
    }
    
    const email = document.querySelector('#email').value.trim()
    const password = document.querySelector('#password').value.trim()
    const emailElement = document.querySelector('#email')
    const passwordElement = document.querySelector('#password')
    const messageErroInfo = document.querySelector('#message-info')

    if (email == '' || password == '') {
        emailElement.style.border = "2px solid red"
        passwordElement.style.border = "2px solid red"
    }

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            window.location.replace('index.html')
        })
        .catch((error) => {
            const erroType = error.code

            switch (erroType) {
                case "auth/wrong-password":
                    messageErroInfo.style.display = "block"
                    messageErroInfo.textContent = 'Email e/ou senha invalido(a)'
                    break;
                case "auth/invalid-email":
                    messageErroInfo.style.display = "block"
                    messageErroInfo.textContent = 'Digite um email válido'
                    break;
                case "auth/user-not-found":
                    messageErroInfo.style.display = "block"
                    messageErroInfo.textContent = 'Usuário não encontrado'
                    break;
                case 'auth/internal-error':
                    messageErroInfo.style.display = "block"
                    passwordElement.style.border = '2px solid red'
                    messageErroInfo.textContent = "Digite uma senha"
                    break;
                default:
                    //alert(error.message)
                    break;
            }


        })
}

const registerButton = document.querySelector('#new-user-button');

registerButton.addEventListener('click', singUP)

function singUP() {
    const email = document.querySelector('#register-email').value.trim()
    const password = document.querySelector('#register-password').value.trim()

    const emailElement = document.querySelector('#register-email')
    const passwordElement = document.querySelector('#register-password')
    const messageErroInfo = document.querySelector('.message-info-modal')

    if (email == '' || password == '') {
        emailElement.style.border = "2px solid red"
        passwordElement.style.border = '2px solid red'
        messageErroInfo.style.display = "block"
        messageErroInfo.textContent = "Preencha todos os campos."
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
            setTimeout(() => {
                window.location.replace('index.html')
            }, 1000)
        })

        .catch((erro) => {
            switch(erro.code){
                case 'auth/weak-password':
                    messageErroInfo.style.display = "block"
                    passwordElement.style.border = '2px solid red'
                    messageErroInfo.textContent = "Senha muito fraca."
                break;
                case 'auth/email-already-in-use':
                    messageErroInfo.style.display = "block"
                    emailElement.style.border = "2px solid red"
                    messageErroInfo.textContent = 'Esse email já está sendo utilizado.'
                break;
                case 'auth/internal-error':
                    messageErroInfo.style.display = "block"
                    passwordElement.style.border = '2px solid red'
                    messageErroInfo.textContent = "Digite uma senha"
                break;
                case 'auth/invalid-email':
                    messageErroInfo.style.display = "block"
                    emailElement.style.border = "2px solid red"
                    messageErroInfo.textContent = 'Digite um email válido.'
                break;
                default:
                    messageErroInfo.style.display = "block"
                    messageErroInfo.textContent = erro.message
                    break;
            }
        })

}
