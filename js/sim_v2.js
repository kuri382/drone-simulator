// シミュレーション設定
let sf = 30;
let dt = 1/sf;
let time_sim = 1;
let step_sim = time_sim*sf;

//記録用配列用意
let col_X = 12      //状態変数
let col_U = 4       //入力

let X_log = new Array(step_sim) //配列列数
for(let i = 0; i < step_sim; i++) {
     X_log[i] = new Array(col_X).fill(0); //配列行数
}

let U_log = new Array(step_sim) //配列列数
for(let i = 0; i < step_sim; i++) {
     U_log[i] = new Array(col_U).fill(0); //配列行数
}

// 環境
let const_g = 9.81;
let const_rho = 1.205;

// 機体緒言
let l = 0.250; 
let m = 1.25;
//機体全体の慣性モーメント(実験値)
let Ixx = 4.2*10^-3;
let Iyy = 4.2*10^-3;
let Izz = 8.1*10^-3;
let jr = 0.5;
let omega_r = 0;

let param_b = 1.0;
let param_d = 0.01;

//計算簡略化
temp_a1 = (Iyy - Izz)/Ixx;
temp_a2 = jr/Ixx;
temp_a3 = (Izz - Ixx)/Iyy;
temp_a4 = jr/Iyy;
temp_a5 = (Ixx - Iyy)/Izz;
temp_b1 = l / Ixx;
temp_b2 = l / Iyy;
temp_b3 = l / Izz;

omega_h = (m*const_g/(4*param_b))^0.5;

let temp_throttle = 1;
omega = Array(4);
for(let i = 0; i < 4; i++){
     omega[i] = omega_h*temp_throttle;
}

// 初期値設定
X_dot = Array(col_X);//状態変数:Φ,Φdot,θ,θdot,Ψ,Ψdot, Pz,Vz,Px,Vx,Py,Vy
U_dot = Array(col_U);//入力
X0 = Array(col_X);
U0 = Array(col_U);
U0[0] = param_b * (omega[0]**2 + omega[1]**2 + omega[2]**2 + omega[3]**2);
U0[1] = param_b * (-1*omega[1]**2 + omega[3]**2);
U0[2] = param_b * (omega[0]**2 - omega[2]**2);
U0[3] = param_d * (-1*omega[0]**2 + omega[1]**2 - omega[2]**2 + omega[3]**2);

for(let i = 0; i<col_X; i++){
     X_log[0,i] = X0[i];
}
for(let i = 0; i<col_U; i++){
     U_log[0,i] = U0[i];
}
X = Array(col_X);
U = Array(col_U);

function calcSim(i){
    for(let j = 0; j<col_X; j++){
        X[j] = X_log[i-1,j];
    }
    for(let j = 0; j<col_U; j++){
        U[j] = U_log[i-1,j];
    }

    ux = (Math.cos(X[0]) * Math.sin(X[2]) * Math.cos(X[4])
    + Math.sin(X[0]) * Math.sin(X[4]));
    uy = (Math.cos(X[0]) * Math.sin(X[2]) * Math.sin(X[4])
    + Math.sin(X[0]) * Math.cos(X[4]));

    X_dot[0] = X[1];
    X_dot[1] = X[3]*X[5]*temp_a1 + X[3]*temp_a2*omega_r + temp_b1*U[1];
    X_dot[2] = X[3];
    X_dot[3] = X[1]*X[5]*temp_a3 - X[1]*temp_a4*omega_r + temp_b2*U[3];
    X_dot[4] = X[5];
    X_dot[5] = X[3]*X[1]*temp_a5 + temp_b3*U[3];
    X_dot[6] = X[7];
    X_dot[7] = const_g - (Math.cos(X[0])*Math.cos(X[2]))/m*U[0];
    X_dot[8] = X[9];
    X_dot[9] = ux / m * U[0];
    X_dot[10] = X[11];
    X_dot[11] = uy / m * U[0];

    U[0] = param_b * (omega[0]**2 + omega[1]**2 + omega[2]**2 + omega[3]**2)
    U[1] = param_b * (-1*omega[1]**2 + omega[3]**2)
    U[2] = param_b * (omega[0]**2 - omega[2]**2)
    U[3] = param_d * (-1*omega[0]**2 + omega[1]**2 - omega[2]**2 + omega[3]**2)

    for(let j=0; j<col_X; j++) {
        X_log[i,j] = X[j] + X_dot[j]*dt;
    }
    for(let j=0; j<col_U; j++) {
        U_log[i,j] = U[j];
        //U_log[i,j]
    }
}
