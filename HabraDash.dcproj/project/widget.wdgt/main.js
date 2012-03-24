// globals
var updateTimer;
var xmlHttp = null;
var updateInterval = 60*1000;
var preferenceKey = "habraUserName";

// set true to enable debug output
var debug = false;

//-------------------------------------------------//
function log(message)
{
    if (debug)
    {
        alert(message);
    }
}

//-------------------------------------------------//
function setLogin(login)
{
    document.getElementById("userName").innerText = login;
}

function setKarma(karma)
{
    document.getElementById("karma").innerText = karma;
}

function setRating(rating)
{
    document.getElementById("rating").innerText = rating;
}

function setPosition(position)
{
    document.getElementById("position").innerText = position;
}

//-------------------------------------------------//
function userName()
{
    return document.getElementById("nameEdit").value;
}

function setUserName(name)
{
    document.getElementById("nameEdit").value = name;
}

//-------------------------------------------------//
function loadPrefs()
{
    var name = widget.preferenceForKey(widget.identifier + "-" + preferenceKey);
    log(widget.identifier + "-" + preferenceKey);
    log("name from preferences: " + name);
    if (name != null)
        setUserName(name);

}

function savePrefs()
{
    widget.setPreferenceForKey(userName(), widget.identifier + "-" + preferenceKey);
}

//-------------------------------------------------//
function resetStats()
{
    setLogin("<none>");
    setKarma("-");
    setRating("-");
    setPosition("-");
}

function execStatsRequest()
{
    if (userName().length > 0)
    {
        var Url = "http://habrahabr.ru/api/profile/" + userName() + "/";
        log("User: " + userName() + "\nURL: " + Url);

        xmlHttp = new XMLHttpRequest(); 
        xmlHttp.onreadystatechange = processStatsRequest;
        xmlHttp.overrideMimeType('text/xml');
        xmlHttp.open("GET", Url, true);
        xmlHttp.send();
    }
    else
    {
        resetStats();
    }
}

function processStatsRequest() 
{
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
    {
        log("xml is " + xmlHttp.responseXML);
        if (xmlHttp.responseXML == null)
        {
            resetStats();
        }
        else
        {
            log(xmlHttp.responseText);
            var error = xmlHttp.responseXML.getElementsByTagName("error")[0];
            if (error != null)
            {
                log("Some error occured!");
                resetStats();
                setLogin("<" + userName() + " not found>");
                return;
            }
            var login = xmlHttp.responseXML.getElementsByTagName("login")[0].firstChild.nodeValue;
            var karma = xmlHttp.responseXML.getElementsByTagName("karma")[0].firstChild.nodeValue;
            var rating = xmlHttp.responseXML.getElementsByTagName("rating")[0].firstChild.nodeValue;
            var position = xmlHttp.responseXML.getElementsByTagName("ratingPosition")[0].firstChild.nodeValue;
            setLogin(login);
            setKarma(karma);
            setRating(rating);
            setPosition(position);
        }                    
    }
}

//-------------------------------------------------//
function startTimer(msec)
{
    updateTimer = setTimeout("updateStats()", msec);
}

function stopTimer()
{
    clearTimeout(updateTimer);
}

function updateStats()
{
    var online = window.navigator.onLine;
    if (online)
    {
        execStatsRequest();
    }
    startTimer(updateInterval);
}

//-------------------------------------------------//
function onLogoClicked()
{
    var websiteURL = "http://habrahabr.ru";
    widget.openURL(websiteURL);
}

//-------------------------------------------------//
function load()
{
    dashcode.setupParts();
    resetStats();
    loadPrefs();
}

function remove()
{
    stopTimer();
    savePrefs();
}

function hide()
{
    stopTimer();
    savePrefs();
}

function show()
{
    loadPrefs();
    startTimer(50);
}

//-------------------------------------------------//
function sync()
{
    loadPrefs();
}

function showBack(event)
{
    stopTimer();
    var front = document.getElementById("front");
    var back = document.getElementById("back");

    if (window.widget) {
        widget.prepareForTransition("ToBack");
    }

    front.style.display = "none";
    back.style.display = "block";

    if (window.widget) {
        setTimeout('widget.performTransition();', 0);
    }
}

function showFront(event)
{
    startTimer(50);
    var front = document.getElementById("front");
    var back = document.getElementById("back");

    if (window.widget) {
        widget.prepareForTransition("ToFront");
    }

    front.style.display="block";
    back.style.display="none";

    if (window.widget) {
        setTimeout('widget.performTransition();', 0);
    }
}

if (window.widget) {
    widget.onremove = remove;
    widget.onhide = hide;
    widget.onshow = show;
    widget.onsync = sync;
}
