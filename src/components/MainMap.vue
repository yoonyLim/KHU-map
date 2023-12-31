<script setup>
    import { computed, onMounted, onUnmounted, ref, toRefs, watch } from "vue";
    import { useRouter } from "vue-router";
    import { Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer, DirectionalLight, BoxGeometry, Color, AmbientLight, Vector2, Raycaster, Group, Box3, Vector3, LoadingManager } from "three"
    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
    import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
    import gsap from 'gsap';
    import bldgList from '../assets/bldgList.json';

    const props = defineProps({
        query: String
    })

    // to use props value as local variable
    const query = toRefs(props).query;
    
    watch(query, () => {
        for (var bldgMesh of group.children) {
            if (bldgMesh.name == query.value) {
                moveCamera(bldgMesh);
                break;
            }
        }
    });

    const isBldgClicked = ref(false);
    const selectedBldg = ref(null);

    const canvas = ref(null);

    // declaration for universal usage
    let labelRenderer;
    let renderer;
    let camera;
    let controls;
    const idleColor = 0xadd8e6;
    const selectedColor = 0xff7f7f;

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
    // const axesHelper = new AxesHelper( 5 );
    // axesHelper.layers.enableAll();
    // scene.add(axesHelper);

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

    // map loading manager
    const progressBar = ref(null);
    const loadedPercent = ref(0);

    const loadingManager = new LoadingManager();

    loadingManager.onProgress = function(url, loaded, total) {
        progressBar.value.value = (loaded / total) * 100;
        loadedPercent.value = (loaded / total) * 100;
    }

    const isMapLoaded = ref(false);

    loadingManager.onLoad = function() {
        isMapLoaded.value = true;
    }

    // add glb map to the scene
    const gltfLoader = new GLTFLoader(loadingManager);
    gltfLoader.load("./src/assets/models/KHU.glb", (model) => {
        // change material color and add label for each building
        for (var bldg of bldgList.bldgs) {
            let bldgMesh = model.scene.getObjectByName(bldg.bldgName);

            if (bldgMesh.material) {
                bldgMesh.material = bldgMesh.material.clone(); // make individual material for each building
                bldgMesh.material.color.setHex(idleColor);
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

    // if mouse is hovered onto a bldg, show label and change color
    window.addEventListener("mousemove", (event) => {
        mousePos.x = (event.clientX / window.innerWidth) * 2 - 1;
        mousePos.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mousePos, camera);
        const intersects = raycaster.intersectObject(group);

        if (intersects.length == 1) {
            p.textContent = intersects[0].object.name;
            p.className = "label show";
            intersects[0].object.material.color.setHex(selectedColor);
            bldgLabel.position.set(intersects[0].object.position.x, intersects[0].object.position.y + 20, intersects[0].object.position.z);
        } else if (intersects.length > 1) {
            for (var bldgMesh of group.children) {
                bldgMesh.material.color.setHex(idleColor);
            }
            intersects[0].object.material.color.setHex(selectedColor);
            p.textContent = intersects[0].object.name;
            p.className = "label show";
            bldgLabel.position.set(intersects[0].object.position.x, intersects[0].object.position.y + 20, intersects[0].object.position.z);
        } else {
            for (bldgMesh of group.children) {
                bldgMesh.material.color.setHex(idleColor);
            }
            p.className = "label hide";
        }
    });

    // emit to parent to hide search bar when bldg selected/deselected
    const emit = defineEmits(["searchQuery", "isBldgSelected"]);

    // move camera to the selected bldg and emit
    window.addEventListener("mousedown", (event) => {
        mousePos.x = (event.clientX / window.innerWidth) * 2 - 1;
        mousePos.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mousePos, camera);
        const intersects = raycaster.intersectObject(group);

        if (intersects.length > 0) {
            moveCamera(intersects[0].object);
            isBldgClicked.value = true;
            selectedBldg.value = intersects[0].object;
            emit("isBldgSelected", true);
        }
    });

    function moveCamera(obj) {
        const boundBox = new Box3().setFromObject( obj );
        const objCenter = boundBox.getCenter( new Vector3() );
        const objSize = boundBox.getSize( new Vector3() );

        if (["애지원", "외국어대학관", "국제-경영대학관", "학생회관", "예술-디자인대학관", "한방재료가공-경희보감", "한방재료가공-경희보감1"].includes(obj.name)) {
            gsap.to(camera.position, {
                x: objCenter.x + 20,
                y: objCenter.y + 20,
                z: objCenter.z + objSize.z + 20,
                duration: 2,
                ease: "power3.out"
            });
        } else if (["정문", "도예관", "국제학관", "전자정보-응용과학대학관"].includes(obj.name)) {
            gsap.to(camera.position, {
                x: objCenter.x + 20,
                y: objCenter.y + 20,
                z: objCenter.z - objSize.z - 20,
                duration: 2,
                ease: "power3.out"
            });
        } else if (["우정원", "멀티미디어관-글로벌관", "제2기숙사-여자동", "제2기숙사-남자동", "선승관", "중앙도서관"].includes(obj.name)) {
            gsap.to(camera.position, {
                x: objCenter.x + 50,
                y: objCenter.y + 20,
                z: objCenter.z,
                duration: 2,
                ease: "power3.out"
            });
        } else {
            gsap.to(camera.position, {
                x: objCenter.x - 50,
                y: objCenter.y + 20,
                z: objCenter.z,
                duration: 2,
                ease: "power3.out"
            });
        }

        gsap.to(controls.target, {
            x: objCenter.x,
            y: objCenter.y,
            z: objCenter.z,
            duration: 2,
            ease: "power3.out",
            onStart: () => { controls.enabled = false },
            onComplete: () => { controls.enabled = true }
        });
    }

    // toggle on and off the sidebar
    const sidebar = ref("");

    watch(sidebar, () => {
        if (sidebar.value) {
            sidebar.value.addEventListener("focusout", () => {
                isBldgClicked.value = false;
                emit("isBldgSelected", false);
            })
        }
    });

    // route to next
    const router = useRouter();

    function pushPath(bldgName) {
        router.push({ name: "bldg-map-bldg", params: { bldg: bldgName }});
    }

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
        controls.dampingFactor = 0.5;
        controls.rotateSpeed = 2;
        controls.panSpeed = 2;
        controls.minDistance = 5;
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
        labelRenderer.domElement.style.zIndex = "10";
        labelRenderer.domElement.style.pointerEvents = "none"; // since labelRendere is on top of canvas, it needs to have no event to be able to orbit control
        document.body.appendChild(labelRenderer.domElement);
    }

    // watch for window size change and call functions to resize canvas ratio
    watch(aspectRatio, updateSize);
</script>

<template>
    <div v-if="!isMapLoaded" class="absolute flex flex-col justify-center items-center w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-600 opacity-90">
        <label class="text-white font-bold text-3xl mb-4">Loading...<span class="ml-4">{{ loadedPercent }}%</span></label>
        <progress ref="progressBar" id="progress-bar" class="w-1/3 mt-2 h-4" value="0" max="100"></progress>
    </div>
    <canvas ref="canvas" />
    <!--sidebar start-->
    <Transition>
        <div 
        ref="sidebar"
        tabindex="0"
        v-if="isBldgClicked" 
        class="absolute right-0 backdrop-blur-xl w-1/3 h-full p-8 z-50">
            <div class="felx-col justify-start">
                <div class="w-full flex justify-end">
                    <button @click="isBldgClicked = false;" class="flex w-18 h-18 justify-center items-center">
                        <img src="\src\assets\icons\close.svg" alt="close" />
                    </button>
                </div>
                <div class="text-2xl font-bold mt-8">{{ selectedBldg.name }}</div>
                <div class="w-full mt-8">
                    <button @click="pushPath(selectedBldg.name);" class="w-full bg-[#ff7f7f] hover:bg-[#a40f16] transition-bg-colors duration-300 ease-in-out text-white py-4 shadow-lg">
                        건물 내부 지도 확인
                    </button>
                </div>
            </div>
        </div>
    </Transition>
    <!--sidebar end-->
</template>

<style>
.label {
    background-color: black;
    color: white;
    padding: 10px;
    position: relative;
    transform: translateY(0px);
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
    transform: rotateZ(45deg) translateX(-70%);
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

.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>