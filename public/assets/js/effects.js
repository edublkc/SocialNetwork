const searchInput = document.querySelector('#search-input');
const searchBox = document.querySelector('.search-box')
const searchButtonRemoveAllText = document.querySelector('#search-remove-bt')



export function searchInputFocus(){

    searchInput.addEventListener('focus',()=>{
        searchBox.classList.toggle('focus')
    })

    searchInput.addEventListener('focusout',()=>{
        searchBox.classList.toggle('focus')
    })

}

export function searchRemoveTextButton (){
    searchInput.addEventListener('input',()=>{
        if(searchInput.value == ''){
            searchButtonRemoveAllText.style.display = "none"
        }else{
            searchButtonRemoveAllText.style.display = "block"
        }
    })

    searchButtonRemoveAllText.addEventListener('click',()=>{
        searchInput.value = ""
        searchButtonRemoveAllText.style.display = "none"
    })
}
