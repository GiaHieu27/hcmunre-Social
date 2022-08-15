const removeTemp = require("../helpers/removeTemp");

exports.imageUpload = async (req, res, next) => {
  try {
    if (!req.files || Object.values(req.files).flat().length === 0) {
      return res.status(400).json({ message: "No files selected" });
    }
    let files = Object.values(req.files).flat();
    files.forEach((file) => {
      if (
        file.mimetype !== "image/jpeg" &&
        file.mimetype !== "image/jpg" &&
        file.mimetype !== "image/png" &&
        file.mimetype !== "image/gif" &&
        file.mimetype !== "image/webp"
      ) {
        removeTemp(file.tempFilePath);
        return res
          .status(400)
          .json({ message: "Định dạng tệp tin không được hỗ trợ" });
      }

      if (file.size > 1024 * 1024 * 10) {
        removeTemp(file.tempFilePath);
        return res.status(400).json({ message: "Dung lượng file quá lớn" });
      }
    });

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
