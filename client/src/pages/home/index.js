const { ipcRenderer } = require('electron')

window.onload = () => {
    const openRoom = () => {
        const button = document.getElementById("join-button");
        const input = document.querySelector('input')
        button.addEventListener('click', () => {
            ipcRenderer.send('join-room', {'roomId': input.value})
        })
    }
    openRoom();
}