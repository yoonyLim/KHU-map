<script setup>
    import { Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, SphereGeometry, WebGLRenderer } from "three"
import { onMounted, ref } from "vue";

    const app = ref(null)

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

    const sphere = new Mesh(
        new SphereGeometry(1, 20, 20),
        new MeshBasicMaterial({
            color: 0x008080
        })
    );

    scene.add(sphere);

    onMounted(() => {
        // set renderer to render the scene
        const renderer = new WebGLRenderer({
            canvas: app.value,
            // canvas: document.querySelector("app"),
            antialias: true
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        // document.body.appendChild( renderer.domElement );

        renderer.render(scene, camera);
    })
</script>

<template>
    <canvas ref="app" />
</template>

<style>
</style>