const multer = require('multer');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

// Configure how multer does store things
// multer is the package to extract the file from the req url, parse, read and write it
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // executed when we try to save the file
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid mime type');
        if (isValid)
            error = null;
        cb(error, './backend/images')// Will save the file in the images folder
    },
    filename: (req, file, cb) => { // creating the file name with extension
        const name = file.originalname.toLowerCase().split(' ').join('-')
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});

module.exports = multer({ storage: storage }).single('image');
