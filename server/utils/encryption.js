const crypto = require("crypto")
const dotenv = require("dotenv")
dotenv.config()

const algorithm = "aes-256-cbc"
const secretKey = process.env.ENCRYPTION_SECRET
const ivLength = 16

function encrypt(text) {

  const iv = crypto.randomBytes(ivLength)

  const key = crypto.createHash("sha256")
    .update(secretKey)
    .digest()

  const cipher = crypto.createCipheriv(
    algorithm,
    key,
    iv
  )

  let encrypted = cipher.update(text, "utf8", "hex")
  encrypted += cipher.final("hex")

  return iv.toString("hex") + ":" + encrypted
}

function decrypt(text) {

  const parts = text.split(":")

  const iv = Buffer.from(parts[0], "hex")
  const encryptedText = parts[1]

  const key = crypto.createHash("sha256")
    .update(secretKey)
    .digest()

  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    iv
  )

  let decrypted = decipher.update(encryptedText, "hex", "utf8")
  decrypted += decipher.final("utf8")

  return decrypted
}

module.exports = { encrypt, decrypt }