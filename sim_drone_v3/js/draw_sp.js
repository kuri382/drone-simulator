var container, scene, camera, renderer;
var controls;
var sphere, player;
var drone_angle;
//ドローン設定
var drone_all = new THREE.Group();
var sim_time = 0;
var real_time = 0;

// ページの読み込みを待つ
window.addEventListener('load', init);

function init() {

// サイズを指定
const width = window.innerWidth;
const height = window.innerWidth;

// レンダラーを作成
renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#myCanvas')
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);

// シーンを作成
scene = new THREE.Scene();

// カメラを作成
camera = new THREE.PerspectiveCamera(45, width / height);
camera.position.set(0, 0, +1000);
controls = new THREE.OrbitControls(camera);

// 箱を作成
const geometry = new THREE.BoxGeometry(400, 400, 400);
const material = new THREE.MeshNormalMaterial();
const box = new THREE.Mesh(geometry, material);
scene.add(box);

animate();

// 毎フレーム時に実行されるループイベント
function animate() {
  box.rotation.y += 0.01;
  renderer.render(scene, camera); // レンダリング

  requestAnimationFrame(animate);
}
}