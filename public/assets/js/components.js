//Search box header click effect
export function header(){
    const searchInput = document.querySelector('#search-input');
    const searchBox = document.querySelector('.search-box')
    const searchButtonRemoveAllText = document.querySelector('#search-remove-bt')
    
    
    searchInput.addEventListener('focus', () => {
        searchBox.classList.toggle('focus')
    })
    
    searchInput.addEventListener('focusout', () => {
        searchBox.classList.toggle('focus')
    })
    
    
    searchInput.addEventListener('input', () => {
        if (searchInput.value == '') {
            searchButtonRemoveAllText.style.display = "none"
        } else {
            searchButtonRemoveAllText.style.display = "block"
        }
    })
    
    searchButtonRemoveAllText.addEventListener('click', () => {
        searchInput.value = ""
        searchButtonRemoveAllText.style.display = "none"
    })
}

//New post click effect
export function newPost(){
    const newPostInput = document.querySelector('.new-post-input')
    const newPostPlaceholder = document.querySelector('.new-post-placeholder')
    
    newPostPlaceholder.addEventListener('click', () => {
        newPostPlaceholder.style.display = "none";
        newPostInput.style.display = "block";
        newPostInput.focus()
    })
    
    newPostInput.addEventListener('focusout', () => {
        let newPostValue = newPostInput.textContent.trim()
    
        if (newPostValue === '') {
            newPostPlaceholder.style.display = "block";
            newPostInput.style.display = "none";
        }
    
    })
    
}

export function closeModal(){
    const modal = document.querySelector('.modal')
    const closeModalButton = document.querySelector('.modal-close-btn')
    const body = document.querySelector('body')

    closeModalButton.addEventListener('click', close)
    

    function close(){
        if(modal.classList.contains('openned')){
            modal.classList.remove('openned')
            body.style.overflow = "auto"
        }

        if(modal.classList.contains('openned-big')){
            modal.classList.remove('openned-big')
            body.style.overflow = "auto"
        }
    }
}