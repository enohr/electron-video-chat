window.onload = () => {
    const openRoom = () => {
        const button = document.getElementById("join-button");
        button.addEventListener('click', () => {
            window.open('../room-call/index.html');
        })
    }
    openRoom();
}