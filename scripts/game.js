//Request External Scripts:
(function LoadExternalScripts(){
    $.ajaxSetup({ async: false });

    $.getScript("scripts/requestanimframe.js");
    $.getScript("scripts/input/InputManager.js");
    $.getScript("scripts/game/GameObject.js");
    $.getScript("scripts/game/DisplayList.js");

    $.ajaxSetup({ async: true  });
})();
//===========================

//Game vars
var player;
//var canvas;
//var ctx;
var displayList = DisplayList();

//Main Functions
function Refresh(){
    requestAnimFrame(Refresh);
    Draw();
}

function Draw(){
    canvas = displayList.canvas;
    displayList.context.clearRect(0, 0, canvas.width, canvas.height);
    displayList.context.drawImage(player.sprite, player.x, player.y);    
}

function Resize(){
    displayList.canvas.width = window.innerWidth;
    displayList.canvas.height = window.innerHeight;
}

function ProccessInput(){
    player.x = STInputManager.input_position.x;
    player.y = STInputManager.input_position.y;
}
//===========================



//Events
$(window).resize(Resize);
STInputManager.addEventListener("stinputmove", ProccessInput);

//Startup
$(document).ready(function(){
   displayList.canvas = document.getElementById("game-area");
   displayList.context = displayList.canvas.getContext("2d");
   player = new GameObject("images/character.png");
   
   Resize();
   Refresh(); 
});
