const { Media } = require("../db/model")

async function createMedia(value) {
    const media = await Media.create({
        hash: value.hash,
        key: value.key,
        width: value.width,
        height: value.height,
        url: value.url,
        type: value.fileType
    })
    return media
}

module.exports = {
    createMedia
}