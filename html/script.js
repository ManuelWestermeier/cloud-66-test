const randomChars = "qwertzuioplkjhgfdsayxcvbnm1234567890";
var content = document.getElementById("content");
var you = document.getElementById("you");
var Uploaddiv = document.getElementById("Upload");
var userData = []

var params = new URL(document.location).searchParams.get("user")
if (params != null) {
    if (params == "random") {
        getRandomUser()
    } else {
        openUser(params);
    }
}
else {
    openUser(getItem("user"))
}

function toggleClass(elem) {
    if (document.getSelection() == "") {
        elem.classList.toggle("postscroll");
    }
}

resize()
window.addEventListener("resize", resize)
function resize() {
    if (window.innerWidth > 600) {
        you.classList.remove("none")
        content.classList.remove("none")
    }
}

async function getRandomUser() {
    var url = new URL(document.location.origin)
    url.pathname = "/userList";
    var resp = await fetch(url)
    var res = await resp.json()
    openUser(res[Math.floor(Math.random() * res.length)])
}

if (getItem("user") == null) {
    toLogin();
    you.classList.remove('none');
    content.classList.add('none')
}
else {
    start()
}

async function start() {
    var url = new URL(document.location.origin + "/getPrivateUserData")
    url.searchParams.set("user", getItem("user"))
    url.searchParams.set("password", getItem("password"))
    var resp = await fetch(url)
    var res = await resp.json()
    userData = res;
    if (res.error) {
        toLogin()
    }
    you.innerHTML = `
<div>
    <h1>${res.userName || getItem("user")}</h1>
    <button onclick="editProfile()">Edit Profile</button>
    <p>${res.follower} Follower</p>
    <hr>
    <p>${res.abbos.length} Abbos</p>
    <div id="yourContentDivElem" class="abbo-div"></div>
</div>`
    const yourContentDivElem = document.getElementById("yourContentDivElem");
    for (let index = 0; index < res.abbos.length; index++) {
        try {
            var NameUrl = new URL(document.location.origin + "/getName");
            NameUrl.searchParams.set("user", res.abbos[index]);
            var NameResultCt = await fetch(NameUrl);
            var NameResult = await NameResultCt.json()
            NameResult = NameResult
        } catch { }
        yourContentDivElem.innerHTML += `<p class="abbo" onclick="openUser('${res.abbos[index]}')">${NameResult || res.abbos[index]} <button class="delete-abbo-button" onclick="DAbboniere('${res.abbos[index]}')"><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></button></p>`
    }
}

async function openUser(user) {
    if (user == undefined) {
        openUser(getItem("user"))
    }
    var url = new URL(document.location.origin + "/getPublicUserData")
    url.searchParams.set("user", user)
    var resp = await fetch(url)
    var res = await resp.json()
    if (res.follower == undefined) {
        openUser(getItem("user"))
    }
    resize()
    if (!res?.error) {
        content.innerHTML =
            `<div class="content-black"><button style="position: fixed; top: 30px;left: 0px;width: 30px;height: 30px;" onclick="Share('${user}')"><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M720-80q-50 0-85-35t-35-85q0-7 1-14.5t3-13.5L322-392q-17 15-38 23.5t-44 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q23 0 44 8.5t38 23.5l282-164q-2-6-3-13.5t-1-14.5q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-23 0-44-8.5T638-672L356-508q2 6 3 13.5t1 14.5q0 7-1 14.5t-3 13.5l282 164q17-15 38-23.5t44-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-640q17 0 28.5-11.5T760-760q0-17-11.5-28.5T720-800q-17 0-28.5 11.5T680-760q0 17 11.5 28.5T720-720ZM240-440q17 0 28.5-11.5T280-480q0-17-11.5-28.5T240-520q-17 0-28.5 11.5T200-480q0 17 11.5 28.5T240-440Zm480 280q17 0 28.5-11.5T760-200q0-17-11.5-28.5T720-240q-17 0-28.5 11.5T680-200q0 17 11.5 28.5T720-160Zm0-600ZM240-480Zm480 280Z" /></svg></button>
    </button><button style="position: fixed; top: 0px;left: 0px;width: 30px;height: 30px;" onclick="getRandomUser()"><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M560-160v-80h104L537-367l57-57 126 126v-102h80v240H560Zm-344 0-56-56 504-504H560v-80h240v240h-80v-104L216-160Zm151-377L160-744l56-56 207 207-56 56Z" /></svg></button>
    </button><button style="position: fixed; top: 60px;left: 0px;width: 30px;height: 30px;" onclick="Search()"><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg></button>
    <center>
        <h1 id="otherUserHeader"></h1>
        <img id="UserLogo">
        <p>${res.follower} Follower</p>
        <hr>
        <p id="description"></p><hr>
    </center>
    </div>
    <div style="display: flex;">
    <button id="abbo-button" onclick="Abboniere('${user}')">Abbonieren</button>
    <button style="width: 30px;height: 30px;" onclick="DAbboniere('${user}')"><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></button>
    </div><div id="otherPosts"></div>`

        document.getElementById("otherUserHeader").innerText = res.userName || user;
        document.getElementById("UserLogo").src = res?.icon;
        document.querySelector(".content-black").style.backgroundImage = "url('" + res?.backgroundIcon + "')";

        setTimeout(() => {
            const abboButton = document.getElementById("abbo-button")
            if (userData.abbos.includes(user)) {
                abboButton.innerHTML = "Abboniert"
                abboButton.classList.add("abbo-focus")
            }
        }, 0)

        document.getElementById("description").innerText = res.description
        for (let index = 0; index < res.posts.length; index++) {
            document.getElementById("otherPosts").innerHTML += `
<div class="post">
    <h1 id="postHeader${index}"></h1>
    <p id="postDate${index}" class="your-post-date"></p>
    <p id="postContent${index}"></p>
    <br>
    <div class="like-menue">
        <div style="display: flex;align-items: center;margin-left: 5px;">
            <p>${res.posts[index].likes.length - res.posts[index].dislikes.length} Likes</p>
            <button id="disLikeButton${index}" onclick="DisLike('${res.posts[index]?.id}', '${user}')" style="margin-left:auto;" class="LikeButton"><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M240-840h440v520L400-40l-50-50q-7-7-11.5-19t-4.5-23v-14l44-174H120q-32 0-56-24t-24-56v-80q0-7 2-15t4-15l120-282q9-20 30-34t44-14Zm360 80H240L120-480v80h360l-54 220 174-174v-406Zm0 406v-406 406Zm80 34v-80h120v-360H680v-80h200v520H680Z"/></svg></button>
            <button id="likeButton${index}" onclick="Like('${res.posts[index]?.id}', '${user}')" class="LikeButton"><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z"/></svg></button>
        </div>
        <form onsubmit="Komment(event,${index},'${res.posts[index]?.id}','${user}')" class="KommentForm">
            <input id="KommentInput${index}" placeholder="New Komment..." class="small-komment-input">
            <button class="SendButton"><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z"/></svg></button>
        </form>
    </div>
    <div class="Komments" id="Komments${index}">
        <p>${res.posts[index].komments.length} Komments...</p>
    </div>
</div>`
            document.getElementById("postDate" + index).innerText = res.posts[index].date
            document.getElementById("postHeader" + index).innerText = res.posts[index].header
            document.getElementById("postContent" + index).innerText = res.posts[index].content
            if (res.posts[index].likes.includes(getItem("user"))) {
                document.getElementById("likeButton" + index).classList.add("selected");
            }
            if (res.posts[index].dislikes.includes(getItem("user"))) {
                document.getElementById("disLikeButton" + index).classList.add("selected");
            }
            for (let i = 0; i < res.posts[index].komments.length; i++) {
                document.getElementById("Komments" + index).innerHTML += `
<div id="Komment${index}${i}" class="Komment">
    <p id="K${index}${i}"></p>
    <p><b><i id="U${index}${i}"></i></b></p>
</div>`
                document.getElementById(`K${index}${i}`).innerText = res.posts[index].komments[i].komment
                document.getElementById(`U${index}${i}`).innerText = res.posts[index].komments[i].user
                document.getElementById(`U${index}${i}`).setAttribute("onclick", "openUser('" + res.posts[index].komments[i].user + "')")
                if (res.posts[index].komments[i].user == user) {
                    document.getElementById(`Komment${index}${i}`).setAttribute("style", "background-color:dodgerblue;color:black;")
                }
                if (res.posts[index].komments[i].user == getItem("user")) {
                    document.getElementById(`Komment${index}${i}`).setAttribute("style", "background-color:yellowgreen;color:black;")
                }
            }
        }
    }
}

function check(condidion, trueReturn, falseReturn) {
    if (condidion) {
        return trueReturn
    } else {
        return falseReturn
    }
}

async function DisLike(id, user) {
    var newPost = `user=${getItem("user")}&password=${getItem("password")}&function=DisLike&id=${id}&kommentant=${user}`
    await fetch(document.location.origin, {
        method: "POST",
        body: newPost
    })
    openUser(user)
}

async function Like(id, user) {
    var newPost = `user=${getItem("user")}&password=${getItem("password")}&function=Like&id=${id}&kommentant=${user}`
    await fetch(document.location.origin, {
        method: "POST",
        body: newPost
    })
    openUser(user)
}

async function Komment(e, index, id, user) {
    e.preventDefault()
    const comment = document.getElementById("KommentInput" + index).value
    var newPost = `user=${getItem("user")}&password=${getItem("password")}&function=Komment&id=${id}&comment=${comment}&kommentant=${user}`
    await fetch(document.location.origin, {
        method: "POST",
        body: newPost
    })
    openUser(user)
}

async function editProfile() {
    var url = new URL(document.location.origin + "/getPrivateUserData")
    url.searchParams.set("user", getItem("user"))
    url.searchParams.set("password", getItem("password"))
    var resp = await fetch(url)
    var res = await resp.json()
    if (res.error) {
        toLogin()
    }
    console.log(res)
    var s = `
<div>
    <div style="display: flex;"><h1 contenteditable="" id="newNameInput">${res.userName || getItem("user")}</h1>
    <button onclick="uploadName()" class="update-name-button"><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg></button></div>
    <hr>
    <button onclick="start()">Close Profile</button>
    <hr>
    <input value="${res?.icon}" placeholder="Icon URL..." id="ChangeIconInput"><button onclick="ChangeIcon(ChangeIconInput.value)">ChangeIcon</button>
    <hr>
    <input value="${res?.backgroundIcon}" placeholder="BackgroundIcon URL..." id="ChangeBackgroundIconInput"><button onclick="ChangeBackgroundIcon(ChangeBackgroundIconInput.value)">Change Background Icon</button>
    <hr>
    <p>${res.follower} Follower</p>
    <hr>
    <p>Your Description</p>
    <p contenteditable="" id="changeDescriptionDiv" style="border-bottom: 1px solid;padding: 10px;">${res.description}</p>
    <button class="uploadDescriptionButton" onclick="changeDescription()"><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg>Upload Description</button>
    <hr>
    <p>${res.posts.length} Your Posts</p>
    <button onclick="Upload()"><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>Upload</button>
    <div class="your-post-div">`
    for (let index = 0; index < res.posts.length; index++) {
        s += `
<div class="your-post">
    <h2>${res.posts[index].header}</h2>
    <hr>
    <p>${res.posts[index].content}</p>
    <hr>
    <p class="your-post-date">${res.posts[index].date}</p>
    <hr>
    <button onclick="Delete(${index})"><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>Delete</button>
</div>
`
    }
    s += `</div>`
    you.innerHTML = s + "</div>"
}

async function uploadName() {
    var cont = document.getElementById("newNameInput").innerText;
    var newPost = `user=${getItem("user")}&password=${getItem("password")}&function=changeName&newName=${cont}`
    await fetch(document.location.origin, {
        method: "POST",
        body: newPost
    })
    openUser(getItem("user"))
}

async function changeDescription() {
    var newPost = `user=${getItem("user")}&password=${getItem("password")}&function=changeDescription&description=${document.getElementById("changeDescriptionDiv").textContent}`
    await fetch(document.location.origin, {
        method: "POST",
        body: newPost
    })
    openUser(getItem("user"))
}

async function Search() {
    var s = prompt("Search User...");
    openUser(s);
    /*
    var url = new URL(document.location.origin);
    url.searchParams.set("user", s);
    window.location = url;
    */
}

async function Share(user) {
    var url = new URL(document.location.origin)
    url.searchParams.set("user", user)
    const shareData = {
        title: "Hacker Post",
        text: "visit" + user,
        url: url,
    }
    var x = prompt("Send With Whatsapp?  y|n")
    if (x == "y") {
        var wa = new URL("https://api.whatsapp.com/send")
        wa.searchParams.set("text", url)
        window.open(wa)
    }
    else {
        try {
            await navigator.share(shareData)
        } catch (error) {
            console.log(error)
        }
    }
}

async function Abboniere(user) {
    var newPost = `user=${getItem("user")}&password=${getItem("password")}&function=abbo&abbonent=${user}`
    await fetch(document.location.origin, {
        method: "POST",
        body: newPost
    })
    start()
    openUser(user)
}

async function ChangeIcon(url) {
    var newPost = `user=${getItem("user")}&password=${getItem("password")}&function=changeIcon&iconUrl=${url}`
    await fetch(document.location.origin, {
        method: "POST",
        body: newPost
    })
    editProfile()
    openUser(getItem("user"));
}

async function ChangeBackgroundIcon(url) {
    var newPost = `user=${getItem("user")}&password=${getItem("password")}&function=changeBackgroundIcon&iconUrl=${url}`
    await fetch(document.location.origin, {
        method: "POST",
        body: newPost
    })
    editProfile()
    openUser(getItem("user"));
}

async function DAbboniere(user) {
    var newPost = `user=${getItem("user")}&password=${getItem("password")}&function=dabbo&abbonent=${user}`
    await fetch(document.location.origin, {
        method: "POST",
        body: newPost
    })
    console.log(user)
    start()
}

function Upload() {
    Uploaddiv.classList.remove("none")
}

async function Delete(index) {
    var x = prompt("Do You Want To Delete || write y")
    if (x == "y") {
        var newPost = `user=${getItem("user")}&password=${getItem("password")}&function=delete&index=${index}`
        await fetch(document.location.origin, {
            method: "POST",
            body: newPost
        })
        console.log("DELETE " + index)
        editProfile();
        openUser(getItem("user"))
    }
}

async function Post() {
    var newPost = `user=${getItem("user")}&password=${getItem("password")}&function=post&content=${JSON.stringify({
        header: document.getElementById("newPostHeader").textContent,
        content: document.getElementById("newPostContent").textContent
    })}`
    await fetch(document.location.origin, {
        method: "POST",
        body: newPost
    })
    Uploaddiv.classList.add("none")
    editProfile()
    openUser(getItem("user"))
}

function toLogin() {
    you.innerHTML = `
        <center>
    <h1>Login</h1>
    <form id="form">
        <input id="user" placeholder="Username...">
        <input id="password" placeholder="Password...">
        <p style="color: red;" id="error"></p>
        <button>Login</button>
        <br>
        <hr>
        <button class="focus" onclick="toLogin()">to Login</button>
        <button onclick="toSignUp()">to Sign Up</button>
    </form>
</center>
`
    document.getElementById("form").addEventListener("submit", async (e) => {
        e.preventDefault()
        var u = document.getElementById("user").value
        var p = await sha256(document.getElementById("password").value)
        console.log(p)
        try {
            var resp = await fetch(document.location.origin, {
                method: 'POST',
                body: `user=${u}&password=${p}`
            })
            var res = await resp.json()
            console.log(res)
            if (res?.wrongPassword == true) {
                document.getElementById("error").innerHTML = `Wrong Password`;
            }
            if (res?.wrongPassword == false) {
                setItem("user", u);
                setItem("password", p);
                document.getElementById("form").innerHTML = "Right Password... Please WAIT"
                window.location = ""
            }
        } catch (error) {
            console.log(error)
        }
    })
}
function toSignUp() {
    you.innerHTML =
        `
<center>
    <h1>Sign Up</h1>
    <form id="form">
        <input id="user" placeholder="New Username...">
        <p style="color: red;" id="error"></p>
        <input id="password" placeholder="New Password...">
        <button>Sign Up</button>
        <br>
        <hr>
        <button onclick="toLogin()">to Login</button>
        <button class="focus" onclick="toSignUp()">to Sign Up</button>
    </form>
</center>
`
    document.getElementById("form").addEventListener("submit", async (e) => {
        e.preventDefault()
        var u = document.getElementById("user").value
        var p = sha256(document.getElementById("password").value)
        try {
            var resp = await fetch(document.location.origin, {
                method: 'POST',
                body: `newUser=${u}&newPassword=${p}`
            })
            var res = await resp.json()
            console.log(res)
            if (res.UserForgiven == true) {
                document.getElementById("error").innerHTML = `Username Vergeben`
            }
            if (res.UserCreated == true) {
                document.getElementById("form").innerHTML = "User Created... Please WAIT.."
                setItem("user", u)
                setItem("password", p)
                window.location = ""
            }
        } catch (error) {
            console.log(error)
        }
    })
}

function setItem(path, str) {
    localStorage.setItem(path, str)
}

function getItem(path) {
    var str = localStorage.getItem(path)
    return str;
}

async function sha256(message) {
    const msgBuffer = new TextEncoder('utf-8').encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
    console.log(hashHex);
    return hashHex;
}