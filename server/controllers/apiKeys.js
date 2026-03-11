const User = require("../models/User");
const { encrypt } = require("../utils/encryption");

const getApiKey = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      provider: user.provider,
      hasApiKey: !!user.apiKey
    })
  } catch (error) {
    res.status(500).json({ error: error.message });  
}
};

const setApiKey = async (req, res) => {
  try {
    const { provider, apiKey } = req.body;
    const encryptedApiKey = encrypt(apiKey);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        provider,
        apiKey: encryptedApiKey
      },
      { returnDocument: 'after' }
    );
    res.json({
      message: "API key saved successfully"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getApiKey, setApiKey }