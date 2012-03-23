// globals
var updateTimer;
var xmlHttp = null;
var updateInterval = 5000;
var preferenceKey = "habraUserName";

// set true to enable debug output
var debug = true;

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
        log("User: " + userName + "\nURL: " + Url);

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
            //log(xmlHttp.responseText);
        }
        else
        {
            log(xmlHttp.responseText);
            var error = xmlHttp.responseXML.getElementsByTagName("error")[0];
            log("Error: " + error);
            if (error != null)
            {
                log("some error");
                resetStats();
                setLogin("<Error: user " + + " not found>");
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

//-------------------------------------------------//
function load()
{
    dashcode.setupParts();
    resetStats();
    var name = widget.preferenceForKey(widget.identifier + "-" + preferenceKey);
    if (name != null)
        setUserName(name);
}

function remove()
{
    widget.setPreferenceForKey(userName(), widget.identifier + "-" + preferenceKey);
    stopTimer();
}

function hide()
{
    stopTimer();
}

function show()
{
    window.console.log("show");
    startTimer(500);
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
//
// Function: sync()
// Called when the widget has been synchronized with .Mac
//
function sync()
{
    // Retrieve any preference values that you need to be synchronized here
    // Use this for an instance key's value:
    // instancePreferenceValue = widget.preferenceForKey(null, dashcode.createInstancePreferenceKey("your-key"));
    //
    // Or this for global key's value:
    // globalPreferenceValue = widget.preferenceForKey(null, "your-key");
}

//
// Function: showBack(event)
// Called when the info button is clicked to show the back of the widget
//
// event: onClick event from the info button
//
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

//
// Function: showFront(event)
// Called when the done button is clicked from the back of the widget
//
// event: onClick event from the done button
//
function showFront(event)
{
    startTimer(500);
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
