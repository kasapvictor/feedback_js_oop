class Controller {

    constructor (data) {
        this.storage = new Storage();
        data.attachments.addEventListener('change', this.change.bind(this));
        data.dropZone.addEventListener("dragenter", this.dragenter, false);
        data.dropZone.addEventListener("dragover", this.dragover, false);
        data.dropZone.addEventListener("drop", this.drop.bind(this), false);
        data.form.addEventListener('click', this.delete.bind(this));
        data.submit.addEventListener('click', this.submit.bind(this));

        // добавляем пометку "обязательное поле" из данных в data.validate.require
        for (let key in data.validate.require) {
            if (key !== 'warning') {
                let label = document.querySelector(`label[for="${key}"]`);
                let span = document.createElement("span");
                span.classList.add("valid-warning");
                label.append(" *");
                label.append(span);
            }

        }
        // вешаем событие проверку на поле из списка data.validate.require
        for (let key in data.validate.require) {
            if (key !== 'warning') {
                let el = document.querySelector(`#${key}`);
                el.addEventListener("blur", this.validate);
            }
        }
    }

    change (e) {
        if (this.storage.checkSize(e.target.files)){
            this.addFiles(e.target.files)
        }
    }

    dragenter(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    dragover(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    drop(e) {
        e.stopPropagation();
        e.preventDefault();
        let dataTransfer = e.dataTransfer,
            files = dataTransfer.files;

        if (this.storage.checkSize(files)){
            this.addFiles(files);
        }
    }

    delete(e) {
        if (e.target.hasAttribute(data.deleteFile)) {
            e.preventDefault();
            let name = e.target.getAttribute(data.deleteFile);
            for (let i = 0; i < Object.keys(data.uploadsFiles).length; i++) {
                if (data.uploadsFiles[i].name === name) {
                    data.uploadsFiles.splice(i, 1);
                    data.count--;
                }
            }
            if (Object.keys(data.uploadsFiles < data.limitSize)) {
                data.fileInput.style.display = "flex";
                data.dropZone.style.display = "flex";
            }
            document.querySelector(`[data-prev-file-name="${name}"]`).remove();
            View.showFileInfo(this.storage.getFilesInfo(data.uploadsFiles), data.outFilesInfo)
        }
    }

    addFiles (val) {
        this.storage.checkFiles(val, data.limitCount);
        View.renderFiles(val);

    }

    checkEmpty (fields) {
        let result = 1,
            warning = '';

        for (let i = 0; i < fields.length; i++) {
            let element = fields[i],
                elementID = fields[i].getAttribute("id"),
                elementValue = fields[i].value.trim(),
                elementWarning = element.previousElementSibling.querySelector(".valid-warning");

            if (data.validate.require[elementID] &&  elementValue === '') {
                warning = data.validate.require['warning'];
                View.warning(element, elementWarning, warning);
                result = 0;
            }
        }
        return result;
    }

    validate (e) {
        // проверка на пустоту и длину поля
        let warning,
            result,
            element = e.target,
            elementID = e.target.getAttribute("id"),
            elementValue = e.target.value.trim(),
            elementWarning = e.target.previousElementSibling.querySelector(".valid-warning");

        // проверка на пустоту
        if (data.validate.require[elementID] &&  elementValue === '') {
            warning = data.validate.require['warning'];
            View.warning(element, elementWarning, warning);
            result = 0;
            return;
        } else {
            View.warningReset(element, elementWarning);
            result = 1;
        }

        // проверка на количество символов
        if (data.validate.length[elementID] !== undefined) {
            if (data.validate.length[elementID].min > elementValue.length) {
                warning = `${data.validate.length.warning.min} ${data.validate.length[elementID].min}`;
                View.warning(element, elementWarning, warning);
                result = 0;
                return;
            }
            if (data.validate.length[elementID].max < elementValue.length) {
                warning = `${data.validate.length.warning.max} ${data.validate.length[elementID].max}`;
                View.warning(element, elementWarning, warning);
                result = 0;
                return;
            }
        }

        // валидация поля email
        if (elementID === 'email') {
            let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            if (reg.test(elementValue) == false) {
                warning = 'Введите корректный e-mail';
                View.warning(element, elementWarning, warning);
                result = 0;
                return;
            }
        }
        return result;
    }

    submit(e) {
        e.preventDefault();

        if (this.checkEmpty(data.form.elements)) {
            let formData = new FormData(),
                dataFields = [];

            // добавление дынных НЕ пустых полей формы в dataFields
            for (let i = 0; i < data.form.elements.length; i++) {
                if (data.form.elements[i].name !== 'submit' && data.form.elements[i].type !== 'file' && data.form.elements[i].value !== '') {
                    dataFields[data.form.elements[i].name] = data.form.elements[i].value;
                }
            }

            // добавление дынных полей формы в formData
            if (Object.keys(dataFields).length !== 0) {
                for (let data in dataFields) {
                    formData.append(data, dataFields[data]);
                }
                // добавление файлов в FormData если массив с файлами не пустой
                if (data.uploadsFiles.length !== 0) {
                    for (let file in data.uploadsFiles) {
                        formData.append(file, data.uploadsFiles[file]['file'], data.uploadsFiles[file].name );
                    }
                }
                send(formData);
                View.reset();
            }
        }
        

        function send (formData) {
            fetch ( data.url, {
                method: 'POST',
                body: formData
            }).then(response => {
                return response.json();
                // return response.text();
            }).then(data => {
                console.log(data);
            }).catch(error => {
                console.error(error)
            });
        }
    }
}