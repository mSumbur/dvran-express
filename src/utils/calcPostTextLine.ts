import { Request } from "express"
import { IMedia } from "../db/model/media.model"
import { getTextLines } from "../utils/getTextLines"

export default async function calcPostTextLine(
    req: Request, 
    list: any[], 
    options?: {
        keyStr?: string,
        isDeviceHeight?: boolean
    }
) {

    const deviceWidth = parseInt(req.get('DeviceWidth') + '')
    const renderWidth = deviceWidth / 2
    const maxHeight = renderWidth * 1.6
    const minHeight = renderWidth

    const data = []
    for (let i = 0; i < list.length; i++) {
        const item = options?.keyStr ? list[i][options.keyStr] : list[i]
        const media = item.media as unknown as IMedia[]
        const calcHeight = media.length
            ? renderWidth * media?.[0]?.height / media?.[0]?.width
            : renderWidth * 1.2
        const renderHeight = calcHeight > maxHeight ? maxHeight : calcHeight < minHeight ? minHeight : calcHeight
        const lines = await getTextLines({
            text: item.text.substring(0, 100),
            textSize: 16,
            wrapHeight: options?.isDeviceHeight ? deviceWidth : renderHeight
        })
        data.push({
            ...item,
            lines: lines.slice(0, 2),
            // moreLines: item.text.length > 100,
            moreLines: lines.length > 2,
            renderHeight
        })
    }

    return data
}