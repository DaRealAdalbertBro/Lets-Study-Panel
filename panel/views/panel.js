const brandTitle = document.getElementById('title');
const brandLogo = document.getElementById('logo');
const brandLine = document.getElementById('brandLine');

brandTitle.addEventListener('mouseover', e => {
    brandLine.style.opacity = 0.9;
})

brandTitle.addEventListener('mouseout', e => {
    brandLine.style.opacity = 0.5;
})


brandLogo.addEventListener('mouseover', e => {
    brandLine.style.opacity = 0.9;
})

brandLogo.addEventListener('mouseout', e => {
    brandLine.style.opacity = 0.5;
})

////////////////////////////////////////////////////////////////////////////////////

function changeQueryString(searchString, documentTitle){      
    documentTitle = typeof documentTitle !== 'undefined' ? documentTitle : document.title;      
    var urlSplit=( window.location.href ).split( "?" );      
    var obj = { Title: documentTitle, Url: urlSplit[0] + searchString };      
    history.pushState(obj, obj.Title, obj.Url);
}

const Http = new XMLHttpRequest();
getLocation()
function getLocation() {
    var bdcApi = "https://api.bigdatacloud.net/data/reverse-geocode-client"

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                bdcApi = bdcApi + "?latitude=" + position.coords.latitude + "&longitude=" + position.coords.longitude + "&localityLanguage=en";
                getApi(bdcApi);
    
            },
            (err) => { getApi(bdcApi); },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            });
    } else {
        var loc = "nodata"
        var win = window.location.search.split('&');
        var query;

        var encryption = new Encryption();
        loc = encryption.encrypt(loc, "ENCRYPTION KEY WORDS");

        if(win.length == 2 && win[1].includes("page")) {
            query = win[0] + "&" + win[1] + "&loc=" + loc;
            changeQueryString(query)
        } else if (win.length == 3) {}
        else{
            query = win[0] + "&loc=" + loc;
            changeQueryString(query)
        }
    }
}


function getApi(bdcApi) {
    Http.open("GET", bdcApi);
    Http.send();
    Http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var loc = JSON.parse(this.responseText).locality;
            var win = window.location.search.split('&');
            var query;
            var encryption = new Encryption();
            loc = encryption.encrypt(loc, "ENCRYPTION KEY WORDS");
            if(win.length == 2 && win[1].includes("page")) {
                query = win[0] + "&" + win[1] + "&loc=" + loc;
                changeQueryString(query)
            } else if (win.length == 3) {}
            else{
                query = win[0] + "&loc=" + loc;
                changeQueryString(query)
            }
        }
    };
}


////////////////////////////////////////////////////////////

var lastTab = undefined;
const serverTab = document.getElementById('server');
const administrationTab = document.getElementById('administration');
const accountsTab = document.getElementById('accounts');
const postsTab = document.getElementById('manageposts');

const serverInsightsPanel = document.getElementById('serverData');
const administrationPanel = document.getElementById('administrationPanel');
const accountsPanel = document.getElementById('accountsPanel');
const postsPanel = document.getElementById('postsPanel');

var memberChart = undefined;
var activityChart = undefined;
var moderationChart = undefined;

var updateObject = new Object;
var deleteArray = new Array;

var finished = false;

if(serverTab !== null) {
    serverTab.addEventListener('click', e => {
        window.location.href = `panel?data=insights`;
    })
}

if(postsTab !== null) {
    postsTab.addEventListener('click', e => {
        window.location.href = `panel?data=manageposts`;
    })
}

if(administrationTab !== null) {
    administrationTab.addEventListener('click', e => {
        window.location.href = `panel?data=administration&page=1`;
    })
}

if(accountsTab !== null) {
    accountsTab.addEventListener('click', e => {
        window.location.href = `panel?data=accounts`;
    })
}

var selector = undefined;
var currentTab = undefined;

let url = window.location.search.split('&');

if(url[0] == "?data=insights") {
    lastTab = currentTab;
    currentTab = 'server';
} else if(url[0] == "?data=administration&page" || url[0] == "?data=administration") {
    lastTab = currentTab;
    currentTab = 'administration';
} else if(url[0] == "?data=manageposts" || url[0] == "?data=posts") {
    lastTab = currentTab;
    currentTab = 'manageposts';
} else if(url[0] == "?data=accounts" || url[0] == "?data=manageaccounts") {
    lastTab = currentTab;
    currentTab = 'accounts';
} else {
    lastTab = currentTab;
    currentTab = 'server';
}

var e = document.getElementById(currentTab);
e.style.backgroundColor = '#3655b3';

function pagingNext() {
    var url = window.location.search.split('&');
    var page = parseInt(url[1].split('=')[1])+1;

    if(page < 1000) {
        try {
            var ch = window.location.search.split('&')[0] + "&" + window.location.search.split('&')[1].split('=')[0] + "=" + page;
            changeQueryString(ch)
            
            $.ajax({
                type: "GET",
                url: "./views/panel/data/log",
                data: {page: page},
                success: function(data) {
                    if(data.split("")[0] == 0 || data.split("")[0] == "0") {
                        var ch = window.location.search.split('&')[0] + "&" + window.location.search.split('&')[1].split('=')[0] + "=" + 1;
                        changeQueryString(ch)
                        var obj = JSON.parse(data.slice(1));
                        var table = document.querySelector('#tbodyAdminisration');
                        var tableTitle = document.querySelector("#tableTitle");
                        var tableArrows = document.querySelector("#tableArrows");
                        table.innerHTML = "";
                        table.appendChild(tableTitle);
                        obj.forEach(i => {
                            var tr = document.createElement('tr');
                            tr.innerHTML = `<td>${i.action}</td><td>${i.date.slice(2)}⠀${i.time}</td><td>${i.author}</td><td>${i.ip}</td><td>${i.location}</td><td>${i.id}</td>`;
                            table.appendChild(tr);
                        });
                        table.appendChild(tableArrows);
                    } else {
                        var obj = JSON.parse(data);
                        var table = document.querySelector('#tbodyAdminisration');
                        var tableTitle = document.querySelector("#tableTitle");
                        var tableArrows = document.querySelector("#tableArrows");
                        table.innerHTML = "";
                        table.appendChild(tableTitle);
                        obj.forEach(i => {
                            var tr = document.createElement('tr');
                            tr.innerHTML = `<td>${i.action}</td><td>${i.date.slice(2)}⠀${i.time}</td><td>${i.author}</td><td>${i.ip}</td><td>${i.location}</td><td>${i.id}</td>`;
                            table.appendChild(tr);
                        });
                        table.appendChild(tableArrows);
                    }
                },
                error: function(xhr, status, error) {
                    console.error(xhr);
                }
            });
        } catch(e) {console.log(e)}
    }
}

function pagingPrev() {
    var url = window.location.search.split('&');
    var page = parseInt(url[1].split('=')[1])-1;
    if(page > -1) {
        try {
            var ch = window.location.search.split('&')[0] + "&" + window.location.search.split('&')[1].split('=')[0] + "=" + page;
            changeQueryString(ch)
            $.ajax({
                type: "GET",
                url: "./views/panel/data/log",
                data: {page: page},
                success: function(data) {
                    console.log(data)
                    if(data.includes('&')) {
                        var chs = window.location.search.split('&')[0] + "&" + window.location.search.split('&')[1].split('=')[0] + "=" + data.split('&')[0];
                        changeQueryString(chs);
                        var obj = JSON.parse(data.split('&')[1]);
                        var table = document.querySelector('#tbodyAdminisration');
                        var tableTitle = document.querySelector("#tableTitle");
                        var tableArrows = document.querySelector("#tableArrows");
                        table.innerHTML = "";
                        table.appendChild(tableTitle);
                        obj.forEach(i => {
                        var tr = document.createElement('tr');
                        tr.innerHTML = `<td>${i.action}</td><td>${i.date.slice(2)}⠀${i.time}</td><td>${i.author}</td><td>${i.ip}</td><td>${i.location}</td><td>${i.id}</td>`;
                        table.appendChild(tr);
                        });
                        table.appendChild(tableArrows);
                    } else {
                        var obj = JSON.parse(data);
                        var table = document.querySelector('#tbodyAdminisration');
                        var tableTitle = document.querySelector("#tableTitle");
                        var tableArrows = document.querySelector("#tableArrows");
                        table.innerHTML = "";
                        table.appendChild(tableTitle);
                        obj.forEach(i => {
                        var tr = document.createElement('tr');
                        tr.innerHTML = `<td>${i.action}</td><td>${i.date.slice(2)}⠀${i.time}</td><td>${i.author}</td><td>${i.ip}</td><td>${i.location}</td><td>${i.id}</td>`;
                        table.appendChild(tr);
                        });
                        table.appendChild(tableArrows);
                    }
                },
                error: function(xhr, status, error) {
                    console.error(xhr);
                }
            });

        } catch(e) {console.log(e)}
    }
}


//////////////////////////////////////////////////////////

function showDropdownData() {
    document.getElementById("interval").classList.toggle("show");
}

var lastDropdownElement = document.getElementById('daily')
if(!lastDropdownElement == undefined || !lastDropdownElement == null) {
    lastDropdownElement.style.backgroundColor = '#121720';
}

function changeInterval(e) {
    const element = document.getElementById("dropbtn");
    element.innerHTML = e.innerText;
    if(lastDropdownElement != undefined) lastDropdownElement.style.backgroundColor = '#1c2330';
    e.style.backgroundColor = '#121720';

    lastDropdownElement = e;

    runCharts();
}

window.onclick = function(event) {
    if (!event.target.matches('.dropdown')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var dropdownsLength = dropdowns.length;
        var i;
        for (i = 0; i < dropdownsLength; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

function cleanUsername(e) {
    var regex = /[^a-z0-9\u0020\u005F]/gi;
    e.value = e.value.replace(regex, "");
}

function changeRole(e, e2, e3) {
    var roles = ['Administrator', 'Head Moderator', 'Moderator', 'Trial Moderator', 'AND', 'MORE'];
    var newindex = roles.indexOf(e.parentElement.innerText)+1;
    if(newindex > roles.length-1) newindex = 0;
    e.parentElement.innerHTML = roles[newindex] + `<i id="dropicon2" class="fas fa-exchange-alt" onclick="changeRole(this, this.parentElement.parentElement.childNodes[3], this.parentElement.className)"></i>`;
    
    const id = e2.innerText;
    if(!updateObject[id]) {
        const username = e2.parentElement.childNodes[1].childNodes[0].value.trim();
        const perms = e2.parentElement.childNodes[5].innerText;
        const newpass = e2.parentElement.childNodes[7].childNodes[0].value.trim();
        updateObject = {
            ...updateObject,
            ...{[id]: {
                "name": username,
                "id": id,
                "perms": perms,
                "newpass": newpass
            }}
        }
    }

    updateObject[id].perms = roles[newindex];

    if(e3 === roles[newindex] && Object.size(updateObject) == 0 && Object.size(deleteArray) == 0) {
        saveButton.style.opacity = 0.4;
        saveButton.style.pointerEvents = 'none';
        saveButton.style.cursor = 'auto';
        canSave = false;
    } else {
        saveButton.style.opacity = 1;
        saveButton.style.pointerEvents = 'all';
        saveButton.style.cursor = 'pointer';
        canSave = true;
    }
}

const saveButton = document.querySelector('#save');
const addButton = document.querySelector('#addNew');
var canSave = false;

function canSaveChanges(e) {
    const username = e.parentElement.parentElement.childNodes[1].childNodes[0].value.trim();
    const id = e.parentElement.parentElement.childNodes[3].innerText;
    const perms = e.parentElement.parentElement.childNodes[5].innerText;
    const newpass = e.parentElement.parentElement.childNodes[7].childNodes[0].value.trim();

    if(updateObject[id]) {
        if(e.name == "nameOfUser") {
            updateObject[id].name = username;

        } else if(e.name == "newpass") {
            updateObject[id].newpass = newpass;
            
        }

        updateObject[id].perms = perms;
    
    } else {

        updateObject = {
            ...updateObject,
            ...{[id]: {
                "name": username,
                "id": id,
                "perms": perms,
                "newpass": newpass
            }}
        }
    }

    if((e.parentElement.parentElement.childNodes[7].childNodes[0].value.trim() == "") && e.parentElement.parentElement.childNodes[1].childNodes[0].value.trim() === e.parentElement.parentElement.childNodes[1].childNodes[0].id) {
        delete updateObject[id]
    }

    if((Object.size(updateObject) == 0 && Object.size(deleteArray) == 0) || (username.length < 4 || username.length > 64) || (newpass.length !== 0 && (newpass.length < 8 || newpass.length > 256))) {
        saveButton.style.opacity = 0.4;
        saveButton.style.pointerEvents = 'none';
        saveButton.style.cursor = 'auto';
        canSave = false;
    } else {
        saveButton.style.opacity = 1;
        saveButton.style.pointerEvents = 'all';
        saveButton.style.cursor = 'pointer';
        canSave = true;
    }

}

var removingUser = false;
var addingUser = false;
var currentUser = undefined;

function showWarning(type) {
    if(type == "continue") {
        var el = document.getElementById('popup');
        var main = document.getElementById('main');
        el.style.display = 'flex';
        main.style.filter = 'blur(8px)';
    }
    else if(type == "addNew") {
        var el = document.getElementById('popup');
        var main = document.getElementById('main');
        el.style.display = 'flex';
        main.style.filter = 'blur(8px)';
        var paragraph = document.getElementById('popupPar');
        paragraph.innerHTML = 'If you will continue, a new account will be inserted into a database after saving all changes. Click on the <span class="bold">CONTINUE</span> button, if you really agree with this action.'
    } else {
        var el = document.getElementById('popup');
        var main = document.getElementById('main');
        el.style.display = 'flex';
        main.style.filter = 'blur(8px)';
    }
}

function removeWarning(type) {
    if(type == "nevermind") {
        var el = document.getElementById('popup');
        var main = document.getElementById('main');
        el.style.display = 'none';
        main.style.filter = 'blur(0px)';
        if(removingUser == true) {
            removingUser = false
        }

    } else {
        var el = document.getElementById('popup');
        var main = document.getElementById('main');
        el.style.display = 'none';
        main.style.filter = 'blur(0px)';
        if(removingUser == true) {
            removeUser();
        }
        if(addingUser == true) {
            createUser();
        }
    }
}

function removeUser() {
    const thisTR = currentUser.parentElement.parentElement
    const id = `${thisTR.childNodes[3].innerText}`;

    if(updateObject[id]) {
        delete updateObject[id]
    }
    if(!deleteArray[parseInt(id)]) {
        deleteArray.push(parseInt(id))
    }

    thisTR.remove()

    saveButton.style.opacity = 1;
    saveButton.style.pointerEvents = 'all';
    saveButton.style.cursor = 'pointer';
    canSave = true;

    removingUser = false
}


function createUser() {
    const thisTR = document.querySelector('#accountTable');

    var randomID = Math.floor(Math.random(314748364) * 2147483647);
    var matchingElement = document.evaluate(`//td[text()='${randomID}']`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    while(matchingElement !== null){
        randomID = Math.floor(Math.random(314748364) * 2147483647);
    }

    const element = document.createElement('tr')
    element.innerHTML = `
    <td><input maxlength="64" minlength="4" onkeyup="cleanUsername(this)" onkeydown="cleanUsername(this)" onchange="canSaveChanges(this)" id="Username" name="nameOfUser" type="text" value="Username"></td>
    <td>${randomID}</td>
    <td>Administrator<i id="dropicon2" class="fas fa-exchange-alt" onclick="changeRole(this)"></i></td>
    <td><input onpaste="return false;" ondrop="return false;" maxlength="255" minlength="8" onchange="canSaveChanges(this)" name="newpass" type="password" id="newpasswordInput"><i id="showpass" onclick="showPassword(this)" class="far fa-eye-slash"></i></td>
    <td><i onclick="showWarning();removingUser=true;currentUser=this;" class="far fa-times-circle" id="removeFromUsers"></i></td>
    `;

    thisTR.appendChild(element)

    if(canSave == false) {
        saveButton.style.opacity = 1;
        saveButton.style.pointerEvents = 'all';
        saveButton.style.cursor = 'pointer';
        canSave = true;
    }
    
    addingUser = false;
}


Object.size = function(obj) {
    var size = 0,
      key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

if(saveButton !== null) {
    saveButton.addEventListener('click', e=> {
        if(canSave == true) {
            fullObject = {
                updateObject,
                deleteArray
            }
    
            $.ajax({
                type: "POST",
                url: "./views/panel/data/updateaccounts",
                data: {update: updateObject, delete: deleteArray},
                cache: false,
                success: function(data) {
                    var e = document.getElementById('thisiawhdj')
                    if(data.includes("You have deleted your own account.. logging out")) {
                        window.location.href = "panel?logout";
                    } else {
                        e.innerText = data
                    }
                    saveButton.style.opacity = 0.4;
                    saveButton.style.pointerEvents = 'none';
                    saveButton.style.cursor = 'auto';
                    canSave = false;

                },
                error: function(xhr, status, error) {
                    console.error(xhr);
                }
            });
            
        }
        addingUser = false;
    })    
}

function showPassword(e) {
    if(e.className == "far fa-eye-slash") {
        e.className = "far fa-eye";
        e.style.opacity = "0.9";
        e.parentElement.childNodes[0].type = "text";
    } else if (e.className == "far fa-eye") {
        e.className = "far fa-eye-slash";
        e.style.opacity = "0.6";
        e.parentElement.childNodes[0].type = "password";
    }
}