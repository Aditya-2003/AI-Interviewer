const { PDFParse } = require('pdf-parse');
const User = require("../models/User");
const axios = require("axios");

async function setResume(req, res) {
  try {

    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded"
      })
    }

    const fileUrl = req.file.path;
    const response = await axios.get(fileUrl, {
      responseType: "arraybuffer"
    });
    
    const parser = new PDFParse({url : fileUrl});
    const parsed = await parser.getText();

    await User.findByIdAndUpdate(req.user.id, {
      resumeUrl: fileUrl,
      resumeText: parsed.text.slice(0, 8000),
      resumeFileName: req.file.originalname,
      resumeUploadedAt: new Date()
    });

    res.json({
      message: "Resume uploaded successfully",
      resumeUrl: fileUrl,  
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getResume = async (req, res) => {
  const user = await User.findById(req.user.id)

  if (!user) {
    return res.status(404).json({
      message: "User not found"
    })
  }

  if (!user.resumeUrl) {
    return res.json({ resumeUrl: null, resumeText: null })
  }

  res.json({ resumeUrl: user.resumeUrl, resumeText: user.resumeText, resumeFileName: user.resumeFileName, uploadedAt: user.resumeUploadedAt })
}
module.exports = { setResume, getResume };