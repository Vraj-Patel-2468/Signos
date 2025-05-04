import multer, { StorageEngine } from "multer";
const storage: StorageEngine = multer.diskStorage({
    destination: "./uploads",
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

export default upload;