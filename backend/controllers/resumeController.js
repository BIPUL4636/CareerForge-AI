const Resume = require("../models/resume");

const uploadResume = async (req, res) => {
  try {
    console.log("req.file =", req.file);
    console.log("req.body =", req.body);

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const resume = await Resume.create({
      user: req.user.id,
      fileName: req.file.filename,
      filePath: req.file.path,
    });

    res.status(201).json({
      message: "Resume uploaded successfully",
      resume,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  uploadResume,
};