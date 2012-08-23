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
