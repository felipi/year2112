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
    helloImg:null,
    helloLabel:null,
    circle:null,
    sprite:null,
    world:null,

    init:function () {
        var selfPointer = this;

        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask director the window size
        var size = cc.Director.getInstance().getWinSize();

        // add a "close" icon to exit the progress. it's an autorelease object
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

        /////////////////////////////
        // 3. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        this.helloLabel = cc.LabelTTF.create("Box2D", "Arial", 38);
        // position the label on the center of the screen
        this.helloLabel.setPosition(cc.p(size.width / 2, size.height - 100));
        // add the label as a child to this layer
        this.addChild(this.helloLabel, 5);

        var lazyLayer = new cc.LazyLayer();
        this.addChild(lazyLayer);

        // add "Helloworld" splash screen"
        this.sprite = cc.Sprite.create("res/HelloWorld.png");
        this.sprite.setAnchorPoint(cc.p(0.5, 0.5));
        this.sprite.setPosition(cc.p(size.width / 2, size.height / 2));

        lazyLayer.addChild(this.sprite, 0);
        lazyLayer.adjustSizeForCanvas();
        window.addEventListener("resize", function (event) {
            lazyLayer.adjustSizeForCanvas();
        });

        this.box2dInit();
        return true;
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
        ;
     
     world = new b2World(
           new b2Vec2(0, 10)    //gravity
        ,  true                 //allow sleep
     );
     
     var fixDef = new b2FixtureDef;
     fixDef.density = 1.0;
     fixDef.friction = 0.5;
     fixDef.restitution = 0.2;
     
     var bodyDef = new b2BodyDef;
     
     //create ground
     bodyDef.type = b2Body.b2_staticBody;
     bodyDef.position.x = 0;
     bodyDef.position.y = 13;
     fixDef.shape = new b2PolygonShape;
     fixDef.shape.SetAsBox(10, 0.1);
     world.CreateBody(bodyDef).CreateFixture(fixDef);
     
     //create some objects
     bodyDef.type = b2Body.b2_dynamicBody;
     for(var i = 0; i < 10; ++i) {
        if(Math.random() > 0.5) {
           fixDef.shape = new b2PolygonShape;
           fixDef.shape.SetAsBox(
                 Math.random() + 0.1 //half width
              ,  Math.random() + 0.1 //half height
           );
        } else {
           fixDef.shape = new b2CircleShape(
              Math.random() + 0.1 //radius
           );
        }
        bodyDef.position.x = Math.random() * 10;
        bodyDef.position.y = Math.random() * 10;
        world.CreateBody(bodyDef).CreateFixture(fixDef);
     }
     
     //setup debug draw
     var debugDraw = new b2DebugDraw();
        //debugDraw.SetSprite(displayList.debug.getContext("2d"));
        debugDraw.SetSprite(document.getElementById("debugDraw").getContext("2d"));
        debugDraw.SetDrawScale(12.0);
        debugDraw.SetFillAlpha(0.3);
        debugDraw.SetLineThickness(1.0);
        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        world.SetDebugDraw(debugDraw);
     
     window.setInterval(this.box2dStep, 1000 / 60);
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
    onEnter:function () {
        this._super();
        var layer = new Box2DTest();
        this.addChild(layer);
        layer.init();
    }
});
