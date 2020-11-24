let data = {
    // url : 'http://vic4884g.bget.ru/_feedback_out/',
    url : 'http://vic4884g.bget.ru/_quiz_parser/done/mailer/quiz-mail.php',
    form : document.querySelector("#feedback"),
    attachments : document.querySelector("#attachments"),
    submit : document.querySelector(".submit"),
    outFilesInfo : document.querySelector(".form-files-list"),
    infoMessage : document.querySelector(".info-message"),
    dropZone : document.querySelector(".drop-zone"),
    filesPrev : document.querySelector(".files-prev"),
    fileInput : document.querySelector('label[for="attachments"]'),
    uploadsFiles : [],
    count : 0,
    limitCount : 3,
    limitSize : 2400000, //10500000 -> 10mb, 5400000 -> 5mb
    info : [],
    deleteFile: "data-delete-file",
    validate : {
        require : {
            name : '#name',
            email : '#email',
            message : '#message',
            warning : 'обязательное поле'
        },
        length : {
            name : {min : 3, max : 99},
            email : {min : 4, max : 99},
            message : {min : 5, max : 999},
            warning : {
                min : 'минимальное количество символов', 
                max : 'максимальное количество символов'
                
            },
        }
    }
};

let controller = new Controller (data);
