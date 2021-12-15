const openModalRegister = document.querySelector('#register-bt')
const modal = document.querySelector('.modal')
const closeModalButton = document.querySelector('.modal-close-btn')
const allRegisterInputs = document.querySelectorAll('[data-register]')

openModalRegister.addEventListener('click', () => {
    modal.classList.toggle('openned')
    const messageErroInfo = document.querySelector('.message-info-modal')
    messageErroInfo.style.display = 'none'
    
    for(let i = 0; i < allRegisterInputs.length; i++){
        allRegisterInputs[i].classList.remove('erro')
    }

})

closeModalButton.addEventListener('click', () => {
    modal.classList.toggle('openned')
    for(let i = 0; i < allRegisterInputs.length; i++){
        allRegisterInputs[i].classList.remove('erro')
    }
})

