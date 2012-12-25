var Y2Manager = cc.Class.extend({
    currentScene: null,
    keysDown:[],
    isMouseDown:false,
    player:null,
    world: null,
   
    init: function(){
        this.keysDown = [];
    }
});
