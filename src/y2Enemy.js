var Y2Enemy = Y2BaseActor.extend({
    behaviour: "passAndShoot",
    velocity: 1.8,
    equip: {
        weapon: null,
    },
    size: {
        w: 0.5,
        h: 0.5
    },
    anims: {
        run: null,
        fly: null,
    },
    ctor: function(){
        this.scheduleUpdate();
        this.state = "flying";
        this.initWithFile("res/enemies1.png", cc.rect(0,0,53,53))
        this.equip.weapon = new Y2Weapon("Cannon", 0.08, 0, 0);
        this.equip.weapon.fireRate = Math.random();
        this.equip.weapon.shotForce = 25;
        this.setPosition(0,0);

        tc = cc.TextureCache.getInstance();
        tex = tc.textureForKey("res/enemies1.png");
        if(tex == null){
            tex = tc.addImage("res/enemies1.png");
        }
        this.anims.fly = this.createAnimation(tex, {w:53,h:53},6,{x:0,y:0},{x:2,y:0},0.1);
        animate = cc.Animate.create(this.anims.fly);
        this.runAction(cc.RepeatForever.create(animate));
    },

    update: function(dt){
        ptm = GameManager.currentScene.layer.ptmRatio;
        this.setRotation(this.fixture.GetBody().GetAngle() * 180/Math.PI);
        this.setPosition(
                (this.getBody().GetPosition().x * ptm),
                cc.Director.getInstance().getWinSize().height - (this.getBody().GetPosition().y * ptm));

        if(this.getBody().GetPosition().x < -this.size.w){
            this.unscheduleAllCallbacks();
            this.getParent().removeChild(this);
            GameManager.world.DestroyBody(this.fixture.GetBody());
            return;
        }

        if(this.behaviour == "passAndShoot"){
            this.move();

            if(this.isShooting)
                this.shootTimer += dt;
            if(this.shootTimer >= (10 - this.fireRate())/10){
                this.shootTimer = 0;
                isShooting = false;
            }
            if(this.shootTimer <= 0 && this.fireRate() > 0 && this.state == "flying"){
                this.shoot();
            }
        }
    },
    move: function() {
        b2Vec2 = Box2D.Common.Math.b2Vec2;
        counter = new b2Vec2(-GameManager.world.GetGravity().x * this.getBody().GetMass() - this.velocity, -GameManager.world.GetGravity().y * this.getBody().GetMass());
        this.getBody().ApplyForce(counter, this.getBody().GetWorldCenter() ) 
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
        fixDef.filter.maskBits = GameManager.currentScene.layer.box2dFlags.HITBOX | GameManager.currentScene.layer.box2dFlags.GROUND ; 
        bodyDef.position.x = this.fixture.GetAABB().GetCenter().x - this.fixture.GetAABB().GetExtents().x ;
        bodyDef.position.y = this.fixture.GetAABB().GetCenter().y;// - this.fixture.GetAABB().GetExtents().y/2;

        angle = 0;// SHOOT STRAIGHT!
        deviation = ((Math.random()-0.5) * (100 - this.accuracy()))/100;
        angle += deviation;
        bodyDef.angle = angle;
        bullet = GameManager.world.CreateBody(bodyDef).CreateFixture(fixDef);
        impulse = bullet.GetBody().GetMass() * this.shotForce();
        bullet.GetBody().ApplyImpulse(
              new b2Vec2(Math.cos(angle) * -impulse,Math.sin(angle) * impulse),
              bullet.GetBody().GetWorldCenter()
              );

        sprite = cc.Sprite.createWithSpriteFrame( cc.SpriteFrameCache.getInstance().getSpriteFrame( this.equip.weapon.name + "Bullet" ));
        bullet.SetUserData(sprite);
        sprite.fixture = bullet;
        GameManager.currentScene.layer.addChild(sprite, 16);
        sprite.schedule(this.bulletSpriteUpdate, 1/60);
        this.bulletsShot++;
    },

    bulletSpriteUpdate: function(dt){
        if (this.life == undefined) this.life = 1.5;
            this.life -= dt;
        if(this.life <= 0) {
            this.unscheduleAllCallbacks();
            GameManager.world.DestroyBody(this.fixture.GetBody());

            this.emitter.destroyParticleSystem();
            this.emitter.getParent().removeChild(this.emitter);
            this.getParent().removeChild(this);
            return;
        }
        if(this.emitter == undefined){
            ///*
            this.emitter = new cc.ParticleFire();
            this.emitter.initWithTotalParticles(15);
            this.emitter.setSpeed(10);
            this.emitter.setEmissionRate(200);
            this.emitter.setZOrder(20);
            this.emitter.setStartSize(2);
            //this.emitter.setStartColor( new cc.Color4B(1,0.9,1,0.5));
            this.emitter.setEndSize(15);
            this.emitter.setPosVar(cc.p(0,0));
            this.emitter.setLife(0.02);
            this.emitter.setGravity(cc.p(0,0));
            this.emitter.setPosition(0,0);
            this.getParent().addChild(this.emitter);
            //*/
        }
        ptm = GameManager.currentScene.layer.ptmRatio;
        size = cc.Director.getInstance().getWinSize()
        this.emitter.setSourcePosition(cc.p(this.getPosition().x - this.getContentSize().width/2, (this.getPosition().y)));
        this.setRotation(this.fixture.GetBody().GetAngle() * 180/Math.PI);
        this.setPosition(
            this.fixture.GetBody().GetPosition().x * ptm,
            size.height - (this.fixture.GetBody().GetPosition().y * ptm)
                );
    }
});
