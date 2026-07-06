const { ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const USERS_FILE = path.join(__dirname, 'users_db.json');

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function readUsersDatabase() {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  } catch (error) {
    return [];
  }
}

function writeUsersDatabase(data) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    return false;
  }
}

function setupAuthIPC() {
  try { ipcMain.removeHandler('auth:login'); } catch(e){}
  try { ipcMain.removeHandler('auth:register'); } catch(e){}
  try { ipcMain.removeHandler('auth:delete'); } catch(e){}

  ipcMain.handle('auth:login', async (event, { username, password }) => {
    try {
      const users = readUsersDatabase();
      const hashedPassword = hashPassword(password);
      const userExists = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === hashedPassword);

      if (userExists) {
        return { success: true, message: "Login correcto" };
      } else {
        return { success: false, message: "la contraseña o correo no es correcto" };
      }
    } catch (error) {
      return { success: false, message: "Error interno en el login." };
    }
  });

  ipcMain.handle('auth:register', async (event, { username, password }) => {
    try {
      const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!regexCorreo.test(username)) {
        return { success: false, message: "Por favor, ingrese un formato de correo electrónico válido." };
      }

      const users = readUsersDatabase();
      const duplicated = users.some(u => u.username.toLowerCase() === username.toLowerCase());
      
      if (duplicated) {
        return { success: false, message: "este correo ya esta registrado" };
      }

      users.push({
        username: username,
        password: hashPassword(password)
      });

      writeUsersDatabase(users);
      return { success: true, message: "Usuario registrado exitosamente." };

    } catch (error) {
      return { success: false, message: "Error interno en el registro." };
    }
  });

  // NUEVO CANAL: Para eliminar cuentas registradas directamente
  ipcMain.handle('auth:delete', async (event, { username }) => {
    try {
      const users = readUsersDatabase();
      const initialLength = users.length;
      
      // Filtramos dejando fuera el correo indicado
      const updatedUsers = users.filter(u => u.username.toLowerCase() !== username.toLowerCase());

      if (updatedUsers.length === initialLength) {
        return { success: false, message: "El correo especificado no existe en el sistema." };
      }

      writeUsersDatabase(updatedUsers);
      return { success: true, message: "Cuenta eliminada de la base de datos correctamente." };
    } catch (error) {
      return { success: false, message: "Error interno al intentar eliminar la cuenta." };
    }
  });
}

module.exports = { setupAuthIPC };