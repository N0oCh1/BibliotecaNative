# Guia de inicializacion

1. clonar el repositorio
2. npm install en la terminal de vs
   (si da error asegurese de tener node js instalado)
3. una vez intalado todas las dependencia npm start

le saldra un codigo QR lo escanean con la app de expo go para el telefono, asegurase de que su telefono y computadora este en la misma red

# Guia para abrirlo desde el emulador

1. tener android studio instalado
2. tener instaldo un SDK el mas reciente
3. si al abrir el android studio habre en el proyecto
   3.1. se van a la pestaña tuperior en la amburguesa
   3.2. abrir file -> close proyect
4. al cerra aparecera esto

![image](https://github.com/user-attachments/assets/cb6b3f94-652c-42d5-b1fc-8cd9ee81af32)
   
se van a SDK manager y si no tienen descargado, descargarse el SDK de 15 superior se van a SDK tools e instalen esto

![image](https://github.com/user-attachments/assets/5f64ae4f-931e-4102-a5b3-dd3f1b80cb74)

una vez intalado todo se copian esta url
![image](https://github.com/user-attachments/assets/1928f3a6-708d-4e01-8696-50f5680eff29)

5. nos vamos a variables de entorno

![456109691-5ac2f5eb-2c6e-49ed-9f14-694ddc199ef4](https://github.com/user-attachments/assets/acdde22b-a842-4e3d-95f5-4007a262cc61)

y agregamos una variable de systema nuevo 
el nombre de la varible sera <ANDROID_HOME>
y el valor sera el path que copiaron del android studio

a la hora de ejecutar nuevamente el <npm start> con el emulador abierto se tendra que descarga el expo go para el emulador 


