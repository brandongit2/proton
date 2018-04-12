
const GREY = "#A0A0A0"
const BLACK = "#000000";
const RED = "#FF0000";

var canvas;
var ctx2d;
var workspace;

function setUpCanvas() {
    workspace = $("#workspace")[0];
    canvas = $("#canvas")[0];
    canvas.height = workspace.getBoundingClientRect().height;
    canvas.width = workspace.getBoundingClientRect().width;
    ctx2d = canvas.getContext("2d");
    
    ctx2d.fillStyle = GREY;
    ctx2d.fillRect(0,0,canvas.width,canvas.height);
    
    ctx2d.fillStyle = BLACK;
    ctx2d.font="50px Arial";
    ctx2d.fillText("This is the canvas.", 200, 200);

    ctx2d.fillStyle = RED;
    ctx2d.fillRect(0, 0, 5, 5);
    ctx2d.fillRect(canvas.width-5, 0, 5, 5);
    ctx2d.fillRect(0, canvas.height-5, 5, 5);
    ctx2d.fillRect(canvas.width-5, canvas.height-5, 5, 5);
}