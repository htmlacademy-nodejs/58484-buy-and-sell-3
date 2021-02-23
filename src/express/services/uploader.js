'use strict';

const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);

const UPLOAD_DIR = `../upload/img/`;

const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const createStorage = (uploadDir) => {
  return multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      const uniqueName = nanoid(10);
      const extension = file.originalname.split(`.`).pop();
      cb(null, `${uniqueName}.${extension}`);
    }
  });
};

const storage = createStorage(uploadDirAbsolute);

module.exports = {
  uploader: multer({storage}),
  getUploader(uploadDir) {
    return multer({storage: createStorage(uploadDir)});
  }
};
