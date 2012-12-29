var Y2BaseActor = cc.Sprite.extend({
    state: 'running', //Finite State Machine
    shieldCapacity: 90,
    shield: 100,
    fixture: null, //this is the physics fixture
    runningSpeed:7,
    flyingSpeed:30,
    isShooting: false,
    shootTimer: 0,
    frameSize: {
        w: 83,
        h: 107
    },
    anims: {
        run: null,
        fly: null,
    },

    ctor: function(){
    },

    update: function(dt){

    },

    getBody: function() {
        return this.fixture.GetBody();
    },

    //tex: texture from cache, fsize: frame size (w and h)
    //numFramesX: how many frames the sheet has horizontaly
    //first: first frame(x,y). last: last frame(x,y)
    createAnimation: function(tex, fsize, numFramesX, first, last, speed) {
        frames = [];
        for(j=first.y;j<=last.y;j++){
            i = j==first.y ? first.x : 0;
            end = j==last.y ? last.x : numFramesX-1;
            console.log("I = "+ i + "J = ", j);
            for(i;i<=end;i++){
                console.log("Animation creation: " + i + " - "+ j); 
                f = cc.SpriteFrame.createWithTexture(tex, cc.rect(i*fsize.w, j*fsize.h,fsize.w,fsize.h));
                frames.push(f);
            }
        }
        return cc.Animation.create(frames, speed);
    }
});
