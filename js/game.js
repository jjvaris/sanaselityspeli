/**
 * Created by jjvaris on 08/06/15.
 */

var pelikaynnissa = false;
var gameReset = false;
//var timeout = new Audio("timeout.mp3");
var pisteet = 0;
var eka = true;
var timeout = false;
var nextOrSkipPressed = false;
var nahdyt = [];
var view = new View();
const startTime = 2;

$(document).ready(function() {
    view.initialize();
    $(".dropdown-menu li a").click(function(){
        const lang = $(this).attr("id")
        console.log(lang);
        view.words = words[lang];
        view.localized = localization[lang];
        view.language = lang;
        localStorage.setItem("language", lang);
        view.reload();
        resetGame();
    });
})


function arvoSana(index) {
    var sana;
    if(index)
        sana = index;
    else
        sana = Math.floor(Math.random() * view.words.length);
    if(nahdyt[sana] == undefined) {
        $("#word").text(view.words[sana].toUpperCase());
        nahdyt[sana] = true;
    } else {
        if(nahdyt.length == view.words.length)
            nahdyt = [];
        arvoSana(++sana < view.words.length ? sana : 0);
    }
}

function seuraava() {
    if(!eka) {
        nextOrSkipPressed = true;
        pisteet += 1;
        lisaaArvaus();
    }
    else {
        $("#tiimalasi").show();
        $("#topic").hide();
        $("#startbutton").text(view.localized.next);
        $("#resetbutton").text(view.localized.reset);
        gameReset = false;
        nextOrSkipPressed = false;
        pelikaynnissa = true;
        timeout = false;
        laskuri(true);
        eka = false;
        console.log('Adding divbutton to reset button')
        $("#reset").addClass('reset-button');
        $("#skip").addClass('skip-button');
        var hr = document.createElement("hr");
        hr.className = "to-be-removed";
        $("#guessed-words-modal").prepend(hr);
        $("#guessed-words-button").hide(500);
        $("#points-button").removeClass('points-button');
    }

    $("#points").text(pisteet);

    arvoSana();
}

function ohita() {
    pisteet -= 1;
    lisaaOhitus();
    $("#points").text(pisteet);
    nextOrSkipPressed = true;
    arvoSana();
}

function lisaaArvaus() {
    addGuessedOrSkippedWord(true);
}

function addGuessedOrSkippedWord(guessed) {
    var $row = $("<div/>", {
        "class": "row notselectable to-be-removed " + (guessed ? "guessed-word-div" : "skipped-word-div")
    }).prependTo("#guessed-words-modal");

    $row.data("guessed", guessed);

    var $column1 = $("<div/>", {
        "class": "col-xs-2 skipped"
    }).appendTo($row);

    var $column2 = $("<div/>", {
        "class": "col-xs-10 guessed-word-text"
    }).appendTo($row);

    var $span = $("<span/>", {
        "class":'glyphicon clickable '+ (guessed ? "glyphicon-ok" : "glyphicon-remove"),
        click: function() {
            toggleGuessedWord($row, $span, this);
        }
    }).appendTo($column1)

    $("<span/>", {
        text: $("#word").text(),
        click: function() {
            toggleGuessedWord($row, $span, this);
        }
    }).appendTo($column2);
}

function lisaaOhitus() {
    addGuessedOrSkippedWord(false);
}

function toggleGuessedWord(row, span, $this) {
    console.log($(row).data("guessed"))
    if ($(row).data("guessed")) {
        pisteet -= 2;
        $(row).data("guessed", false);
    } else {
        pisteet += 2;
        $(row).data("guessed", true);
    }
    $(row).toggleClass("guessed-word-div");
    $(row).toggleClass("skipped-word-div");
    $(span).toggleClass("glyphicon-remove");
    $(span).toggleClass("glyphicon-ok");
    $("#points").text(pisteet);
}


function nollaa() {
    if(timeout) { // Continue button pressed
        seuraava();
        $("#nollaa").text(view.localized.reset);
        $("#start").addClass('start-button');
    } else {
        resetGame();
    }
}

function resetGame() {
    nextOrSkipPressed = false;
    gameReset = true;
    eka = true;
    pisteet = 0;
    view.reset();
}

function laskuri(start) {
    var aika = startTime;
    var tiimalasiElement = $("#tiimalasi");
    var topicElement = $("#topic");
    var tiimalasi = setInterval(function () {
        laskuri()
    }, 1000);

    tiimalasiElement.text(aika);

    function laskuri() {
        aika -= 1;
        if (aika == 0 || gameReset) {
            //play sound
            console.log("Aika loppui");
            clearInterval(tiimalasi);
            pelikaynnissa = false;
            eka = true;
            if(!gameReset) {
                tiimalasiElement.hide();
                topicElement.show();
                topicElement.text(view.localized.timeOut);
                $("#resetbutton").text(view.localized.continue);
                timeout = true;
                $("#start").removeClass('start-button');
                $("#skip").removeClass('skip-button');
                $("#guessed-words-button").show(500);
                $("#points-button").addClass('points-button');
            }
        } else
            tiimalasiElement.text(aika);
        if (aika == 3) {
            //$("#timeout").play();
            //timeout.play();
        }
    }
}

function plus() {
    pisteet += 1;
    $("#points").text(pisteet);
}

function miinus() {
    pisteet -= 1;
    $("#points").text(pisteet);
}


// Get the modal
var modal = document.getElementById('guessed-words');

// Get the button that opens the modal
var btn = document.getElementById("points-button");

// Get the <span> element that closes the modal
var span = document.getElementById("close-guessed-words");

// When the user clicks on the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

var settings = document.getElementById('settings-modal');
var settingsBtn = document.getElementById("settings-button");
var settingsCloseBtn = document.getElementById("close-settings");

settingsBtn.onclick = function() {
    settings.style.display = "block";
}

settingsCloseBtn.onclick = function() {
    settings.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    if (event.target == settings) {
        settings.style.display = "none";
    }
}

// for disabling backbutton exit on Android
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady(){
    document.addEventListener("backbutton", onBackKeyDown, false);
}

function onBackKeyDown(){
    return false;
}