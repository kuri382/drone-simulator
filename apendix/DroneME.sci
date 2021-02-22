//Motion Equation

g = 9.81;

m = 1.25;
Ixx = 4.2*10^-3;
Iyy = 4.2*10^-3;
Izz = 8.1*10^-3;
Jr = 0;
Omega_r = 0;
b = 1;
d = 0.01;

l = 0.25;

a1 = (Iyy-Izz)/Ixx;
a2 = Jr/Ixx;
a3 = (Izz-Ixx)/Iyy;
a4 = Jr/Iyy;
a5 = (Ixx-Iyy)/Izz

b1 = l/Ixx;
b2 = l/Iyy;
b3 = l/Izz;

Omega_h = (m*g/(4*b))^0.5;
Omega = Omega_h*[1;1;1;1]*1.0;
X0 = [0;0;0;0;0;0;0;0;0;0;0;0];
U0 = 0*[1;1;1;1];
U0(1) = b*(Omega(1)^2 + Omega(2)^2 +Omega(3)^2 +Omega(4)^2);
U0(2) = b*(-1*Omega(2)^2 + Omega(4)^2);
U0(3) = b*(Omega(1)^2 - Omega(3)^2);
U0(4) = d*(-1*Omega(1)^2 + Omega(2)^2 - Omega(3)^2 + Omega(4)^2);

SimTime = 10;//[sec]
dt = 1/200;
T=linspace(0,SimTime,SimStep)

SimStep = SimTime/dt;


X_log = zeros(12,SimStep);
U_log = zeros(4,SimStep);
X_dot = zeros(12,1);
U_dot = zeros(4,1);


X_log(:,1) = X0;
U_log(:,1) = U0;

for I = 2:SimStep
    X = X_log(:,I-1);
    U = U_log(:,I-1);
    
    ux = cos(X(1))*sin(X(3))*cos(X(5)) + sin(X(1))*sin(X(5));
    uy = cos(X(1))*sin(X(3))*sin(X(5)) + sin(X(1))*cos(X(5));
    
    X_dot(1) = X(2);
    X_dot(2) = X(4)*X(6)*a1 + X(4)*a2*Omega_r + b1*U(2);
    X_dot(3) = X(4);
    X_dot(4) = X(2)*X(6)*a3 - X(2)*a4*Omega_r + b2*U(3);
    X_dot(5) = X(6);
    X_dot(6) = X(4)*X(2)*a5 + b3*U(4);
    X_dot(7) = X(8);
    X_dot(8) = g - (cos(X(1))*cos(X(3)))/m*U(1);
    X_dot(9) = X(10);
    X_dot(10) = ux/m*U(1);
    X_dot(11) = X(12);
    X_dot(12) = uy/m*U(1);
    
    X_log(:,I) = X + X_dot*dt;
    
    U(1) = b*(Omega(1)^2 + Omega(2)^2 +Omega(3)^2 +Omega(4)^2);
    U(2) = b*(-1*Omega(2)^2 + Omega(4)^2);
    U(3) = b*(Omega(1)^2 - Omega(3)^2);
    U(4) = d*(-1*Omega(1)^2 + Omega(2)^2 - Omega(3)^2 + Omega(4)^2);
    
    U_log(:,I) = U;
    U_log(:,I) = U_log(:,I-1);
    
end

figure()
plot(T,X_log(7,:))
