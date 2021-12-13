//Search box header click effect
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

//New post click effect
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
