export function renderPosts(posts) {
    let feedPostArea = document.querySelector('#feed-area')
    console.log(posts)

    feedPostArea.innerHTML = ''

    for(let i = 0; i < posts.length; i++){
        feedPostArea.innerHTML += `
        <div class="feed-area">
        <div class="feed-area--header">
            <div class="feed-area--header__left-side">
                <div class="feed-area--pic">
                    <img src="./assets/images/avatar.jpg">
                </div>
                <div class="feed-area--infos">
                    <a href=""><span class="feed-area--infos__name">${posts[i].owner}</span></a>
                    <span class="feed-area--infos__date">${posts[i].date.toDate()}</span>
                </div>
            </div>
    
            <div class="feed-area--header__right-side">
                <i class="fas fa-ellipsis-v feed-area--more__button"></i>
            </div>
        </div>
    
        <div class="feed-area--post">
            <p>${posts[i].text}</p>
        </div>
    
        <div class="line"></div>
            <div class="feed-area--interactions">
                <div class="feed-area--stars__button">
                    <span><i class="far fa-star"></i></span>
                    <span>${posts[i].like}</span>
                </div>
                <div class="feed-area--comments__button">
                    <span><i class="far fa-comment-alt"></i></span>
                    <span>0</span>
                </div>
            </div>
        <div class="line"></div>
    
        <div class="feed-area--all-comments">

            <div class="feed-area--comment">
                <div class="feed-area--comment__pic">
                    <img src="./assets/images/avatar.jpg">
                </div>
                <div class="feed-area--comment__wrap">
                    <div class="feed-area--comment__user">
                        <a href=""><span>Eduardo Mota</span></a>
                    </div>
                    <div class="feed-area--comment__text">
                        <p>${posts[i].comments}</p>
                    </div>
                </div>
            </div>     
           
        </div>
    
        <div class="feed-area--new-comment">
            <div class="feed-area--new-comment__pic">
                <img src="./assets/images/avatar.jpg">
            </div>
            <div class="feed-area--new-coment__input">
                <input type="text" placeholder="Escreva um comentário">
            </div>
        </div>
        `
    }


}


