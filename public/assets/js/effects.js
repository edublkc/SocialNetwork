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


//dropdown profile menu
/*const dropDownOptions = document.querySelector('.menu-profile--dropdown')
const profileMoreInformationsButton = document.querySelector('.menu-profile--more')

profileMoreInformationsButton.addEventListener('click',(event)=>{
    let positionY = profileMoreInformationsButton.getBoundingClientRect().y
    let positionX = profileMoreInformationsButton.getBoundingClientRect().x

    console.log(profileMoreInformationsButton.getBoundingClientRect().x)

    dropDownOptions.style.top = `${positionY + 20}px`
    dropDownOptions.style.left = `${positionX + 20}px`

    dropDownOptions.classList.toggle('dropdown');
})*/


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