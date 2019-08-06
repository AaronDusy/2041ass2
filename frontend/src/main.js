// importing named exports we use brackets
import { createPostTile, uploadImage } from './helpers.js';

// when importing 'default' exports, use below syntax
import API from './api.js';

const api  = new API();

// we can use this single api request multiple times
//const feed = api.getFeed();



// Potential example to upload an image
//const input = document.querySelector('input[type="file"]');

//input.addEventListener('change', uploadImage);
const btn_login = document.getElementById('login');
const btn_registe = document.getElementById('register');
btn_login.addEventListener('click',function () {
    if(btn_login.innerText === "Log out"){
        //removeElement("posts")
        location.reload();
        btn_login.innerText = "Login"
    }
    else {
        document.getElementsByClassName('Login')[0].className = 'Login active';
    }
})

const submit = document.getElementsByTagName("input")[2];
const headers = {
    'Accept': 'application/json'
    ,
    'Content-Type': 'application/json'
};


submit.addEventListener('click',function () {
    document.getElementsByClassName('Login')[0].className = 'Login';
    let username = document.getElementsByTagName("input")[0].value;
    let password = document.getElementsByTagName("input")[1].value;
    fetch("http://127.0.0.1:5000/auth/login",{
        headers,
        method: "POST",
        body: JSON.stringify(
        {
            "username": username,
            "password": password
        })
    }).then(function (res) {
        console.log(res)
        checker(res)
    })

    //show();
})

function checker(res) {
    console.log(res.status)
    if(res.status === 200){
        res.json()
            .then(json => json.token)
            .then(token => show(token))
    }
    if(res.status === 403){
        alert("Invalid Username/Password")
    }
}


btn_registe.addEventListener('click',function () {
    document.getElementsByClassName('Register')[0].className = 'Register active';
})

const submit_rg = document.getElementsByTagName("input")[8];

//sign up
submit_rg.addEventListener('click', function () {
    document.getElementsByClassName('Register')[0].className = 'Register';
    let username = document.getElementsByTagName("input")[3].value;
    let password = document.getElementsByTagName("input")[4].value;
    let password_com = document.getElementsByTagName("input")[5].value;
    let email = document.getElementsByTagName("input")[6].value;
    let name = document.getElementsByTagName("input")[7].value;
    if(password != password_com){
        alert("please enter again");
    }
    fetch("http://127.0.0.1:5000/auth/signup",{
        headers,
        method: "POST",
        body: JSON.stringify(
            {
                "username": username,
                "password": password,
                "email": email,
                "name": name
            })
    }).then(function (res) {
        signup(res);
    })
})


//signup check
function signup(res) {
    if(res.status === 200){
        alert("Success")
    }
    if(res.status === 400){
        alert("Malformed Request")
    }
    if(res.status === 409){
        alert("Username have already taken")
    }
}



function getmethod(auther_token, url) {
    const headers = {
        'Accept': 'application/json'
        ,
        'Authorization': auther_token,

    }
    console.log(auther_token)
    console.log(url)
    return fetch(url,{
        headers,
        method: "GET"
    })
}


function feedpost(auther_token,posts) {

        console.log(posts.length)
        posts.sort(function (a,b) {
            var timea = a.meta.published
            var timeb = b.meta.published
            return timea - timeb
        }).reverse()
        posts.reduce((parent, post) => {
            parent.appendChild(createPostTile(auther_token,post));
            return parent;
        },document.getElementById('large-feed'))
        document.getElementById('large-feed').style.background = "#6dc3cc"

}

//show main page
function show(token) {
    const auther_token = 'Token' + ' ' + token;
    console.log(auther_token)
    btn_login.innerText = "Log out"
    let url = 'http://127.0.0.1:5000/user/feed'
    getmethod(auther_token,url)
        .then(res  => {
            console.log(res)
            res.json()
                .then(json => json.posts)
                .then(posts => {
                    console.log(posts)
                    feedpost(auther_token,posts)

                })
        })

    document.getElementById("reminder").style.display = "none"
    const profile = document.getElementById('Profile')
    profile.onclick = function () {
        if(btn_login.innerText === "Log out" && profile.innerText === "My profile"){
            showprofile(auther_token)
        }
        else if(profile.innerText === "Back to main page"){
            profile.innerText = "My profile"
            document.getElementById('large-feed').style.display = "block"
            document.getElementById('my-profile').style.display = "none"
            var modify_btn = document.getElementById("modify-btn")
            var myprofile = document.getElementById('my-profile')
            myprofile.children[1].style.display = "block"
            myprofile.children[2].style.display = "block"
            myprofile.children[3].style.display = "block"
            modify_btn.style.display = "block"
            document.getElementById("buttonList").style.display = "none"
        }
        else{
            alert("Please log in first!")
        }
    }
}

//get user profile from api
function showprofile(token) {
    console.log(token)
    const headers = {
        'Accept': 'application/json'
        ,
        'Authorization': token,

    }
    fetch('http://127.0.0.1:5000/user/',{
        headers,
        method:"GET"
    })
        .then(res => res.json())
        .then(json => {
            profile(json)
        })
}



//show the profile of the user
function profile(json) {
    document.getElementById('large-feed').style.display = "none"
    document.getElementById("Profile").innerText = "Back to main page"
    var profile = document.getElementById('my-profile')
    profile.style.display = "block"
    console.log(json.username)
    console.log(json.email)
    profile.children[1].innerHTML = "Username: "+json.username
    profile.children[2].innerHTML = "Email address: " + json.email
    profile.children[3].innerHTML = "Fans: " +json.following.length

    const modify_btn = document.getElementById("modify-btn")
    modify_btn.addEventListener('click',function () {
        document.getElementById('buttonList').style.display = "block"
        profile.children[1].style.display = "none"
        profile.children[2].style.display = "none"
        profile.children[3].style.display = "none"
        modify_btn.style.display = "none"
    })
}
