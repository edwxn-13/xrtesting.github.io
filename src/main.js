import * as BABYLON from '@babylonjs/core';

const canvas = document.getElementById('renderCanvas');

const engine = new BABYLON.Engine(canvas);


const createScene = async function () {

    // Creates a basic Babylon Scene object (non-mesh)

    const scene = new BABYLON.Scene(engine);

    // Creates and positions a free camera (non-mesh)

    const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 1, -5), scene);

    // Cargets the camera to scene origin

    camera.setTarget(BABYLON.Vector3.Zero());

    // Attaches the camera to the canvas

    camera.attachControl(canvas, true);

    // Creates lights

    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    light.intensity = 10;

    const dirLight = new BABYLON.DirectionalLight("dirlight", new BABYLON.Vector3(0, -1, 0), scene);

    dirLight.position = new BABYLON.Vector3(0, 5, -5);

    // AR availability check and GUI in non-AR mode

    const arAvailable = await BABYLON.WebXRSessionManager.IsSessionSupportedAsync('immersive-ar');

    const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(

        "FullscreenUI"

    );

    const rectangle = new BABYLON.GUI.Rectangle("rect");

    rectangle.background = "black";

    rectangle.color = "blue";

    rectangle.width = "80%";

    rectangle.height = "50%";

    advancedTexture.addControl(rectangle);

    const nonXRPanel = new BABYLON.GUI.StackPanel();

    rectangle.addControl(nonXRPanel);

    const text1 = new BABYLON.GUI.TextBlock("text1");

    text1.fontFamily = "Helvetica";

    text1.textWrapping = true;

    text1.color = "white";

    text1.fontSize = "14px";

    text1.height = "400px"

    text1.paddingLeft = "10px";

    text1.paddingRight = "10px";

    if (!arAvailable) {

        text1.text = "AR is not available in your system. Please make sure you use a supported device such as a Meta Quest 3 or a modern Android device and a supported browser like Chrome.\n \n Make sure you have Google AR services installed and that you enabled the WebXR incubation flag under chrome://flags";

        nonXRPanel.addControl(text1);

        return scene;

    } else {

        text1.text = "WebXR Demo: Gaussian Splat Object.\n \n Please enter AR with the button on the lower right corner to start. Once in AR, look at the floor for a few seconds (and move a little): the hit-testing ring will appear. Then click anywhere on the screen...";

        nonXRPanel.addControl(text1);

    }

    // Create the WebXR Experience Helper for an AR Session (it initializes the XR scene, creates an XR Camera, 

    // initialize the features manager, create an HTML UI button to enter XR,...)

    const xr = await scene.createDefaultXRExperienceAsync({

        uiOptions: {

            sessionMode: "immersive-ar",

            referenceSpaceType: "local-floor",

            onError: (error) => {

                alert(error);

            }

        },

        optionalFeatures: true

    });

    //Hide GUI in AR mode

    xr.baseExperience.sessionManager.onXRSessionInit.add(() => {

        rectangle.isVisible = false;

    })

    xr.baseExperience.sessionManager.onXRSessionEnded.add(() => {

        rectangle.isVisible = true;

    })


    //Get the Feature Manager and from it the HitTesting fearture and the xrcamera

    const fm = xr.baseExperience.featuresManager;

    const xrTest = fm.enableFeature(BABYLON.WebXRHitTest.Name, "latest");

    const xrCamera = xr.baseExperience.camera


    //Create a marker that will be used to represent the hitTest position

    const marker = BABYLON.MeshBuilder.CreateTorus('marker', { diameter: 0.15, thickness: 0.05, tessellation: 32 });

    marker.isVisible = false;

    marker.rotationQuaternion = new BABYLON.Quaternion();

    const matStd = new BABYLON.StandardMaterial("matstd", scene);

    matStd.diffuseTexture = new BABYLON.Texture("textures/albedo.png", scene);

    matStd.diffuseTexture.uScale = .5;

    matStd.diffuseTexture.vScale = .5;

    marker.material = matStd;


    //Update the position/rotation of the marker with HitTest information

    let hitTest;

    xrTest.onHitTestResultObservable.add((results) => {

        if (results.length) {

            marker.isVisible = true;

            hitTest = results[0];

            hitTest.transformationMatrix.decompose(undefined, marker.rotationQuaternion, marker.position);

        } else {

            marker.isVisible = false;

            hitTest = undefined;

        }

    });

    // Load Object, a Gaussian Splatting mesh

    const gs = new BABYLON.GaussianSplattingMesh("Rug", null, scene);

    gs.loadFileAsync("https://thomlucc.github.io/Assets/gsFluffyRug.splat").then(()=>{

        gs.isVisible = false;

        gs.scaling.scaleInPlace(.4);

        gs.rotationQuaternion = new BABYLON.Quaternion();

    });



    let objectAppearded = false;


    scene.onPointerDown = (evt, pickInfo) => {

        if (hitTest && xr.baseExperience.state === BABYLON.WebXRState.IN_XR && !objectAppearded) {

            objectAppearded = true;

            //Make the Gaussian splat object visible and move it to hitTest position

            gs.isVisible = true;

            hitTest.transformationMatrix.decompose(undefined, gs.rotationQuaternion, gs.position);

        }

    }

    //Rendering loop 

    scene.onBeforeRenderObservable.add(() => {

        marker.isVisible = !objectAppearded;

    });

    return scene;

};

const scene = await createScene();
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