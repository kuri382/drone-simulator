var container, scene, camera, renderer;
var controls;
var directionalLight
var sphere, player;
var drone_angle;
//ドローン設定
var drone_all = new THREE.Group();

// ページの読み込みを待つ
window.addEventListener('load', init);

function init() {
  // サイズを指定
  const width = window.innerWidth;
  const height = window.innerWidth;

  // レンダラーを作成
  renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#myCanvas'),
    alpha: true,
    antialias: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);

  // シーン作成
  scene = new THREE.Scene();

  // カメラ作成
  camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
  camera.position.set(10, 10, +20);
  controls = new THREE.OrbitControls(camera);

  // ライト作成
  directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(1,1,1);
  scene.add(directionalLight);

  // スポットライト
  function put_spotlight(x,y,z){
        const light = new THREE.SpotLight(0xffffcc, 3, 80, Math.PI / 10, 0.1,0.1);
        light.position.set(x, z, y);
        scene.add(light);
        //var spotLightHelper = new THREE.SpotLightHelper(light);
        //scene.add(spotLightHelper)
  }
  put_spotlight(15,15,0.1)
  put_spotlight(-15,15,0.1)
  put_spotlight(15,-15,0.1)
  put_spotlight(-15,-15,0.1)

  //グリッド作成
  var gridHelper = new THREE.GridHelper(50, 1, 0xffffff);
  scene.add(gridHelper);

  // フィールドを作成
  function put_cube(sx,sz,sy,x,y,z,cube_color,rotx,roty,rotz){
    //const ground_geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    const ground_geometry = new THREE.BoxGeometry(sx, sz, sy);
    // マテリアルを作成
    const ground_material = new THREE.MeshStandardMaterial({ color: cube_color, roughness: 1 });
    // メッシュを作成
    const cube_object = new THREE.Mesh(ground_geometry, ground_material);
    // 3D空間にメッシュを追加
    cube_object.position.x = x;
    cube_object.position.y = z;
    cube_object.position.z = y;
    cube_object.rotation.x = rotx;
    cube_object.rotation.y = rotz;
    cube_object.rotation.z = roty;
    cube_object.receiveShadow = true;
    scene.add(cube_object);
  }
  put_cube(100,1,100,0,0,-1,0xcccccc,0,0,0)
  //仮想スポットライト
  put_cube(1,2,1,14.5,14.5,-1,0x003333,0,0,Math.PI/4)
  put_cube(1,2,1,-14.5,14.5,-1,0x003333,0,0,Math.PI/4)
  put_cube(1,2,1,14.5,-14.5,-1,0x003333,0,0,Math.PI/4)
  put_cube(1,2,1,-14.5,-14.5,-1,0x003333,0,0,Math.PI/4)

  function starField(){
    //空のジオメトリ
    const geometry = new THREE.Geometry();
    //表示する範囲
    const SIZE = 100;
    //表示するパーティクルの数
    const LENGTH = 20000;
    //領域内にランダムに表示するループ処理
    for (let i = 0; i < LENGTH; i++){
        geometry.vertices.push(
            new THREE.Vector3(
            SIZE * (Math.random() - 0.5),
        SIZE * (Math.random() - 0.5),
        SIZE * (Math.random() - 0.5)
        )
        );
    }
    //マテリアル
    const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true
    });
    const star = new THREE.Points(geometry, material);
    scene.add(star);
    return star
  }
  var star = starField();

  function drone_body(sx,sy,sz,x,y,z,radians,body_color){
    //const ground_geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    const geometry_3 = new THREE.BoxGeometry(sx, sy, sz);
    // マテリアルを作成
    const material_3 = new THREE.MeshStandardMaterial({ color: body_color, roughness: 1 });
    // メッシュを作成
    const mesh_3 = new THREE.Mesh(geometry_3, material_3);
    // 3D空間にメッシュを追加
    mesh_3.position.x = x;
    mesh_3.position.y = z;//高さ方向
    mesh_3.position.z = y;
    mesh_3.rotation.y = radians;
    drone_all.add(mesh_3);
  }

  function drone_roter(a,c,x,y,z,roter_color){
    const geometry = new THREE.CylinderGeometry( a, a, c, 32 );//radiusTop, radiusBottom, height, radiusSegments
    const material = new THREE.MeshStandardMaterial( {color: roter_color} );
    const roter = new THREE.Mesh( geometry, material );
    roter.position.set(x, z, y);
    drone_all.add( roter );
  }
  let motor_radius = 0.07; //[m]
  let roter_radius = 0.4; //[m]
  let roter_height = 0.02; //[m]
  let distance_roter = 0.5; //[m]
  let body_length = 2;
  let body_width = 0.2;
  let body_height = 0.1;
  //ローター
  drone_roter(roter_radius,roter_height, distance_roter, distance_roter,0.2,0xcccccc);
  drone_roter(roter_radius,roter_height, distance_roter,-distance_roter,0.2,0xcccccc);
  drone_roter(roter_radius,roter_height,-distance_roter,-distance_roter,0.2,0xcccccc);
  drone_roter(roter_radius,roter_height,-distance_roter, distance_roter,0.2,0xcccccc);
  //モーター
  drone_roter(motor_radius,motor_radius, distance_roter, distance_roter,0.2,0x003366);
  drone_roter(motor_radius,motor_radius, distance_roter,-distance_roter,0.2,0x003366);
  drone_roter(motor_radius,motor_radius,-distance_roter,-distance_roter,0.2,0x003366);
  drone_roter(motor_radius,motor_radius,-distance_roter, distance_roter,0.2,0x003366);
  //ボディ
  drone_body(body_length,body_height,body_width,0,0,0.15,(Math.PI/4),0x336666);
  drone_body(body_length,body_height,body_width,0,0,0.15,-(Math.PI/4),0x336666);
  drone_body(0.8,0.2,0.4,0,0,0.0,0,0x000033);
  drone_body(0.6,0.1,0.5,0,0,0.0,0,0x003366);
  scene.add( drone_all)

  animate();

  // 毎フレーム時に実行されるループイベント
  function animate() {
    star.rotation.z += 0.001;
    star.rotation.x += 0.0001;
    //drone_all.position.y = sim_poz_z * 0.01;


    renderer.render(scene, camera); // レンダリング

    requestAnimationFrame(animate);
  }
}