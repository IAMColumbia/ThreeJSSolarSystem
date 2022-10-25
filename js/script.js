import * as THREE from "three"
import { DefaultLoadingManager } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js"

    var width = window.innerWidth - 20;
    var height = window.innerHeight - 50;
    
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(50, width / height, .1, 1000);
    camera.position.z = 6;
    camera.updateProjectionMatrix();

    const renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setClearColor("#00000");
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);

    const orbit = new OrbitControls(camera, renderer.domElement);

    window.addEventListener("newSize", () => {
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    })
    
    var light = new THREE.PointLight(0xFFFFFF, 1, 500);
    light.position.set(0, 0, 0);
    scene.add(light);

    var sunGeo = new THREE.SphereGeometry( .5, 100, 100 );
    var sunGeoOriginal = new THREE.SphereGeometry( .5, 100, 100 );
    var sunMat = new THREE.MeshBasicMaterial({color : 0xf5f542});
    var sunMesh = new THREE.Mesh(sunGeo, sunMat);
    var sunMeshOriginal = new THREE.Mesh(sunGeoOriginal, sunMat);
    scene.add(sunMesh);

    
    var planetPivots = new Array(9);
    var planetGeos = new Array(9);
    var planetMats = new Array(9);
    var planets = new Array(9);
    var planetSpeeds = new Array(9);
    var radius = 0.5;
    var distance = 2.5;
    var planetColor = 0xf5f542;
    for(var i = 0; i < 9; i++)
    {
        switch(i)
        {
            case 0: //mercury
                radius = 0.05;
                planetColor = 0x575757;
                planetSpeeds[i] = 5;
                break;
            case 1: //venus
                radius = 0.1;
                planetColor = 0xffb759;
                planetSpeeds[i] = 3;
                break;
            case 2: //earth
                radius = 0.1;
                planetColor = 0x307cff;
                planetSpeeds[i] = 1;
                break;
            case 3: //mars
                radius = 0.05;
                planetColor = 0xff3f05;
                planetSpeeds[i] = 0.5;
                break;
            case 4: //jupiter
                radius = 0.25;
                planetColor = 0xffba30;
                planetSpeeds[i] = 0.25;
                break;
            case 5: //saturn
                radius = 0.18;
                planetColor = 0xffe730;
                planetSpeeds[i] = 0.2;
                break;
            case 6: //uranus
                radius = 0.1;
                planetColor = 0x6a38ff;
                planetSpeeds[i] = 0.1;
                break;
            case 7: //neptune
                radius = 0.1;
                planetColor = 0x4c00cf;
                planetSpeeds[i] = 0.05;
                break;
            case 8: //pluto
                radius = 0.05;
                planetColor = 0x575757;
                planetSpeeds[i] = 0.025;
                break;               
        }
        planetGeos[i] = new THREE.SphereGeometry(radius, 50, 50);
        planetMats[i] = new THREE.MeshStandardMaterial({color : planetColor});
        planets[i] = new THREE.Mesh(planetGeos[i], planetMats[i]);
        planets[i].position.x = distance * i;
        planetPivots[i] = new THREE.Object3D(0,0,0);
        scene.add(planetPivots[i]);
        planetPivots[i].add(planets[i]);
    }

    var ringMat = new THREE.MeshBasicMaterial({color : 0xad9d63})

    for(var i = 0; i < 3; i++)
    {
        //rings
        var ringGeo = new THREE.TorusGeometry(0.4 + (0.5 * (i * 0.1)), 0.01, 50, 50, Math.PI * 2);
        var ring = new THREE.Mesh(ringGeo, ringMat);
        //ring.position = planets[4].position;
        ring.position.x = planets[4].position.x;
        planetPivots[4].add(ring);
        ring.rotation.x = Math.PI / 2;
    }

    const starURL = new URL("../assets/star.glb", import.meta.url);
    const assetLoader = new GLTFLoader();
    assetLoader.load
    (
        starURL.href,
        function(gltf)
        {
            const model = gltf.scene;
            scene.add(model);
            model.position.set(0, 3, 0);
        },
        undefined,
        function(error)
        {
            console.error(error);
        }
    );

    function animate(time)
    {
        for(var i = 0; i < sunMeshOriginal.geometry.attributes.position.array.length; i++)
        {
            sunMesh.geometry.attributes.position.array[i] = sunMeshOriginal.geometry.attributes.position.array[i] + (0.1 * (Math.random() - Math.random()));
        }
        for(var i = 0; i < planetPivots.length; i++)
        {
            planetPivots[i].rotation.y = ((time * planetSpeeds[i]) / 1000);
            planets[i].rotation.y = ((time * planetSpeeds[i]) / 1000);
        }
        sunMesh.geometry.attributes.position.needsUpdate = true;
        sunMesh.rotation.y = time / 1000;
        renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(animate);