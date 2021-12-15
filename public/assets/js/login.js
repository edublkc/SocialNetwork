const openModalRegister = document.querySelector('#register-bt')
const modal = document.querySelector('.modal')
const closeModalButton = document.querySelector('.modal-close-btn')

openModalRegister.addEventListener('click', () => {
    modal.classList.toggle('openned')


    const emailElement = document.querySelector('#register-email')
    const passwordElement = document.querySelector('#register-password')
    const messageErroInfo = document.querySelector('.message-info-modal')

    emailElement.value = ''
    passwordElement.value = ''
    messageErroInfo.style.display = 'none'
    emailElement.style.border = "1px solid #bbb"
    passwordElement.style.border = "1px solid #bbb"

})

closeModalButton.addEventListener('click', () => {
    modal.classList.toggle('openned')
})

