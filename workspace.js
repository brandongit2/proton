var layout = null;
var panels = null;

var mouseX = 0;
var mouseY = 0;

$(function() {
    // Obtain JSON files
    var request1 = new XMLHttpRequest();
    request1.responseType = "json";
    request1.open("GET", "default.math");
    request1.send();
    request1.onload = function() {
        layout = request1.response;
    }

    $("#tools").css("width", "200px");

    setUpGraph();

    window.addEventListener("mousemove", function(e) {
        mouseX = e.x;
        mouseY = e.y - 20; // 20 is the toolbar height
    });
});

function matrixToArray(str) {
    return str.match(/(-?[0-9\.]+)/g);
}
