const multer = require('multer');

const MIME_TYPE_MAP = {
   'image/png': 'png',
   'image/jpg': 'jpg',
   'image/jpeg': 'jpg'

}
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      const isValid = MIME_TYPE_MAP[file.mimetype];
      let error = new Error('invalid mime type');
      if (isValid) {
         error = null;
      }
      cb(error, 'backend/images')
   },
   filename: (req, file, callback) => {
      const name = file.originalname.toLowerCase().split(' ').join('-');
      const ext = MIME_TYPE_MAP[file.mimetype];
      callback(null, name + '-' + Date.now() + '.' + ext)
   }
})

module.exports = multer({ storage: storage }).single('image')