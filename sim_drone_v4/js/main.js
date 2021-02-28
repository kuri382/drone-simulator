var sim_time = 0;
var real_time = 0;

//シミュレーション用変数
let sim_pos_x, sim_pos_y , sim_pos_z; 
let sim_vel_x, sim_vel_y , sim_vel_z; 
let sim_ang_x, sim_ang_y , sim_ang_z;
let sim_rate_x, sim_rate_y, sim_rate_z;

let isRotationActive = false;

document.getElementById('rotationToggle').addEventListener('click', event => {
    isRotationActive = !isRotationActive;
    event.target.innerHTML = `${(isRotationActive ? 'Pause' : 'Resume')} Rotation`;
});