const storage = multer =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './storage/uploads')
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    }
  })

module.exports = storage
