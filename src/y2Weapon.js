var BULLETW = 27;
var BULLETH = 18;

var Y2Weapon = cc.Class.extend({
    size: 1,
    fireRate: 5,
    shotForce: 60,
    accuracy: 75, //Weapon accuracy
    name: "Weapon",

    ctor: function(name, size, bulleti, bulletj){
        if (typeof name === 'undefined') name = "Weapon";
        if (typeof size === 'undefined') size = 0.05;
        if (typeof bulleti === 'undefined') bulleti = 0;
        if (typeof bulletj === 'undefined') bulletj = 0;
        this.name = name;
        this.size = size;
        tc = cc.TextureCache.getInstance();
        tex = tc.textureForKey("res/bullets.png");
        if(tex == null){
            tex = tc.addImage("res/bullets.png");
        }
            frame = cc.SpriteFrame.createWithTexture(tex, cc.rect( bulleti * BULLETW, bulletj*BULLETH, BULLETW, BULLETH));
            cc.SpriteFrameCache.getInstance().addSpriteFrame(frame, this.name + "Bullet");
    }

}); 
