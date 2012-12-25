var Y2Actor = cc.Sprite.extend({
    
    stealth: true, //Wether in stealth mode or not
    state: 'running', //Finite State Machine
    visibility: 0, //From 0 to 1, how visible/audible the actor is to others
    distanceWalked: 0, //Distance traveled on foot (jumps included) 
    furtiveness: 1, //How perceivable is the actor actions to others
    stealthArea: 5, //Area where the actor is in stealth mode, in meters
    distanceFlew: 0, //Distance traveled on air
    control: 1, //How controlable is the actor
    stability: 0, //How stable the actor is after control is ended
    maneuvering: 0, //Experience points gained from maneuvering actions
    perception: 0, //How slower the world seems to this actor
    grazingLevel: 0, //The overall level of grazing skill of this actor
    grazing: 0, //Temporary grazing level, drains when not grazing
    fireRate: 1, //Rate of fire for all Bullet Guns
    bulletsShot: 0, //How many bullets this actor has shot
    accuracy: 15, //Weapon accuracy
    criticalShotChance: 0, //Critical chance for guns
    criticalShotDamage: 2, //Percent of critical damage for guns
    criticalMeleeChance: 0, //Critical chance for melee attacks
    criticalMeleeDamage: 4, //Percent of critical damage for melee attacks
    chargeShot: 0, //Overall level of charge shot skill
    chargeSpeed: 1, //Speed of charging weapons
   
    jumpImpulse: 100, //the ammount of impulse a jump takes
    shieldCapacity: 90,
    shield: 100,
    fixture: null, //this is the physics fixture

    ctor: function() {
    },

    getBody: function() {
        return this.fixture.GetBody();
    },

    jump: function() {
        b2Vec2 = Box2D.Common.Math.b2Vec2;
        body = this.getBody();
        impulse = body.GetMass() * this.jumpImpulse;
        body.ApplyImpulse(
              new b2Vec2(0, impulse),
              body.GetWorldCenter()
              );
    }
});
