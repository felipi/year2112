//Request External Scripts:
(function LoadExternalScripts(){
    $.ajaxSetup({
        async: false
    });

    $.getScript("scripts/requestanimframe.js");
    $.getScript("scripts/input/InputManager.js");

    $.ajaxSetup({
        async: true
    });
})();
//===========================

var GameObject = function(sprite_src){
    var sprite = new Image();
    sprite.src = sprite_src;

    return {
        sprite: sprite,
        x: 0,
        y: 0,
        rotation: 0
    }
}

function Refresh(){
    requestAnimFrame(Refresh);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    Draw();
}

function Draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(player.sprite, player.x, player.y);    
}

//==
var player;
var canvas;
var ctx;

//Startup
$(document).ready(function(){
    canvas = document.getElementById("game-area");
    ctx = canvas.getContext("2d");
    STInputManager.addEventListener("stinputmove", function(event){
        player.x = STInputManager.input_position.x;
        player.y = STInputManager.input_position.y;
    });
    player = new GameObject("images/character.png");

   Refresh(); 
    //setInterval(gameloop, 1000/60);
});
