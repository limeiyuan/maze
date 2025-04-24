require('electron-reload')(__dirname, {
    electron: require(`${__dirname}/../node_modules/electron`)
});

const { app, BrowserWindow, ipcMain } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const isWin = process.platform === 'win32';
const pythonCmd = isWin ? 'python' : 'python3';

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile(path.join(__dirname, 'index.html'));
    win.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();

    ipcMain.on('process-files', (event, files) => {
        console.log('[main.js] 收到前端的 process-files 事件');
        const python = spawn(pythonCmd, [path.join(__dirname, '../backend/app.py')]);
        python.stdin.write(JSON.stringify(files));
        python.stdin.end();

        let result = '';

        python.stderr.on('data', (data) => {
            console.error('[main.js] Python 错误：', data.toString());
        });

        python.stdout.on('end', () => {
            try {
                const resources = JSON.parse(result);
                event.reply('resource-loaded', resources);
            } catch (error) {
                console.error('Failed to parse Python output:', error);
            }
        });

        python.stderr.on('data', (data) => {
            console.error(`Python error: ${data}`);
        });
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});