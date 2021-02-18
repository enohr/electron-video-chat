class View {

    renderList(sources) {
        const list = document.querySelector('.list');

        const div_wrapper = this.createImageList(sources);
        list.append(div_wrapper);
        return list
    }

    createImageList(sources) {
        const div_wrapper = document.createElement('div');
        div_wrapper.id = 'div-wrapper'
        sources.map(source => {
            const div = document.createElement('div');
            div.classList.add('image-wrapper')
            div.id = source.id
            const image = this.createImage(source);
            const h2 = document.createElement('h2');
            h2.innerText = source.name;
            h2.id = source.id
            div.append(image)
            div.append(h2)
            div_wrapper.append(div)
        })
        return div_wrapper;
    }

    createImage(source) {
        const image = document.createElement('img')
        image.src = source.thumbnail.toDataURL();
        image.id = source.id
        return image
    }
}