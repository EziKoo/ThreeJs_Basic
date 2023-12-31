import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入动画库
import gsap from "gsap";
// 导入dat.gui
import * as dat from "dat.gui";

// console.log(THREE);

// 目标：纹理加载进度情况

// 1、创建场景
const scene = new THREE.Scene();

// 2、创建相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// 相机位置设置
camera.position.set(0, 0, 10);
scene.add(camera);

// 添加物体
// 创建几何体
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

// 单张纹理图的加载
const event = {};
event.onLoad = function () {
  console.log("图片加载完成");
};

event.onProgress = function (e) {
  console.log(e);
  console.log("图片加载进度");
};
event.onError = function (e) {
  console.log("图片加载失败");
};

// 导入纹理
const textureLoader = new THREE.TextureLoader();
const doorColorTexture = textureLoader.load(
  "./texture/img/xi.jpg",
  event.onLoad,
  event.onProgress,
  event.onError
);
const doorAplhaTexture = textureLoader.load("./texture/img/xi.jpg");

// 纹理的偏移
doorColorTexture.offset.x = 0.3;
doorColorTexture.offset.y = 0.6;

// 纹理的旋转
// 设置旋转的原点
doorColorTexture.center.set(0.5, 0.5);
doorColorTexture.rotation = Math.PI / 4;

// 设置纹理的重复
doorColorTexture.repeat.set(2, 3);
// 设置纹理重复的模式
doorColorTexture.wrapS = THREE.RepeatWrapping;
doorColorTexture.wrapT = THREE.MirroredRepeatWrapping;

// 材质
const material = new THREE.MeshStandardMaterial({
  color: "#ffff00",
  map: doorColorTexture,
  alphaMap: doorAplhaTexture,
  transparent: true,
  opacity: 0.5,
  side: THREE.DoubleSide,
});
const cube = new THREE.Mesh(cubeGeometry, material);
scene.add(cube);

// 添加平面
const plan = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
plan.position.set(3, 0, 0);
scene.add(plan);

// 灯光
// 环境光（四面八方打过来的）
const light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);

// 直线光
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// 初始化渲染器
const renderer = new THREE.WebGLRenderer();

// 设置渲染器的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
// console.log(renderer);
// 将webgl渲染到canvas内容添加到body
document.body.appendChild(renderer.domElement);

// 使用渲染器，通过相机将场景渲染出来
// renderer.render(scene, camera);

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);

// 设置控制器阻尼，让控制器更有真实的效果，必须在动画循环里调用.update()
controls.enableDamping = true;

// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 设置时钟
const clock = new THREE.Clock();

window.addEventListener("dblclick", () => {
  // console.log(animate1);
  // if (animate1.isActive()) {
  //   // 暂停
  //   animate1.pause();
  // } else {
  //   // 恢复
  //   animate1.resume();
  // }

  const fullScreenElement = document.fullscreenElement;
  if (!fullScreenElement) {
    // 双击控制屏幕进入全屏，退出全屏
    // 让画布对象全屏
    renderer.domElement.requestFullscreen();
  } else {
    // 退出全屏，使用document对象
    document.exitFullscreen();
  }
});

function render() {
  // // 获取时钟运行的总时长
  // let time = clock.getElapsedTime();
  // let deltaTime = clock.getDelta();
  // console.log("时钟运行的总时长：", time);
  // console.log("两次获取时间的间隔时间：", deltaTime);

  // let t = time % 5;
  // cube.position.x = t * 1;

  controls.update();
  renderer.render(scene, camera);
  // 渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render);
}

render();

// 监听画面的变化，更新渲染画面
window.addEventListener("resize", () => {
  console.log("画面变化了");
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  // 更新摄像机的投影矩阵
  camera.updateProjectionMatrix();
  // 更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio);
});
