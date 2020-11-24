class Storage {

    checkSize (files) {
        let size = this.getSize(files, data.limitSize),
            count = this.getCount(files, data.limitCount);
        return size && count;
    }

    getSize (files, limit) {
        let size = 0;
        for (let i = 0; i < files.length; i++) {
            size +=files[i]['size'];
        }

        if (size > limit)  {
            limit = Math.floor((limit / 1024 / 1024).toFixed(2));
            data.info.push(`Максимальный размер файлов - до ${limit}Mb`);
            View.warningFiles(data.info);
            data.info = [];
            return false
        } else {
            return size;
        }
    }

    getCount (files, limit) {
        let count = files.length;
        if (count > limit) {
            data.info.push(`Максимальное кол-во файлов: ${limit}`);
            View.warningFiles(data.info);
            data.info = [];
            return false;
        } else {
            return count;
        }
    }

    checkFiles (files, limit) {
        for (let i = 0; i < files.length; i++) {
            let file = files[i],
                name = files[i]['name'].replace(/\s/gm, "_"),
                sizeKb = (files[i]['size'] / 1024).toFixed(2),
                sizeMb = (files[i]['size'] / 1024 / 1024).toFixed(2),
                type = files[i]['type'].replace(/.*\//gm, '');
            if (this.checkName(name)) return;
            data.count++;
            this.addFiles(limit, file, name, sizeKb, sizeMb, type);
        }
    }

    checkName (name) {
        for (let k in data.uploadsFiles) {
            if (data.uploadsFiles[k].name === name) {
                data.info.push(`Файл с именем: ${name} уже добавлен`);
                View.warningFiles(data.info);
                data.info = [];
                return true;
            }
        }
    }

    addFiles (limit, file, name, sizeKb, sizeMb, type) {
        if (data.count <= limit) {
            data.uploadsFiles.push({file: file, name: name, sizeKb: sizeKb, sizeMb: sizeMb, type: type});
            View.showFileInfo(this.getFilesInfo(data.uploadsFiles), data.outFilesInfo);
        } else {
            data.info.push(`Максимальное кол-во файлов: ${limit}`);
            View.warningFiles(data.info);
            data.info = [];
            return;
        }
        if (data.count === limit) {
            data.fileInput.style.display = "none";
            data.dropZone.style.display = "none";
        }
    }

    getFilesInfo (files) {
        let filesInfo = {};
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                let fileName = files[i]['name'],
                    fileSize = files[i]['sizeKb']  + 'Kb',
                    fileType = files[i]['type'];
                filesInfo[i] = {name:fileName, size:fileSize, type:fileType};
            }
            return filesInfo;
        } else {
            return false;
        }
    }

}
