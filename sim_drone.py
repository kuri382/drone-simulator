import numpy as np
import matplotlib
import matplotlib.pyplot as plt
import math

#シミュレーション設定
sf = 30 #Hz
dt = 1/sf
time_sim = 3
step_sim = time_sim*sf

def draw_figure(X_log,U_log):
     #図
     col_x = np.linspace(0, step_sim-1, step_sim)
     col_x /= sf #グラフ軸を実時間に直す

     fig = plt.figure(figsize=(10,8))
     plt.subplots_adjust(wspace=0.4, hspace=0.4)

     ax1 = fig.add_subplot(2,3,1)
     ax2 = fig.add_subplot(2,3,2)
     ax3 = fig.add_subplot(2,3,3)
     ax4 = fig.add_subplot(2,3,4)
     ax5 = fig.add_subplot(2,3,5)
     ax6 = fig.add_subplot(2,3,6)
     ax1.plot(col_x,-X_log[:,6])
     ax2.plot(col_x,-X_log[:,8])
     ax3.plot(col_x,-X_log[:,10])
     ax4.plot(col_x,-X_log[:,7])
     ax5.plot(col_x,-X_log[:,9])
     ax6.plot(col_x,-X_log[:,11])
     #グラフタイトル
     ax1.set_xlabel(r"time [s]")
     ax1.set_ylabel(r"X position [m]") 
     ax2.set_xlabel(r"time [s]")
     ax2.set_ylabel(r"Y position [m]")
     ax3.set_xlabel(r"time [s]")
     ax3.set_ylabel(r"Z position [m]")
     ax4.set_xlabel(r"time [s]")
     ax4.set_ylabel(r"X velocity [m/s]") 
     ax5.set_xlabel(r"time [s]")
     ax5.set_ylabel(r"Y velocity [m/s]")
     ax6.set_xlabel(r"time [s]")
     ax6.set_ylabel(r"Z velocity [m/s]")
     plt.savefig("result")

def calc_sim():
     # 環境
     const_g = 9.81
     const_rho = 1.25

     # 機体緒言
     m = 1.25
     l = 0.250 
     Ixx = 4.2*10**-3
     Iyy = 4.2*10**-3
     Izz = 8.1*10**-3
     jr = 0.0
     omega_r = 0.0

     param_b = 1.0
     param_d = 0.01

     #計算簡略化
     temp_a1 = (Iyy - Izz) / Ixx
     temp_a2 = jr / Ixx
     temp_a3 = (Izz - Ixx) / Iyy
     temp_a4 = jr / Iyy
     temp_a5 = (Ixx - Iyy) / Izz
     temp_b1 = l / Ixx
     temp_b2 = l / Iyy
     temp_b3 = l / Izz

     omega_h = (m*const_g/(4*param_b))**0.5

     temp_throttle = 1.5
     omega = [omega_h*temp_throttle]*4

     #初期値設定
     X_dot = np.zeros(12)     #状態変数:Φ,Φdot,θ,θdot,Ψ,Ψdot, Pz,Vz,Px,Vx,Py,Vy
     U_dot = np.zeros(4)      #入力
     X0 = np.zeros(12)
     U0 = np.zeros(4)
     U0[0] = param_b * (omega[0]**2 + omega[1]**2 + omega[2]**2 + omega[3]**2)
     U0[1] = param_b * (-omega[1]**2 + omega[3]**2)
     U0[2] = param_b * (omega[0]**2 - omega[2]**2)
     U0[3] = param_d * (-omega[0]**2 + omega[1]**2 - omega[2]**2 + omega[3]**2)

     X_log = np.zeros((step_sim,12))
     U_log = np.zeros((step_sim,4))
     X_log[0,:] = X0
     U_log[0,:] = U0

     for i in range(1,step_sim):
          X = X_log[i-1,:]
          U = U_log[i-1,:]
          ux = (math.cos(X[0]) * math.sin(X[2]) * math.cos(X[4])
               + math.sin(X[0]) * math.sin(X[4]))
          uy = (math.cos(X[0]) * math.sin(X[2]) * math.sin(X[4])
               + math.sin(X[0]) * math.cos(X[4]))
          
          X_dot[0] = X[1]
          X_dot[1] = X[3]*X[5]*temp_a1 + X[3]*temp_a2*omega_r + temp_b1*U[1]
          X_dot[2] = X[3]
          X_dot[3] = X[1]*X[5]*temp_a3 - X[1]*temp_a4*omega_r + temp_b2*U[3]
          X_dot[4] = X[5]
          X_dot[5] = X[3]*X[1]*temp_a5 + temp_b3*U[3]
          X_dot[6] = X[7]
          X_dot[7] = const_g - (math.cos(X[0])*math.cos(X[2]))/m*U[0]
          X_dot[8] = X[9]
          X_dot[9] = ux / m * U[0]
          X_dot[10] = X[11]
          X_dot[11] = uy / m * U[0]

          U[0] = param_b * (omega[0]**2 + omega[1]**2 + omega[2]**2 + omega[3]**2)
          U[1] = param_b * (-omega[1]**2 + omega[3]**2)
          U[2] = param_b * (omega[0]**2 - omega[2]**2)
          U[3] = param_d * (-omega[0]**2 + omega[1]**2 - omega[2]**2 + omega[3]**2)

          X_log[i,:] = X + X_dot*dt
          U_log[i,:] = U
          U_log[i,:] = U_log[i-1,:]
     return X_log, U_log

def main():
     output_X, output_U = calc_sim()
     draw_figure(output_X, output_U)

if __name__ == '__main__':
     main()