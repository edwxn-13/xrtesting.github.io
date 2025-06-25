import * as BABYLON from '@babylonjs/core';

const canvas = document.getElementById('renderCanvas');

const engine = new BABYLON.Engine(canvas);


const createScene = function()
{
    const scene = new BABYLON.Scene(engine);

    var camera = new BABYLON.DeviceOrientationCamera("cam1", new BABYLON.Vector3(0, 1, -5), scene);
    camera.setTarget(new BABYLON.Vector3(0,0,0));
    camera.attachControl(canvas, true);

    var light = new BABYLON.HemisphericLight("lightjemi", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 1.4;

    var ground = new BABYLON.MeshBuilder.CreateGroundFromHeightMap("hey", "/assets/snowdon.png", 
        
        {
            width: 5,
            height: 5,
            subdivisions:30,
        }
    );    

    const groundMat = new BABYLON.StandardMaterial();
    groundMat.wireframe = true;
    ground.material = groundMat;


    return scene;   
};

const scene = createScene();
alert("no");

engine.runRenderLoop(function() 
{
    console.log("adgadsg");
    scene.render();
});

window.addEventListener('resize', function()
{
    engine.resize();
});