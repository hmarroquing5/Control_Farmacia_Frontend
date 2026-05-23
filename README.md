## Sistema de Control de Farmacia - Frontend (React + Vite)

Este repositorio contiene la interfaz de usuario y el cliente web para el Sistema de Control de Farmacia. La aplicación está desarrollada utilizando React y estructurada con Vite para ofrecer una experiencia de usuario ágil, responsiva y de alto rendimiento. Se comunica de forma desacoplada con la API backend desarrollada en .NET mediante servicios HTTP.

## Características del Proyecto
- **Core:** React 19.2.5 (Arquitectura basada en componentes funcionales y Hooks).
- **Herramienta de Construcción:** Vite (Compilación rápida y recarga en caliente mediante HMR).
- **Enrutamiento:** `react-router-dom` para la navegación interna de la aplicación entre las páginas.
- **Consumo de API:** Comunicación con la API backend de .NET mediante peticiones HTTP utilizando la API nativa `fetch`.
- **Gestión de Entornos:** Configuración automatizada de variables de entorno para desarrollo y producción.

## Requisitos Previos

El proyecto fue desarrollado y probado con el siguiente entorno:

- [Node.js (v22.14.0)](https://nodejs.org/)
- [npm (v10.9.2)](https://www.npmjs.com/) (administrador de paquetes incluido con Node.js)
- [Git](https://git-scm.com/) (sistema de control de versiones)

## Configuración de Variables de Entorno (`.env`)
El proyecto utiliza variables de entorno para conectarse dinámicamente al servidor de backend sin necesidad de modificar el código fuente entre despliegues.

### Estructura de Referencia (`.env.example`)
En la raíz del proyecto encontrarás el archivo `.env.example`, el cual sirve como plantilla para saber qué variables requiere el sistema:

```env
VITE_API_URL=https://tu-api-aqui.com/api
```

## Configuración del Servidor de Desarrollo

El proyecto utiliza Vite como herramienta de construcción y servidor de desarrollo. Por defecto, la aplicación se ejecuta en:

```txt
http://localhost:5173
```

## Instalación y Ejecución

1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
```

2. Ingresar al directorio del proyecto

```bash
cd Control_Farmacia_Frontend
```

3. Instalar dependencias

```bash
npm install
```

4. Crear el archivo de variables de entorno

Duplicar el archivo `.env.example` y renombrarlo como `.env`.

5. Configurar la URL del backend

Modificar la variable `VITE_API_URL` dentro del archivo `.env` con la dirección correspondiente del servidor backend.

```env
VITE_API_URL=https://localhost:5001/api
```

6. Ejecutar el entorno de desarrollo

```bash
npm run dev
```

7. Abrir en el navegador

```txt
http://localhost:5173
```