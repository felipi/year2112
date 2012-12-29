var Y2BaseActor = cc.Sprite.extend({
    state: 'running', //Finite State Machine
    shieldCapacity: 90,
    shield: 100,
    fixture: null, //this is the physics fixture
    runningSpeed:7,
    flyingSpeed:30,
    isShooting: false,
    shootTimer: 0,

    ctor: function(){
    },

    update: function(dt){

    }
});
