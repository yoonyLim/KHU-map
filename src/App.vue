<script setup>
    import { onMounted, ref } from "vue";
    import { Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, SphereGeometry, WebGLRenderer } from "three"
    import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

    const canvas = ref(null)

    // scene where everything takes place
    const scene = new Scene()

    // camera to view the scene
    const camera = new PerspectiveCamera(
        75, 
        window.innerWidth / window.innerHeight, 
        0.1, 
        1000
    );

    camera.position.z = 5;

    scene.add(camera)

    // mesh
    const sphere = new Mesh(
        new SphereGeometry(1, 20, 20),
        new MeshBasicMaterial({
            color: 0x008080
        })
    );

    scene.add(sphere);

    // labels for mesh
    const sphereDiv = document.createElement('div');
    sphereDiv.className = "label";
    sphereDiv.textContent = "Sphere";
    sphereDiv.style.backgroundColor = "transparent";

    const sphereLabel = new CSS2DObject(sphereDiv);
    sphereLabel.position.set(1.5 * 20, 0, 0);
    sphereLabel.center.set(0, 0);
    sphere.add(sphereLabel);
    sphereLabel.layers.set(0);

    onMounted(() => {
        // set renderer to render the scene
        const renderer = new WebGLRenderer({
            canvas: canvas.value,
            antialias: true
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        renderer.render(scene, camera);

        // set label renderer to render label
        const labelRenderer = new CSS2DRenderer();
        labelRenderer.setSize(window.innerWidth, window.innerHeight);
        labelRenderer.domElement.style.position = "absolute";
        labelRenderer.domElement.style.top = "0px";

        labelRenderer.render(scene, camera);
    })
</script>

<template>
    <canvas ref="canvas" />
</template>

<style>
</style>