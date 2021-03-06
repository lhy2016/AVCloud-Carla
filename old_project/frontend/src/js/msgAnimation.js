function msgAnimate(alternative = null, success = true) {
    var message = $("#message > div").html();
    // triggered by redirect
    if (message != undefined && message != '') {
        $("#message").slideDown("fast", function() {
            setTimeout(function() {
                $("#message").slideUp("fast", function() {
                    resetToDefault();
                });
            }, 3000);
        });
        // asychronizly, triggered by ajax callback
    } else if (alternative != null && alternative != '') {
        if (!success) {
            $("#message > div").removeClass("alert-success");
            $("#message > div").addClass("alert-danger");
        }
        $("#message > div").html(alternative);
        $("#message").slideDown("fast", function() {
            setTimeout(function() {
                $("#message").slideUp("fast", function() {
                    resetToDefault();
                });
            }, 3000);
        });
    }
}
msgAnimate();

function resetToDefault() {
    $("#message > div").removeClass("alert-danger");
    $("#message > div").addClass("alert-success");
    if ($("#message > div").text() != "") {
        $("#message > div").text("");
    }
}