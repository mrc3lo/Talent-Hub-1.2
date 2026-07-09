# TalentHub

TalentHub es una aplicación de escritorio desarrollada con **React**, **Electron** y **MongoDB**, creada para la gestión de postulaciones laborales, empresas y usuarios.

---

# Tecnologías utilizadas

* React 19
* Electron 43
* Vite 8
* MongoDB
* Node.js
* Python (para la carga inicial de la base de datos)

---

# Requisitos

Antes de comenzar, asegúrate de tener instalado:

* Node.js (versión 20 o superior)
* npm
* MongoDB Community Server
* Python 3.10 o superior
* Git

---

# Clonar el proyecto

```bash
git clone <URL_DEL_REPOSITORIO>
cd talent-hub
```

---

# Instalar dependencias

## Dependencias de Node.js

Después de clonar el repositorio ejecuta:

```bash
npm install
```

> **Importante:** cada vez que un integrante del equipo ejecute `git pull`, también debe ejecutar nuevamente `npm install`, ya que el proyecto puede haber incorporado nuevas dependencias.

## Dependencias de Python

El script encargado de crear la base de datos utiliza Python.

Instálalas con:

```bash
pip install -r requirements.txt
```

---

# Configurar MongoDB

Antes de iniciar el proyecto, verifica que el servicio de MongoDB esté en ejecución.

Por defecto se utiliza la conexión:

```text
mongodb://localhost:27017
```

Si modificas esta dirección, recuerda actualizar la cadena de conexión en el proyecto y en el script de carga de la base de datos.

---

# Crear la base de datos

Una vez instalado todo, crea la base de datos ejecutando:

```bash
python Seed-db/cargar_db.py
```

Este script:

* crea la base de datos;
* crea las colecciones necesarias;
* inserta todos los datos iniciales.

Este paso solo debe ejecutarse la primera vez o cuando se desee restaurar la base de datos desde cero.

---

# Ejecutar la aplicación

Desde la carpeta raíz del proyecto ejecuta:

```bash
npm run dev
```

Este comando iniciará automáticamente:

* el servidor de desarrollo de React (Vite);
* la aplicación de Electron.

No es necesario abrir ambos por separado.

---

# Flujo recomendado de instalación

1. Clonar el repositorio.
2. Ejecutar:

```bash
npm install
```

3. Instalar las dependencias de Python:

```bash
pip install -r requirements.txt
```

4. Iniciar MongoDB.

5. Crear la base de datos:

```bash
python Seed-db/cargar_db.py
```

6. Ejecutar la aplicación:

```bash
npm run dev
```

---

# Integrantes

* Matías Carrasco
* Marcelo Díaz Flores
* Daniel Meliman

---

# Notas

* MongoDB debe estar iniciado antes de ejecutar `Seed-db/cargar_db.py`.
* Si eliminas la base de datos, simplemente vuelve a ejecutar el script de carga.
* Si recibes cambios del repositorio mediante `git pull`, ejecuta nuevamente `npm install` antes de iniciar la aplicación.

---

# Licencia

Proyecto desarrollado con fines académicos.
