
const GREY = "#A0A0A0"
const BLACK = "	#000000";

var canvas;
var cxt2d;
var canvasWidth;
var canvasHeight;
var workspace;

function setUpCanvas() {
    workspace = $("#workspace")[0];
    canvas = $("#canvas")[0];
    canvas.height = workspace.getBoundingClientRect().height;
    canvas.width = workspace.getBoundingClientRect().width;
    cxt2d = canvas.getContext("2d");
    cxt2d.fillStyle = GREY;
    cxt2d.fillRect(0,0,canvas.width,canvas.height);
    cxt2d.fillStyle = BLACK;
    cxt2d.font="50px Arial";
    cxt2d.fillText("This is the canvas.", 200, 200);
}