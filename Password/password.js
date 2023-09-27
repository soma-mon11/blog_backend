import crypto from "crypto"

export const hash = async (password) => {
    return new Promise((resolve, reject) => {
        const salt = crypto.randomBytes(128).toString("hex")

        crypto.scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) reject(err);
            resolve(salt + ":" + derivedKey.toString('hex'))
        });
    })
}

export const verify = async (password, hash) => {
    return new Promise((resolve, reject) => {
        const [salt, key] = hash.split(":")
        crypto.scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) reject(err);
            resolve(key == derivedKey.toString('hex'))
        });
    })
}
export const generatehash = async (data) => {
    const hash_data = crypto.createHash('sha256').update(data).digest('hex');
    return hash_data;
}

