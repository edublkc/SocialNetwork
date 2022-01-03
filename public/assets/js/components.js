//Search box header click effect
export function header(){
    const header = document.querySelector('header')

    header.innerHTML = `
    <div class="menu-left-side">
            <div class="logo">
                <h1><a href="index.html">Blkc Network</a></h1>
            </div>
            <div class="menu-wrapper">
                <div class="search-box">
                    <input id="search-input" type="text" placeholder="Pesquisar">
                    <i id="search-remove-bt" class="fas fa-times"></i>
                    <div class="search-icon">
                        <a id="search-button" href=""><i class="fas fa-search"></i></a>
                    </div>
                </div>
                <i class="fas fa-bars menu-mobile"></i>
            </div>
        </div>

        <div class="menu-right-side">
            <div class="menu-profile">
                <img id="profile-pic-header" src="./assets/images/avatar.png" data-src="pic">
                <div class="menu-profile--more">
                    <span id="menu-profile--name"></span>
                    <i class="fas fa-caret-down"></i>
                </div>

                <div class="menu-profile--dropdown">
                    <ul>
                        <li><a href="">Meu Perfil</a></li>
                        <li><a id="logout-button" href="">Sair</a></li>
                    </ul>
                </div>
            </div>

        </div>
    `
    headerEffects()
}

function headerEffects(){
    const searchInput = document.querySelector('#search-input');
    const searchBox = document.querySelector('.search-box')
    const searchButtonRemoveAllText = document.querySelector('#search-remove-bt')
    const searchButton = document.querySelector('#search-button')
    
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

    
        searchButton.addEventListener('click',search)
    
}

function search(event){
    const searchInput = document.querySelector('#search-input').value.trim()
    
    if(searchInput){
        const searchInput = document.querySelector('#search-input').value.trim()
        const searchButton = document.querySelector('#search-button')
        
        searchButton.href = `/public/search.html?search=${searchInput}`
    }else{
        event.preventDefault()
    }
    
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