
function View() {
    this.language = localStorage.language === undefined ? "en" : localStorage.language;
    this.localized = localization[this.language];
    this.words = words[this.language];
}

View.prototype.initialize = function() {
    this.reload();
    this.initializeLanguageDropdown();
}

View.prototype.initializeLanguageDropdown = function() {
    var languagesDropdown = $("#languages-dropdown");
    for (var language in localization) {
        if (localization.hasOwnProperty(language)) {
            languagesDropdown.append("<li><a id='"+language+"' href='#'>"+localization[language].language+"</a></li>");
        }
    }
}

View.prototype.reload = function() {
    $("#topic").text(this.localized.title);
    $("#word").text(this.localized.help);
    $("#startbutton").text(this.localized.start);
    $("#skipbutton").text(this.localized.skip);
    $("#resetbutton").text(this.localized.reset);
    $("#language-dropdown-button").text(this.localized.language);
    $("#language-setting").text(this.localized.languageDropdown)
}

View.prototype.start = function() {

}

View.prototype.reset = function() {
    $("#word").text(view.localized.help);
    $("#points").text(0);
    $("#startbutton").text(view.localized.start);
    $("#reset").removeClass('reset-button');
    $("#skip").removeClass('skip-button');
    $("#tiimalasi").hide();
    $("#nollaa").text(view.localized.reset);
    $("#start").addClass('start-button');
    var $topic = $("#topic");
    $topic.text(view.localized.title);
    $topic.show();
    $("#points-button").removeClass('points-button');
    removeQuessedWords();

    function removeQuessedWords() {
        $(".guessed-word-text").remove();
        $(".skipped-word-text").remove();
        $(".to-be-removed").remove();
    }
}

View.prototype.confirm = function(confirm, callback) {
    var $confirm = $("#confirm");
    $confirm.css("display", "block");
    $("#confirm-topic").text(confirm);

    $("#yes").off("click").on("click", function(){
        $confirm.css("display", "none");
        callback();
    });

    $("#no").click(function(){
        $confirm.css("display", "none");
    });

    $confirm.click(function() {
        $confirm.css("display", "none");
    });

    $("#close-confirm-modal").click(function() {
        $confirm.css("display", "none");
    })
}