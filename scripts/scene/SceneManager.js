var STSceneManager = {
	current_scene: null,
	scene_queue: [],
	loadScene: function(scene_name) {
		if(STSceneManager.current_scene == null){
			scene = $(".scene_layer");
			STSceneManager.scene_queue.push(scene);
		}
		STSceneManager.current_scene = STSceneManager.scene_queue.pop()
		file = scene_name + ".html";
		var scene_content = $("<div/>", {class: "scene_layer"});
		scene_content.css("display", "none");
		scene_content.load(file +  " #scene_contents");		
		$("#scene_container").append(scene_content);
		
		STSceneManager.scene_queue.push(scene_content);
		scene_content.fadeIn(400);
		STSceneManager.current_scene.fadeOut(400);
	}
}
