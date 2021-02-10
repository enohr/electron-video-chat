// initial class to be called by screen.

const onload = () => {



     const media = new Media();
     const view = new View();
     Main.init({media, view});
     


}

window.onload = onload
