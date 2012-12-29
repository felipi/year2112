var Y2Actor = Y2BaseActor.extend({
    
    stealth: true, //Wether in stealth mode or not
    visibility: 0, //From 0 to 1, how visible/audible the actor is to others
    distanceWalked: 0, //Distance traveled on foot (jumps included) 
    furtiveness: 1, //How perceivable is the actor actions to others
    stealthArea: 5, //Area where the actor is in stealth mode, in meters
    distanceFlew: 0, //Distance traveled on air
    control: 0.3, //How controlable is the actor
    stability: 4, //How stable the actor is after control is ended
    maneuvering: 0, //Experience points gained from maneuvering actions
    perception: 0, //How slower the world seems to this actor
    grazingLevel: 0, //The overall level of grazing skill of this actor
    grazing: 0, //Temporary grazing level, drains when not grazing
    bulletsShot: 0, //How many bullets this actor has shot
    criticalShotChance: 0, //Critical chance for guns
    criticalShotDamage: 2, //Percent of critical damage for guns
    criticalMeleeChance: 0, //Critical chance for melee attacks
    criticalMeleeDamage: 4, //Percent of critical damage for melee attacks
    chargeShot: 0, //Overall level of charge shot skill
    chargeSpeed: 1, //Speed of charging weapons
    autoFire: true,
   
    jumpImpulse: 100, //the ammount of impulse a jump takes
    stabilityCounter: 0,
    canStartFlight:false,

    equip: {
        weapon: null,
    },
    frameSize: {
        w: 83,
        h: 107
    },
    anims: {
        run: null,
        fly: null,
    },
    ctor: function(){
        this.scheduleUpdate();
        this.initWithFile("res/character.png", cc.rect(0,0,68,94));
        this.equip.weapon = new Y2Weapon("Common Rifle", 0.05, 1,0);
        this.setPosition(0,0);

        //run animation:
        tc = cc.TextureCache.getInstance();
        tex = tc.textureForKey("res/hero.png");
        if(tex == null){
            tex = tc.addImage("res/hero.png");
        }
        //f0 = cc.SpriteFrame.createWithTexture(tex, cc.rect(0,0,this.frameSize.w, this.frameSize.h)); 
        //f1 = cc.SpriteFrame.createWithTexture(tex, cc.rect(1*this.frameSize.w,0,this.frameSize.w, this.frameSize.h)); 
        //runFrames = [f0,f1];
        //this.anims.fall = cc.Animation.create(runFrames, 0.1);
        //animate = cc.Animate.create(this.anims.run);
        this.anims.fall = this.createAnimation(tex,{w:84,h:107},6,{x:0,y:0},{x:1,y:0},0.1);
        this.anims.jump = this.createAnimation(tex,{w:84,h:107},6,{x:2,y:0},{x:3,y:0},0.1);
        this.anims.run = this.createAnimation(tex,{w:84,h:107},6,{x:0,y:1},{x:2,y:2},0.075);
        this.anims.fly = this.createAnimation(tex,{w:84,h:107},6,{x:3,y:2},{x:4,y:2}, 0.08);
        animate = cc.Animate.create(this.anims.run);
        this.runAction( cc.RepeatForever.create(animate));

    },

    update: function(dt) {
        this.setAnchorPoint(-0.5,1);
        ptm = GameManager.currentScene.layer.ptmRatio;
        this.setPosition(
                (this.getBody().GetPosition().x * ptm) - (this.getContentSize().width/2),
                cc.Director.getInstance().getWinSize().height - (this.getBody().GetPosition().y * ptm) - (this.getContentSize().height/2));

        if(this.state == "jumping" && this.getBody().GetLinearVelocity().y > 0) {
            this.state = "falling";
            
            this.stopAllActions();
            animate = cc.Animate.create(this.anims.fall);
            this.runAction( cc.RepeatForever.create(animate));
        } 
        if(this.state != "flying" && this.getBody().GetLinearVelocity().y ==0){
            this.run();
        }
        if(this.state == "flying"){
            this.stabilityCounter += dt;
        }
        if(this.stabilityCounter >= (this.stability+ 0.1)* 0.85){
            this.stabilityCounter = 0;
            this.fall();
        }
        if(GameManager.keysDown.indexOf(cc.KEY.w) >= 0 
           && this.getBody().GetLinearVelocity().y ==0
           && this.state == "running"){
           this.jump();
        }

        if(GameManager.keysDown.indexOf(cc.KEY.w) >= 0
           && this.canStartFlight
           && this.getBody().GetLinearVelocity().y != 0
           && (this.state == "running" || this.state == "jumping" || this.state == "falling") ){
            this.fly();
        }

        if(GameManager.keysDown.indexOf(cc.KEY.w) >= 0
           && this.state == "flying"){
           this.maneuver(0,-1); 
        }
        if(GameManager.keysDown.indexOf(cc.KEY.s) >= 0
           && this.state == "flying"){
           this.maneuver(0,1); 
        }
        if(GameManager.keysDown.indexOf(cc.KEY.a) >= 0
           && this.state == "flying"){
           this.maneuver(-1,0); 
        }
        if(GameManager.keysDown.indexOf(cc.KEY.d) >= 0
           && this.state == "flying"){
           this.maneuver(1,0); 
        }

        if((GameManager.isMouseDown || this.autoFire)
                && this.shootTimer <= 0 && this.fireRate() > 0 && this.state == "flying"){
            this.shoot();
        }

        if(this.isShooting)
            this.shootTimer += dt;
        if(this.shootTimer >= (10 - this.fireRate())/10){
            this.shootTimer = 0;
            isShooting = false;
        }

    },

    counterForces: function() {
        b2Vec2 = Box2D.Common.Math.b2Vec2;
        counter = new b2Vec2(-GameManager.world.GetGravity().x * this.getBody().GetMass(), -GameManager.world.GetGravity().y * this.getBody().GetMass());
        this.getBody().ApplyForce(counter, this.getBody().GetWorldCenter() ) 
    },


    jump: function() {
        this.state = "jumping";
        b2Vec2 = Box2D.Common.Math.b2Vec2;
        body = this.getBody();
        impulse = body.GetMass() * this.jumpImpulse;
        body.ApplyImpulse(
              new b2Vec2(0, impulse),
              body.GetWorldCenter()
              );
        
        this.stopAllActions();
        animate = cc.Animate.create(this.anims.jump);
        this.runAction( cc.RepeatForever.create(animate));
    },

    fly: function(){
        speed = this.flyingSpeed;
        createjs.Tween.get(GameManager.currentScene.layer, {paused:false}).to({travelSpeed:speed}, 1000, createjs.Ease.circIn);
        this.state = "flying";
        this.getBody().SetLinearDamping(5*this.control);

        this.stopAllActions();
        animate = cc.Animate.create(this.anims.fly);
        this.runAction( cc.RepeatForever.create(animate));
    },

    maneuver: function(x,y){
        b2Vec2 = Box2D.Common.Math.b2Vec2;
        this.getBody().ApplyForce(
                new b2Vec2(x * (this.jumpImpulse / this.control), y * (this.jumpImpulse / this.control)) ,
                this.getBody().GetPosition()
              );
        this.maneuvering++;
        this.stabilityCounter = 0;
    },

    run: function() {
        if(this.state == "running") return;
        this.state = "running";
        this.canStartFlight = false;
        speed = this.runningSpeed;
        createjs.Tween.get(GameManager.currentScene.layer).to({travelSpeed:speed}, 300, createjs.Ease.circIn);
        
        this.stopAllActions();
        animate = cc.Animate.create(this.anims.run);
        this.runAction( cc.RepeatForever.create(animate));
    },

    fall: function() {
        this.state = "falling";
        this.getBody().SetLinearDamping(0);

        this.stopAllActions();
        animate = cc.Animate.create(this.anims.fall);
        this.runAction( cc.RepeatForever.create(animate));
    },

    shoot: function() {
       this.isShooting = true;
       
        var   b2Vec2 = Box2D.Common.Math.b2Vec2
            ,   b2BodyDef = Box2D.Dynamics.b2BodyDef
            ,   b2Body = Box2D.Dynamics.b2Body
            ,   b2FixtureDef = Box2D.Dynamics.b2FixtureDef
            ,   b2Fixture = Box2D.Dynamics.b2Fixture
            ,   b2World = Box2D.Dynamics.b2World
            ,   b2MassData = Box2D.Collision.Shapes.b2MassData
            ,   b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
            ,   b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
            ,   b2DebugDraw = Box2D.Dynamics.b2DebugDraw
            ,   b2Transform = Box2D.Common.Math.b2Transform
            ;
        var fixDef = new b2FixtureDef;
        var bodyDef = new b2BodyDef;

        bodyDef.type = b2Body.b2_dynamicBody;
        bodyDef.bullet = true;
        fixDef.shape = new b2PolygonShape;
        fixDef.density = 1.0;
        fixDef.friction = 0;
        fixDef.restitution = 0.4;
        fixDef.shape.SetAsBox(this.equip.weapon.size, this.equip.weapon.size);
        fixDef.filter.categoryBits = GameManager.currentScene.layer.box2dFlags.BULLET;
        fixDef.filter.maskBits = GameManager.currentScene.layer.box2dFlags.ACTOR | GameManager.currentScene.layer.box2dFlags.GROUND ; 
        bodyDef.position.x = this.fixture.GetAABB().GetCenter().x + this.fixture.GetAABB().GetExtents().x ;
        bodyDef.position.y = this.fixture.GetAABB().GetCenter().y;// - this.fixture.GetAABB().GetExtents().y/2;

        //crosshair = GameManager.currentScene.layer.crosshair;
        //crossPos = new b2Vec2(crosshair.getPosition().x / GameManager.currentScene.layer.ptmRatio,
        //                      (cc.Director.getInstance().getWinSize().height - crosshair.getPosition().y) / GameManager.currentScene.layer.ptmRatio);
        //angle = Math.atan2(crossPos.y - bodyDef.position.y, crossPos.x - bodyDef.position.x);
        angle = 0;// SHOOT STRAIGHT!
        deviation = ((Math.random()-0.5) * (100 - this.accuracy()))/100;
        angle += deviation;
        bodyDef.angle = angle;
        bullet = GameManager.world.CreateBody(bodyDef).CreateFixture(fixDef);
        impulse = bullet.GetBody().GetMass() * this.shotForce();
        bullet.GetBody().ApplyImpulse(
              new b2Vec2(Math.cos(angle) * impulse,Math.sin(angle) * impulse),
              bullet.GetBody().GetWorldCenter()
              );

        
        //sprite = cc.Sprite.createWithTexture( cc.TextureCache.getInstance().textureForKey("res/bullet.png") );
        sprite = cc.Sprite.createWithSpriteFrame( cc.SpriteFrameCache.getInstance().getSpriteFrame( this.equip.weapon.name + "Bullet" ));
        bullet.SetUserData(sprite);
        sprite.fixture = bullet;
        GameManager.currentScene.layer.addChild(sprite, 16);
        sprite.schedule(this.bulletSpriteUpdate, 1/60);
        this.bulletsShot++;

        //this.stopAllActions();
        //animate = cc.Animate.create(this.anims.shoot);
        //this.runAction( animate );
    },

    bulletSpriteUpdate: function(dt){
        if (this.life == undefined) this.life = 3.5;
            this.life -= dt;
        if(this.life <= 0) {
            this.unscheduleAllCallbacks();
            this.getParent().removeChild(this);
            GameManager.world.DestroyBody(this.fixture.GetBody());
            return;
        }
        ptm = GameManager.currentScene.layer.ptmRatio;
        size = cc.Director.getInstance().getWinSize()
        this.setRotation(this.fixture.GetBody().GetAngle() * 180/Math.PI);
        this.setPosition(
            this.fixture.GetBody().GetPosition().x * ptm,
            size.height - (this.fixture.GetBody().GetPosition().y * ptm)
                );
    }
});
