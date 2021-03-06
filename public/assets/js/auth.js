import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, collection, setDoc, doc,serverTimestamp} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";


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
const profileCollection = collection(db, 'profiles')

const loginButton = document.querySelector('#login-bt')
loginButton.addEventListener('click', login)


function logout(){
    signOut(auth)
}

logout()


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
                    messageErroInfo.textContent = 'Digite um email v??lido'
                    break;
                case "auth/user-not-found":
                    messageErroInfo.style.display = "block"
                    messageErroInfo.textContent = 'Usu??rio n??o encontrado'
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
    const name = document.querySelector('#register-name').value.trim()
    const lastName = document.querySelector('#register-lastname').value.trim()
    const birth = document.querySelector('#register-birth').value.trim()
    const title = document.querySelector('#register-title').value.trim()
    const state = document.querySelector('#register-state').value.trim()
    const city = document.querySelector('#register-city').value.trim()
    const country = document.querySelector('#register-country').value.trim()
    const email = document.querySelector('#register-email').value.trim()
    const password = document.querySelector('#register-password').value.trim()
   

    const allRegisterInputs = document.querySelectorAll('[data-register]')

    const emailElement = document.querySelector('#register-email')
    const passwordElement = document.querySelector('#register-password')
    const messageErroInfo = document.querySelector('.message-info-modal')

    let inputsFilled = []
    
    for(let i = 0; i < allRegisterInputs.length; i++){
        if(allRegisterInputs[i].value.trim() == ''){
            allRegisterInputs[i].classList.add('erro')
            messageErroInfo.style.display = "block"
            messageErroInfo.textContent = 'Por favor preencha todos os campos!'
        }else{
            allRegisterInputs[i].classList.remove('erro')
            inputsFilled.push('ok')
        }
    }

    let allInputsAreFilled = inputsFilled.length == allRegisterInputs.length ? true : false

    

    if(allInputsAreFilled){
        createUserWithEmailAndPassword(auth, email, password)
        .then((data) => {
            const uid = data.user.uid

            setDoc(doc(db,'profiles',uid),{
                name,
                lastName,
                birth,
                title,
                state,
                city,
                country,
                pic:'https://firebasestorage.googleapis.com/v0/b/blkc-network.appspot.com/o/ProfilesImages%2Favatar.png?alt=media&token=6a9c7d9f-0bb1-4690-b0d8-458b42769273',
                cover: "https://firebasestorage.googleapis.com/v0/b/blkc-network.appspot.com/o/ProfilesImages%2Fbg-login.jpg?alt=media&token=f96eccd5-002d-4125-b7a8-099d245b2e7a",
                follow: [],
                following: [],
                createAt: serverTimestamp()
            })

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
                    messageErroInfo.textContent = 'Esse email j?? est?? sendo utilizado.'
                break;
                case 'auth/internal-error':
                    messageErroInfo.style.display = "block"
                    passwordElement.style.border = '2px solid red'
                    messageErroInfo.textContent = "Digite uma senha"
                break;
                case 'auth/invalid-email':
                    messageErroInfo.style.display = "block"
                    emailElement.style.border = "2px solid red"
                    messageErroInfo.textContent = 'Digite um email v??lido.'
                break;
                default:
                    messageErroInfo.style.display = "block"
                    messageErroInfo.textContent = erro.message
                    break;
            }
        })
    }
   

}

const birthInput = document.querySelector('#register-birth')

birthInput.oninput = function (e){
    mascaraData(e.target)
}


function mascaraData(val) {
    var pass = val.value;
    var expr = /[0123456789]/;
  
    for (let i = 0; i < pass.length; i++) {
      // charAt -> retorna o caractere posicionado no ??ndice especificado
      var lchar = val.value.charAt(i);
      var nchar = val.value.charAt(i + 1);
  
      if (i == 0) {
        // search -> retorna um valor inteiro, indicando a posi????o do inicio da primeira
        // ocorr??ncia de expReg dentro de instStr. Se nenhuma ocorrencia for encontrada o m??todo retornara -1
        // instStr.search(expReg);
        if ((lchar.search(expr) != 0) || (lchar > 3)) {
          val.value = "";
        }
  
      } else if (i == 1) {
  
        if (lchar.search(expr) != 0) {
          // substring(indice1,indice2)
          // indice1, indice2 -> ser?? usado para delimitar a string
          var tst1 = val.value.substring(0, (i));
          val.value = tst1;
          continue;
        }
  
        if ((nchar != '/') && (nchar != '')) {
          var tst1 = val.value.substring(0, (i) + 1);
  
          if (nchar.search(expr) != 0)
            var tst2 = val.value.substring(i + 2, pass.length);
          else
            var tst2 = val.value.substring(i + 1, pass.length);
  
          val.value = tst1 + '/' + tst2;
        }
  
      } else if (i == 4) {
  
        if (lchar.search(expr) != 0) {
          var tst1 = val.value.substring(0, (i));
          val.value = tst1;
          continue;
        }
  
        if ((nchar != '/') && (nchar != '')) {
          var tst1 = val.value.substring(0, (i) + 1);
  
          if (nchar.search(expr) != 0)
            var tst2 = val.value.substring(i + 2, pass.length);
          else
            var tst2 = val.value.substring(i + 1, pass.length);
  
          val.value = tst1 + '/' + tst2;
        }
      }
  
      if (i >= 6) {
        if (lchar.search(expr) != 0) {
          var tst1 = val.value.substring(0, (i));
          val.value = tst1;
        }
      }
    }
  
    if (pass.length > 10)
      val.value = val.value.substring(0, 10);
    return true;
  }