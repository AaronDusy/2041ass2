/* returns an empty array of size max */
export const range = (max) => Array(max).fill(null);

/* returns a randomInteger */
export const randomInteger = (max = 1) => Math.floor(Math.random()*max);

/* returns a randomHexString */
const randomHex = () => randomInteger(256).toString(16);

/* returns a randomColor */
export const randomColor = () => '#'+range(3).map(randomHex).join('');

/**
 * You don't have to use this but it may or may not simplify element creation
 * 
 * @param {string}  tag     The HTML element desired
 * @param {string}     data    Any textContent, data associated with the element
 * @param {object}  options Any further HTML attributes specified
 */
export function createElement(tag, data, options = {}) {
    const el = document.createElement(tag);
    el.textContent = data;
   
    // Sets the attributes in the options object to the element
    return Object.entries(options).reduce(
        (element, [field, value]) => {
            element.setAttribute(field, value);
            return element;
        }, el);
}

function getmethod(id,url, token) {
    const headers = {
        'Accept': 'application/json'
        ,
        'Authorization': token

    }
    //console.log(token)
    //console.log(url)
    return fetch(url,{
        headers,
        method: "GET"
    })
}

function like(url,token,id) {
    const headers = {
        'Accept': 'application/json'
        ,
        'Authorization': token

    }
    fetch(url,{
        headers,
        method:"PUT"
    }).then(res =>  {
        if(res.status === 200){
            console.log("like")
        }

    })

}

function makecomment(token,id) {

    document.getElementById("comment-box").style.display = "block"
    var comment = document.getElementById("input-btn")
    comment.onclick = function () {
        document.getElementById("comment-box").style.display = "none"
        const headers = {
            'Accept': 'application/json'
            ,
            'Authorization': token

        }
        //var date = new Date()
        var url = "http://127.0.0.1:5000/post/comment?id="+id
        //console.log(document.getElementsByTagName("input")[9].value+ document.getElementById("mytextarea").value)
        fetch(url,{
            headers,
            method:"POST",
            body:JSON.stringify({
            "author": document.getElementsByTagName("input")[9].value,
            "published":Date.now(),
            "comment":document.getElementById("mytextarea").value,
            })
        }).then(res =>{
            console.log(res)
        })

    }

}

/**
 * Given a post, return a tile with the relevant data
 * @param   {object}        post 
 * @returns {HTMLElement}
 */
export function createPostTile(token,post) {
    const section = createElement('section', null, { class: 'post', id: 'posts' });

    section.appendChild(createElement('h2', post.meta.author, { class: 'post-title' }));
    section.appendChild(createElement('p', post.meta.description_text, { class: 'description' }));
    section.appendChild(createElement('img', null,
        { src: "data:image/png;base64,"+post.src, alt: post.meta.description_text, class: 'post-image' }));
    section.appendChild(createElement('p', timeConverter(post.meta.published), { class: 'post-time' }));

    /*if(post.likes == undefined) {
        section.appendChild(createElement('p', "Likes: 0" , {class: 'post-like'}));
    }
    else {*/

    const like_p = createElement('div',null,{class: 'post-like', id: post.id});
    const like_i1 = createElement('i', "Likes: "+post.meta.likes.length,{class: 'post-like-i1', id: post.id + 'i1'});
    //console.log(post.meta.likes[0])
    like_p.appendChild(like_i1)
    const droop = createElement('div',null,{class: "post-like-drop", id: "post-like-box"});
    let i;
    like_p.appendChild(droop)
    for(i = 0; i < post.meta.likes.length;i++){
        const id = post.meta.likes[i]
        console.log(id)
        const url = 'http://127.0.0.1:5000/user?id='+id
        getmethod(id,url,token)
            .then(res => res.json()
                .then(json => {
                    const a1 = createElement('a', json.name, {class: "likes"});
                    const br = createElement('br');

                    droop.appendChild(a1)
                    droop.appendChild(br)
                    }
                ))
    }

    like_i1.addEventListener('click',function () {
            //show likes

        })
    like_i1.onclick = function(){
        if(droop.style.display === "block"){
        droop.style.display = "none"
        }
        else {
        droop.style.display = "block"
        }
    }
    section.appendChild(like_p);
    const like_btn_div = createElement('div', null, {class: "like-btn-div"});
    const like_btn = createElement('input', null, {class: "like-btn", type: "button", id: "like-btn"});
    section.appendChild(like_btn_div)
    like_btn_div.appendChild(like_btn)
    like_btn.onclick = function () {
        const url = "http://127.0.0.1:5000/post/like?id=" + post.id;
        like(url,token,post.id)
    }

    const comment_p = createElement('div', null, {class: 'post-comment'});
    const comment_i1 = createElement('i', "Comment: "+post.comments.length, {class: 'post-comment-i', id: post.id + "ci"});
    //console.log(post.meta.likes[0])
    comment_p.appendChild(comment_i1)

    console.log(post.comments)
    const comment_box = createElement('div', null, {class: "comment-drop", id: "comment-box"});
    comment_p.appendChild(comment_box)
    let j;
    for(j = 0; j<post.comments.length;j++){
        const a2 = createElement('a', post.comments[j].comment, {class: "comments"});
        //var br = createElement('br')
        const p2 = createElement('p', post.comments[j].author + ' ' + timeConverter(post.comments[j].published), {class: "comment-detail"});
        comment_box.appendChild(a2)
        //comment_box.appendChild(br)
        a2.appendChild(p2)
    }

    comment_i1.addEventListener('click',function () {
        //show comment
        if(comment_box.style.display === "block"){
            comment_box.style.display = "none"
        }
        else {
            comment_box.style.display = "block"
        }
    })
    section.appendChild(comment_p);

    const comment_brn_div = createElement('div', null, {class: "comment-btn-div"});
    const comment_btn = createElement('input', "Make comment", {class: "comment-btn", type: "button",id:"cmb"});
    section.appendChild(comment_brn_div)
    comment_brn_div.appendChild(comment_btn)

    comment_btn.onclick = function () {
        //alert("comment")
        makecomment(token,post.id)
    }
    return section;
}

// Given an input element of type=file, grab the data uploaded for use
export function uploadImage(event) {
    const [ file ] = event.target.files;

    const validFileTypes = [ 'image/jpeg', 'image/png', 'image/jpg' ]
    const valid = validFileTypes.find(type => type === file.type);

    // bad data, let's walk away
    if (!valid)
        return false;
    
    // if we get here we have a valid image
    const reader = new FileReader();
    
    reader.onload = (e) => {
        // do something with the data result
        const dataURL = e.target.result;
        const image = createElement('img', null, { src: dataURL });
        document.body.appendChild(image);
    };

    // this returns a base64 image
    reader.readAsDataURL(file);
}

/* 
    Reminder about localStorage
    window.localStorage.setItem('AUTH_KEY', someKey);
    window.localStorage.getItem('AUTH_KEY');
    localStorage.clear()
*/
export function checkStore(key) {
    if (window.localStorage)
        return window.localStorage.getItem(key)
    else
        return null

}

//Reference: https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
function timeConverter(t) {
    var a = new Date(t * 1000);
    var today = new Date();
    var yesterday = new Date(Date.now() - 86400000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    if (a.setHours(0,0,0,0) == today.setHours(0,0,0,0))
        return 'today, ' + hour + ':' + min;
    else if (a.setHours(0,0,0,0) == yesterday.setHours(0,0,0,0))
        return 'yesterday, ' + hour + ':' + min;
    else if (year == today.getFullYear())
        return date + ' ' + month + ', ' + hour + ':' + min;
    else
        return date + ' ' + month + ' ' + year + ', ' + hour + ':' + min;
}
