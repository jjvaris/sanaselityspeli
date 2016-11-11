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

function arvoSana(index) {
    var sana;
    if(index)
        sana = index;
    else
        sana = Math.floor(Math.random() * sanat.length);
    if(nahdyt[sana] == undefined) {
        $("#sana").text(sanat[sana].toUpperCase());
        nahdyt[sana] = true;
    } else {
        if(nahdyt.length == sanat.length)
            nahdyt = [];
        arvoSana(++sana < sanat.length ? sana : 0);
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
        $("#startbutton").text("Seuraava");
        gameReset = false;
        nextOrSkipPressed = false;
        pelikaynnissa = true;
        timeout = false;
        laskuri(true);
        eka = false;
        console.log('Adding divbutton to reset button')
        $("#reset").addClass('reset-button');
        $("#skipbutton").addClass('skip-button');
        var hr = document.createElement("hr");
        hr.className = "to-be-removed";
        $("#guessed-words-modal").prepend(hr);
        $("#guessed-words-button").hide(500);
        $("#points-button").removeClass('points-button');
    }

    $("#pisteet").text(pisteet);

    arvoSana();
}

function ohita() {
    pisteet -= 1;
    lisaaOhitus();
    $("#pisteet").text(pisteet);
    nextOrSkipPressed = true;
    arvoSana();
}

function lisaaArvaus() {
    var tekstiElementti = document.createElement("p");
    var teksti = document.createTextNode($("#sana").text());
    tekstiElementti.appendChild(teksti);
    tekstiElementti.className = "guessed-word-text";
    $("#guessed-words-modal").prepend(tekstiElementti);
}

function lisaaOhitus() {
    var tekstiElementti = document.createElement("p");
    var teksti = document.createTextNode($("#sana").text());
    tekstiElementti.appendChild(teksti);
    tekstiElementti.className = "skipped-word-text";
    $("#guessed-words-modal").prepend(tekstiElementti);
}

function nollaa() {
    if(timeout) { // Continue button pressed
        seuraava();
        $("#nollaa").text("Nollaa");
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
    $("#sana").text("Paina Aloita");
    $("#pisteet").text(pisteet);
    pyyhiArvatut();
    $("#startbutton").text("Aloita");
    $("#reset").removeClass('reset-button');
    $("#skipbutton").removeClass('skip-button');
    $("#tiimalasi").hide();
    $("#topic").text("Sanaselityspeli");
    $("#topic").show();
    $("#points-button").removeClass('points-button');
}

function pyyhiArvatut () {
    $(".guessed-word-text").remove();
    $(".skipped-word-text").remove();
    $(".to-be-removed").remove();
}

function laskuri(start) {
    var aika = 60;
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
                topicElement.text("Aika loppui!");
                $('#nollaa').text("Jatka");
                timeout = true;
                $("#start").removeClass('start-button');
                $("#skipbutton").removeClass('skip-button');
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
    $("#pisteet").text(pisteet);
}

function miinus() {
    pisteet -= 1;
    $("#pisteet").text(pisteet);
}


// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("points-button");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
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