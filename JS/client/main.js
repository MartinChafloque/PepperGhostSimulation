import * as THREE from './threejs/three.module.js'

const socket = io()

let anterior = 0;

function init(){

    var windowWidth  = window.innerWidth * window.devicePixelRatio;
	var windowHeight  = window.innerHeight * window.devicePixelRatio;
    //Escena
    var scene = new THREE.Scene();
    var renderer = new THREE.WebGLRenderer();
    scene.background = new THREE.Color(0x000000);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('contenedor').appendChild(renderer.domElement)

    var views = [
		{ 
			left: 0,
			bottom: 0.3,
			width: 0.3,
			height: 0.3,
			background: { r: 0.0, g: 0.0, b: 0.0, a: 1 },
			eye: [ 0, 300, 1800 ],
			up: [ 0, 1, 0 ],
			fov: 10,
			angle : 0,
			rotation: 33.75
		},
		{ 
			left: 0,
			bottom: 0,
			width: 0.3,
			height: 0.3,
			background: { r: 0.0, g: 0.0, b: 0.0, a: 1 },
			eye: [ 0, 300, 1800 ],
			up: [ 0, 1, 0 ],
			fov: 10,
			angle: 90,
			rotation: 101.25
		},
		{ 
			left: 0.185,
			bottom: 0,
			width: 0.3,
			height: 0.3,
			background: { r: 0.0, g: 0.0, b: 0.0, a: 1 },
			eye: [ 0, 300, 1800 ],
			up: [ 0, 1, 0 ],
			fov: 10,
			angle: 180,
			rotation: -101.25
		},
		{ 
			left: 0.185,
			bottom: 0.3,
			width: 0.3,
			height: 0.3,
			background: { r: 0.0, g: 0.0, b: 0.0, a: 1 },
			eye: [ 0, 300, 1800 ],
			up: [ 0, 1, 0 ],
			fov: 10,
			angle: 270,
			rotation: 101.25
		}
	];

      //Geometria
      const geometry = new THREE.SphereGeometry( 12, 12, 12 );
      const material = new THREE.MeshBasicMaterial( { color: 0x0000ff, wireframe: true });
      const sphere = new THREE.Mesh( geometry, material );
  
      scene.add(sphere)

	//add cameras
    for (var i =  0; i < views.length; i++ ) {
        var view = views[i];
        var camera = new THREE.PerspectiveCamera( view.fov, windowWidth / windowHeight, 1, 10000 );
        camera.position.x = view.eye[ 0 ];
        camera.position.y = view.eye[ 1 ];
        camera.position.z = view.eye[ 2 ];
        camera.up.x = view.up[ 0 ];
        camera.up.y = view.up[ 1 ];
        camera.up.z = view.up[ 2 ];
        view.camera = camera;
    }

    var cameraRadius = 290
	var rotateY = 90, rotateX = 0, curY = 0

    function render(){
        socket.on('datos-giro', function(datos){
            //document.getElementById('datos').innerHTML = datos
			let numeros = datos.split(": ")
			if(numeros[0] == "x"){
				if(numeros[1] > anterior){
					sphere.rotation.x += 0.1;
				}
				if(numeros[1] < anterior){
					sphere.rotation.x -= 0.1;
				}
				anterior = numeros[1]
			}
			if(numeros[0] == "y"){
				if(numeros[1] > anterior){
					sphere.rotation.y += 0.1;
				}
				if(numeros[1] < anterior){
					sphere.rotation.y -= 0.1;
				}
				anterior = numeros[1]
			}
			if(numeros[0] == "z"){
				if(numeros[1] > anterior){
					sphere.rotation.z += 0.1;
				}
				if(numeros[1] < anterior){
					sphere.rotation.z -= 0.1;
				}
				anterior = numeros[1]
			}
        })
        //for each view
			for (var i =  0; i < views.length; i++ ) {
				//grab each view
				var view = views[i]
		
				//grab each camera
				var camera = view.camera;
				
				
				//Adjust camera within 3D spherical coordinates
				camera.position.x = sphere.position.x + cameraRadius * Math.sin(rotateY * Math.PI/180) * Math.cos(view.angle * Math.PI/180)
				camera.position.z = sphere.position.y + cameraRadius * Math.sin(rotateY * Math.PI/180) * Math.sin(view.angle * Math.PI/180)
				camera.position.y = sphere.position.z + cameraRadius * Math.cos(rotateY * Math.PI/180)
				camera.lookAt(scene.position)
                
				//Set rotation of camera on Z-Axis
				camera.rotation.z= view.rotation - Math.PI;
				
				//Grab view ports
				var left   = Math.floor( windowWidth  * view.left );
				var bottom = Math.floor( windowHeight * view.bottom );
				var width  = Math.floor( windowWidth  * view.width );
				var height = Math.floor( windowHeight * view.height );
		
				//Render
				renderer.setViewport( left, bottom, width, height );
				renderer.setScissor( left, bottom, width, height );
				renderer.setScissorTest ( true );
				renderer.setClearColor( view.background, view.background.a );
				
				renderer.render(scene, camera)
			}
    }
     
    function animate(){
        render();
        
        requestAnimationFrame( animate );
    }    
  
    animate();

}

init()