class View {

    renderList(sources) {
        const list = document.querySelector('.list');

        const div_wrapper = this.createImageList(sources);
        list.append(div_wrapper);
    }

    createImageList(sources) {
        const div_wrapper = document.createElement('div');
        sources.map(source => {
            const div = document.createElement('div');
            div.id = 'image-wrapper'
            const image = this.createImage(source);
            const h2 = document.createElement('h2');
            h2.innerText = source.name;
            div.append(image)
            div.append(h2)
            div_wrapper.append(div)
        })
        return div_wrapper;
    }

    createImage(source) {
        const image = document.createElement('img')
        image.src = source.thumbnail.toDataURL();
        return image
    }
}