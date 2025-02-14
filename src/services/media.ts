import { Media } from "../db/model"

export async function createMedia(value: any) {
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