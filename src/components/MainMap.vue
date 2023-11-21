<script setup>
    import { computed, onMounted, onUnmounted, ref, toRefs, watch } from "vue";
    import { Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer, DirectionalLight, AxesHelper, BoxGeometry, SphereGeometry, Clock, Color, AmbientLight, Vector2, Raycaster, Group } from "three"
    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
    import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
    import bldgList from '../assets/bldgList.json';

    const props = defineProps({
        query: String
    })

    // to use props value as local variable
    const query = toRefs(props).query;
    
    watch(query, () => {
        console.log(query.value)
    });

    const canvas = ref(null)

    // declaration for universal usage
    let labelRenderer;
    let renderer;
    let camera;
    let controls;

    // scene where everything takes place
    const scene = new Scene();
    scene.background = new Color(0xe0e0e0);

    let aspectRatio = computed(() => window.innerWidth / window.innerHeight);

    // camera to view the scene
    camera = new PerspectiveCamera(
        75, 
        aspectRatio.value, 
        0.1, 
        1000
    );
    camera.position.set(0, 50, -40);

    scene.add(camera)

    const dirLight = new DirectionalLight( 0xffffff, 3.0 );
    dirLight.position.set( 50, 50, 1 );
    scene.add(dirLight);

    const ambLight = new AmbientLight( 0xffffff, 0.5 );
    ambLight.position.set( 50, 50, 2);
    scene.add(ambLight);

    // axes for positioning
    const axesHelper = new AxesHelper( 5 );
    axesHelper.layers.enableAll();
    scene.add(axesHelper);

    // ground
    const ground = new Mesh(
        new BoxGeometry(1000, 10, 1000),
        new MeshBasicMaterial({
            color: 0xffffff
        })
    );

    ground.position.set(0, -5.2, 200);

    scene.add(ground);

    // group to hold all the object meshes in glb model
    const group = new Group();

    // add glb map to the scene
    const gltfLoader = new GLTFLoader();
    gltfLoader.load("src/assets/models/KHU.glb", (model) => {
        // change material color and add label for each building
        for (var bldg of bldgList.bldgs) {
            let bldgMesh = model.scene.getObjectByName(bldg.bldgName);

            console.log(bldg.bldgName + "'s position: (" + bldgMesh.position.x + ", " + bldgMesh.position.y + ", " + bldgMesh.position.z + ")");

            if (bldgMesh.material) {
                bldgMesh.material = bldgMesh.material.clone(); // make individual material for each building
                bldgMesh.material.color.setHex(0xfee9da);
            }

            group.add(bldgMesh);
        }

        scene.add(group);
        scene.add(model.scene);
    });

    // create p tag where each bldg's name will be shown
    const p = document.createElement('p');
    p.className = "label";
    const pContainer = document.createElement("div");
    pContainer.appendChild(p);
    const bldgLabel = new CSS2DObject(pContainer);
    scene.add(bldgLabel);

    const mousePos = new Vector2();
    const raycaster = new Raycaster();

    window.addEventListener("mousemove", (event) => {
        mousePos.x = (event.clientX / window.innerWidth) * 2 - 1;
        mousePos.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mousePos, camera);
        const intersects = raycaster.intersectObject(group);

        if (intersects.length > 0) {
            // console.log(intersects[0].object);
            p.className = "label show";
            p.textContent = intersects[0].object.name
            bldgLabel.position.set(intersects[0].object.position.x, intersects[0].object.position.y + 20, intersects[0].object.position.z);
        } else {
            p.className = "label hide";
        }
    })

    const loop = () => {
        renderer.render(scene, camera);
        labelRenderer.render(scene, camera);
        controls.update();

        requestAnimationFrame(loop);
    }
    
    onMounted(() => {
        // set renderer to render the scene
        renderer = new WebGLRenderer({
            canvas: canvas.value,
            antialias: true
        });
        labelRenderer = new CSS2DRenderer();

        // for initial size of the window
        updateSize();

        // for window to listen to resize and update the size
        window.addEventListener("resize", updateSize);

        // labelRenderer가 canvas 위에 덮이기 때문에 labelRenderer를 통해서 컨트롤 가능
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.03;
        controls.rotateSpeed = 2;
        controls.panSpeed = 2;
        controls.minDistance = 3;
        controls.maxDistance = 200;
        controls.maxPolarAngle = (Math.PI / 2) - 0.1;

        // constantly render by frame to keep ratio constant
        loop();
    })

    onUnmounted(() => {
        window.removeEventListener("resize", updateSize);
    })

    // function to be called when window is resiszed
    function updateSize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        // set label renderer to render label
        labelRenderer.setSize(window.innerWidth, window.innerHeight);
        labelRenderer.domElement.style.position = "absolute";
        labelRenderer.domElement.style.top = "0px";
        labelRenderer.domElement.style.pointerEvents = "none"; // since labelRendere is on top of canvas, it needs to have no event to be able to orbit control
        document.body.appendChild(labelRenderer.domElement);
    }

    // watch for window size change and call functions to resize canvas ratio
    watch(aspectRatio, updateSize);
</script>

<template>
    <canvas ref="canvas" />
</template>

<style>
.label {
    background-color: black;
    color: white;
    padding: 10px;
    position: relative;
    transform: translateY(-10px);
    opacity: 0;
    transition-duration: 0.2s;
    transition-property: opacity, transform;
}

.label::after {
    position: absolute;
    content: '';
    width: 20px;
    height: 20px;
    background-color: black;
    top: 90%;
    left: 50%;
    transform: rotateZ(45deg) translateX(-50%);
    z-index: -1;
}

.hide {
    opacity: 0;
    transform: translateY(-10px);
}

.show {
    opacity: 1;
    transform: translateY(0px);
}
</style>