/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
var Box2DTest = cc.Layer.extend({
    isMouseDown:false,
    crosshair:null,
    world:null,
    ptmRatio:30,

    init:function () {
        var selfPointer = this;

        //////////////////////////////
        // 1. super init first
        this._super();
        this.setMouseEnabled(true);
        this.setTouchEnabled(true);
        this.setKeyboardEnabled(true);
        //cc.adjustSizeForWindow();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask director the window size
        var size = cc.Director.getInstance().getWinSize();

        // add a "close" icon to exit the progress. it's an autorelease object
        /*
        var closeItem = cc.MenuItemImage.create(
            "res/CloseNormal.png",
            "res/CloseSelected.png",
            function () {
                history.go(-1);
            },this);
        closeItem.setAnchorPoint(cc.p(0.5, 0.5));

        var menu = cc.Menu.create(closeItem, null);
        menu.setPosition(cc.PointZero());
        this.addChild(menu, 1);
        closeItem.setPosition(cc.p(size.width - 20, 20));
        // */

        /////////////////////////////
        // 3. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        //this.helloLabel = cc.LabelTTF.create("Box2D", "Arial", 38);
        // position the label on the center of the screen
        //this.helloLabel.setPosition(cc.p(size.width / 2, size.height - 100));
        // add the label as a child to this layer
        //this.addChild(this.helloLabel, 5);

        //var lazyLayer = new cc.LazyLayer();
        //this.addChild(lazyLayer);

        // add "Helloworld" splash screen"
        //this.sprite = cc.Sprite.create("res/HelloWorld.png");
        //this.sprite.setAnchorPoint(cc.p(0.5, 0.5));
        //this.sprite.setPosition(cc.p(size.width / 2, size.height / 2));

        var debugLayer = document.getElementById("debugDraw");
        //lazyLayer.addChild(this.sprite, 0);
        //lazyLayer.adjustSizeForCanvas();

        this.box2dInit();

        this.crosshair = cc.Sprite.create("res/temp_crosshair.png");
        this.crosshair.setAnchorPoint(cc.p(0.5, 0.5));
        this.crosshair.setPosition(cc.p(size.width, size.height/2));
        this.addChild(this.crosshair);

        playerBody = this.addPhyisicsObject({
            height: 1.63,
            x: 2,
            y: 2
        });
        GameManager.player = new Y2Actor;
        GameManager.player.fixture = playerBody;
        GameManager.player.init(this);
        this.scheduleUpdate();
        return true;
    },

    update: function(dt){
    },
    
    onKeyUp: function(key){
        GameManager.keysDown.splice(
                GameManager.keysDown.indexOf(key),
                1);
    },

    onKeyDown:function(key){
        if(GameManager.keysDown.indexOf(key) < 0)
            GameManager.keysDown.push(key);
    },

    onTouchesEnded:function(pTouch, pEvent){
    },

    onTouchesMoved: function(pTouch, pEvent){
        if(this.crosshair === undefined) return;
        touch = pTouch[0].getLocation();
            this.crosshair.setPosition(touch.x, touch.y);
    },

    onMouseDown: function(evt){
        GameManager.isMouseDown = true;
    },

    onMouseUp: function(evt){
        GameManager.isMouseDown = false;
    },

    onMouseMoved: function(evt){
        if(this.crosshair === undefined) return;
        touch = evt.getLocation();
            this.crosshair.setPosition(touch.x, touch.y);
    },

    box2dInit:function()  {

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
        ,   b2Listener = Box2D.Dynamics.b2ContactListener
        ;

     var playerListener = new b2Listener;
     playerListener.BeginContact = function(contact){
        contact.GetFixtureA().GetBody().SetLinearDamping(5);   
     }
     playerListener.EndContact = function(contact){
        contact.GetFixtureA().GetBody().SetLinearDamping(0);
     }

     world = new b2World(
           new b2Vec2(0, 10)    //gravity
        ,  true                 //allow sleep
     );
     world.SetContactListener(playerListener);
     this.world = world; 
     var fixDef = new b2FixtureDef;
     fixDef.density = 1.0;
     fixDef.friction = 1;
     fixDef.restitution = 0;
     
     var bodyDef = new b2BodyDef;
     
     //create ground and ceiling
     var size = cc.Director.getInstance().getWinSize();
     bodyDef.type = b2Body.b2_staticBody;
     bodyDef.position.x = 0;
     bodyDef.position.y = size.height/this.ptmRatio;
     fixDef.shape = new b2PolygonShape;
     fixDef.shape.SetAsBox(size.width/this.ptmRatio, 0.5);
     world.CreateBody(bodyDef).CreateFixture(fixDef);
     bodyDef.position.y = 0.25;
     world.CreateBody(bodyDef).CreateFixture(fixDef);   
     //setup debug draw
     var debugDraw = new b2DebugDraw();
        //debugDraw.SetSprite(displayList.debug.getContext("2d"));
        debugDraw.SetSprite(document.getElementById("debugDraw").getContext("2d"));
        debugDraw.SetDrawScale(this.ptmRatio);
        debugDraw.SetFillAlpha(0.3);
        debugDraw.SetLineThickness(1.0);
        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        world.SetDebugDraw(debugDraw);
    
     GameManager.world = world; 
     window.setInterval(this.box2dStep, 1000 / 60);
    },
    
    addPhyisicsObject: function(parameters){
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
            ;
        var fixDef = new b2FixtureDef;
        var bodyDef = new b2BodyDef;

        bodyDef.type = b2Body.b2_dynamicBody;
        fixDef.shape = new b2PolygonShape;
        fixDef.density = 1.0;
        fixDef.restitution = 0.1;
        
        fixDef.shape.SetAsBox(
            parameters.height/2,
            parameters.height
        );
        bodyDef.position.x = parameters.x;
        bodyDef.position.y = (cc.Director.getInstance().getWinSize().height/this.ptmRatio) - parameters.y;
        return this.world.CreateBody(bodyDef).CreateFixture(fixDef); 
    },

    box2dStep:function() {
        world.Step(
           1 / 60   //frame-rate
           ,  10       //velocity iterations
           ,  10       //position iterations
        );
        world.DrawDebugData();
        world.ClearForces();
    } 

});

var Box2DScene = cc.Scene.extend({
    layer: null,

    onEnter:function () {
        this._super();
        this.layer = new Box2DTest();
        this.addChild(this.layer);
        this.layer.init();
        GameManager.currentScene = this;
    }
});
