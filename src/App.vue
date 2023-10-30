<script setup>
    import { computed, onMounted, onUnmounted, ref, watch } from "vue";
    import { Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer, DirectionalLight, AxesHelper, BoxGeometry, SphereGeometry, Clock } from "three"
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
    import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

    const canvas = ref(null)

    // declaration for universal usage
    let renderer;
    let camera;
    let controls;

    // scene where everything takes place
    const scene = new Scene();

    let aspectRatio = computed(() => window.innerWidth / window.innerHeight);

    // camera to view the scene
    camera = new PerspectiveCamera(
        75, 
        aspectRatio.value, 
        0.1, 
        1000
    );
    camera.position.z = 5;
    // camera.layers.enableAll();
    scene.add(camera)

    const dirLight = new DirectionalLight( 0xffffff, 3 );
    dirLight.position.set( 0, 0, 1 );
    dirLight.layers.enableAll();
    scene.add(dirLight);

    // axes for positioning
    const axesHelper = new AxesHelper( 5 );
    axesHelper.layers.enableAll();
    scene.add(axesHelper);

    // mesh
    const cube = new Mesh(
        new BoxGeometry(1, 1, 1),
        new MeshBasicMaterial({
            color: 0x008080
        })
    );

    const sphere = new Mesh(
        new SphereGeometry(0.2, 16, 16),
        new MeshBasicMaterial({
            color: 0x008080
        })
    )

    scene.add(cube);
    scene.add(sphere);

    // labels for mesh
    const cubeDiv = document.createElement('div');
    cubeDiv.className = "label";
    cubeDiv.textContent = "Cube";
    cubeDiv.style.backgroundColor = "transparent";

    const cubeLabel = new CSS2DObject(cubeDiv);
    cubeLabel.position.set(1.5 * 10, 0, 0);
    cubeLabel.center.set(0, 1);
    cube.add(cubeLabel);
    cubeLabel.layers.set(1);

    const clock = new Clock();

    const loop = () => {
        renderer.render(scene, camera);
        controls.update();

        // rotate animation
        cube.rotation.y += 0.01;
        cube.rotation.x += 0.01;
        const elapsed = clock.getElapsedTime();
        sphere.position.set( Math.sin( elapsed ) * 3, 0, Math.cos( elapsed ) * 3 );
        requestAnimationFrame(loop);
    }
    
    onMounted(() => {
        // set renderer to render the scene
        renderer = new WebGLRenderer({
            canvas: canvas.value,
            antialias: true
        });

        // for initial size
        updateSize();

        // for window to listen to resize and update the size
        window.addEventListener("resize", updateSize);

        // set label renderer to render label
        const labelRenderer = new CSS2DRenderer();
        labelRenderer.setSize(window.innerWidth, window.innerHeight);
        labelRenderer.domElement.style.position = "absolute";
        labelRenderer.domElement.style.top = "0px";
        document.body.appendChild(labelRenderer.domElement);

        // labelRenderer가 canvas 위에 덮이기 때문에 labelRenderer를 통해서 컨트롤 가능
        controls = new OrbitControls(camera, labelRenderer.domElement);
        controls.enableDamping = true;
        controls.minDistance = 3;
        controls.maxDistance = 50;

        labelRenderer.render(scene, camera);

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
        console.log(window.innerWidth);
    }

    // watch for window size change and call functions
    watch(aspectRatio, updateSize);
</script>

<template>
    <canvas ref="canvas" />
</template>

<style>
</style>