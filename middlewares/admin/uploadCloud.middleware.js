const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});

module.exports.upload = async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }

    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "products"
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);

    req.body[req.file.fieldname] = result.secure_url;

    next();

  } catch (error) {
    console.error("Cloudinary Error:", error);

    req.flash("error", "Upload ảnh thất bại!");

    return res.redirect("back");
  }
};