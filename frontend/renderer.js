const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('fileInput');
    const button = document.getElementById('processBtn');
    const output = document.getElementById('output');
  
    button.addEventListener('click', () => {
      const files = Array.from(input.files).map(f => f.path);
      console.log('[renderer] 发送文件路径给主进程：', files);
      ipcRenderer.send('process-files', files);
    });
  
    ipcRenderer.on('resource-loaded', (event, resources) => {
      console.log('[renderer] 收到资源信息：', resources);
      output.innerHTML = '';
      resources.forEach(res => {
        const div = document.createElement('div');
        div.textContent = `${res.name}: ${res.path}`;
        output.appendChild(div);
      });
    });
  });