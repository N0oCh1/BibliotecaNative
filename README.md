# 📚 BibliotecaNative

**BibliotecaNative** es una aplicación móvil desarrollada en **React Native con Expo** que permite a los usuarios gestionar su propia biblioteca de libros físicos y digitales, prestar libros, compartir bibliotecas con amigos y recibir notificaciones en tiempo real. Utiliza **Firebase Realtime Database** como backend, integrándose mediante la REST API sin depender del SDK oficial.

---

## 🚀 Características principales

- 📖 Agrega libros propios o desde una API pública.
- 🔄 Préstamo de libros físicos entre usuarios.
- 👥 Compartición de biblioteca con amigos.
- 🔔 Notificaciones push sobre préstamos y actividad.
- 🔐 Autenticación segura mediante Firebase.
- 📦 Almacenamiento en la nube con Firebase Realtime Database.

---

## 🏗️ Arquitectura general

- **Cliente móvil:** React Native + Expo + TypeScript.
- **Backend:** Firebase Realtime Database accedido vía REST API.
- **Autenticación:** Firebase Authentication (email/password).
- **Notificaciones:** Expo Notifications con tokens almacenados por usuario.

### Estructura de rutas en Firebase:

```
/usuarios/{userId}
/libros/{userId}/libro/{libroId}
/prestamos/{userId}/prestamo/{prestamoId}
/amigos/{userId}/{amigoId}
/tokens/{userId}
/bibliotecasCompartidas/{userId}
```
---

## 🧰 Tecnologías utilizadas

- React Native (Expo)
- TypeScript
- Firebase Realtime Database (REST API)
- Firebase Authentication
- Expo Notifications
- AsyncStorage

---

## 📁 Estructura del proyecto

```
BibliotecaNative/
├── app/ # Rutas y pantallas (Expo Router)
├── api/ # Funciones que acceden a Firebase vía fetch
├── components/ # Componentes reutilizables de interfaz
├── utils/ # Funciones auxiliares (tokens, validaciones, etc.)
├── assets/ # Recursos gráficos (imágenes, íconos)
├── firebase.ts # Configuración del endpoint de Firebase
├── app.config.js # Configuración de Expo
└── tsconfig.json # Configuración de TypeScript
```

---

## ⚙️ Instalación y ejecución

1. Clona el repositorio:

```
git clone https://github.com/N0oCh1/BibliotecaNative.git
cd BibliotecaNative
```

2. Instala las dependencias:
```
npm install
```
3. Ejecuta la app con Expo:
```
npm start
```
4. Escanea el código QR con Expo Go o corre en un emulador Android/iOS.

---
### 🧪 Mejoras futuras
 Agregar pruebas unitarias y de integración.

 Control global de errores HTTP.

 Buscador de libros en bibliotecas compartidas.

 Filtros y ordenamiento de préstamos y libros.

 Rol administrativo para gestionar usuarios/libros. 
