import { MediaModel } from "../db/model"

namespace MediaService {
    /**
     * 创建媒体
     * @param {object} value 媒体内容
     * @returns 
     */
    export async function createMedia(value: MediaModel) {
        const media = await MediaModel.create({
            hash: value.hash,
            key: value.key,
            width: value.width,
            height: value.height,
            url: value.url,
            size: value.size,
            fileType: value.fileType
        })
        return media
    }
}

export default MediaService