class View {

    static warning (element, elementWarning, warning) {
        element.classList.add("field-warning");
        elementWarning.innerText = warning;
    }

    static warningReset (element, elementWarning) {
        element.classList.remove("field-warning");
        elementWarning.innerText = '';
    }

    static warningFiles (msg) {
        for (let i = 0; i < msg.length; i++) {
            let span = document.createElement("span");
            span.classList.add("warning");
            span.innerText = msg[i];
            data.infoMessage.appendChild(span);
        }
        setTimeout(() => {
            data.infoMessage.innerHTML = '';
        }, 3000);
    }

    static showFileInfo (files) {
        let length = Object.keys(files).length;

        if (files) {
            data.outFilesInfo.innerHTML = `<h5>Добавлено файлов: ${length}</h5>`;

            for (let file in files) {
                let div = document.createElement('div'),
                    num = parseInt(file)+1;
                div.classList.add("file-data");
                div.setAttribute("data-file-name", files[file]['name']);
                div.innerHTML = `<strong>${num}:</strong> ${files[file]['name']} <br> <span>size: ${files[file]['size']} / type: ${files[file]['type']} </span> <button data-delete-file=${files[file]['name']}>Удалить</button>`;
                data.outFilesInfo.appendChild(div);
            }
        } else {
            data.outFilesInfo.innerText = '';
        }
    }

    static renderFiles (files) {
        for (let i = 0; i < files.length; i++) {
            let file = files[i],
                svg = '<svg enable-background="new 0 0 32 32" version="1.1" viewBox="0 0 32 32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n' +
                    '\t<g><path d="M17.02,10c0,0.55-0.45,1-1,1c0,0-0.01,0-0.02,0H2c-0.55,0-1-0.45-1-1V5c0-0.55,0.45-1,1-1h11    c0.35,0,0.68,0.18,0.86,0.49l2.91,4.85C16.92,9.51,17.02,9.75,17.02,10z" fill="#FE9803"/></g>\n' +
                    '\t<g><path d="M31,10v17c0,0.55-0.45,1-1,1H2c-0.55,0-1-0.45-1-1V9h29C30.55,9,31,9.45,31,10z" fill="#FFC10A"/></g>\n' +
                    '</svg>';

            if (!file.type.startsWith('image/')){
                let div = document.createElement("div");
                div.classList.add("img-svg");
                div.setAttribute('data-prev-file-name', files[i]['name'].replace(/\s/gm, "_"));
                div.innerHTML = svg;
                data.filesPrev.appendChild(div);

            } else {
                let img = document.createElement("img");
                img.file = file;
                img.setAttribute('data-prev-file-name', files[i]['name'].replace(/\s/gm, "_"));
                data.filesPrev.appendChild(img);

                let reader = new FileReader();
                reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
                reader.readAsDataURL(file);
            }
        }
    }

    static reset () {
        data.outFilesInfo.innerText = '';
        for (let i = 0; i < data.form.elements.length; i++) {
            data.form.elements[i].value = '';
        }
        data.filesPrev.innerHTML = '';
        data.uploadsFiles = [];
        data.count = 0;
        data.fileInput.style.display = "flex";
        data.dropZone.style.display = "flex";

        if (document.querySelectorAll(".valid-warning")) {
            document.querySelectorAll(".valid-warning").forEach(function(item) {
                item.innerText = '';
            });
        }
        if (document.querySelectorAll(".field-warning")) {
            document.querySelectorAll(".field-warning").forEach(function(item) {
                item.classList.remove('field-warning');
            });
        }
    }
}

