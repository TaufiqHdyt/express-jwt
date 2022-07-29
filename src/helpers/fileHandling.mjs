import fs from 'node:fs/promises';
import path from 'node:path';
import config from '#config/app.config.json' assert { type: 'json' };
import multer from 'multer';

import hash from '#helper/hash.mjs';

const MB = Math.pow(1024, 2);

const checkAllowedType = (mimetype) => {
  const accepted = ['image/png', 'image/jpeg', 'image/bmp', 'image/gif'];
  const isAllow = accepted.filter((type) => mimetype === type);
  return !!isAllow.length;
};

const storage = (dest) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, `/public/img/${dest}`));
    },
    filename: (req, file, cb) => {
      const extenstion = path.extname(file.originalname);
      const filename = `${Date.now()}_${hash.randomNumber()}${extenstion}`;
      cb(null, filename);
    },
  });
};

const fileFilter = (req, file, cb) => {
  const check = checkAllowedType(file.mimetype);
  if (!check) cb(new Error('File type not allowed!'));
  cb(null, check);
};

const limits = () => ({
  fieldNameSize: 100,
  files: 3,
  fileSize: 1 * MB,
});

class _fileHandling {
  upload = (destName) => {
    try {
      return multer({ storage: storage(destName), fileFilter, limits });
    } catch (error) {
      if (config.debug)
        console.error(`upload fileHandling helper error`, error);
      return {
        status: false,
        error,
      };
    }
  };

  remove = async (req, res, next) => {
    try {
      const { type, fileName } = req.query;
      await fs.unlink(path.join(__dirname, `/public/img/${type}/${fileName}`));
      next()
    } catch (error) {
      if (config.debug)
        console.error(`remove fileHandling helper error`, error);
      return {
        status: false,
        error,
      };
    }
  };
}

export default new _fileHandling();
