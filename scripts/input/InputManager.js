var STInputManager = {
    keys_pressed: [],
    touches: [],
    input_position: {x:0, y:0},
    is_touching: false,

    startup: function(){
        this.input_position = {x:0, y:0};
    },

    begin: function(event){
        this.is_touching = true;
        this.touches = event.originalEvent.touches;
        if(event.type == "touchbegin"){
            STInputManager.input_position.x = event.originalEvent.targetTouches[0].pageX;
            STInputManager.input_position.y = event.originalEvent.targetTouches[0].pageY;
        }else if(event.type == "mousedown"){
            STInputManager.input_position.x = event.pageX;
            STInputManager.input_position.y = event.pageY;
        }
    },

    move: function(event){
        event.preventDefault();
        if(event.type == "touchmove"){
            STInputManager.input_position.x = event.originalEvent.targetTouches[0].pageX;
            STInputManager.input_position.y = event.originalEvent.targetTouches[0].pageY;
        }else if(event.type == "mousemove"){
            STInputManager.input_position.x = event.pageX;
            STInputManager.input_position.y = event.pageY;
        }
        var new_event = document.createEvent("Event");
        new_event.initEvent("stinputmove", true, true);
        return this.dispatchEvent(new_event);
    },

    end: function(event){
        this.is_touching = false;
        this.touches = null;
    },

    addEventListener: function(event, callback){
       window.addEventListener(event, callback);
    }
}

$(document).ready(function(){
    $(document).bind("touchbegin", STInputManager.begin);
    $(document).bind("touchmove", STInputManager.move);
    $(document).bind("touchend", STInputManager.end);
    $(document).bind("mousedown", STInputManager.begin);
    $(document).bind("mousemove", STInputManager.move);
    $(document).bind("mouseup", STInputManager.end);
});
