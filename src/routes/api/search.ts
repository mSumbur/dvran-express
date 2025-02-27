import express from "express"
import { IPageQuery, pageQuery } from "../../middleware/validaters"
import { findArticlesByText } from "../../services/article"
import validate from "../../middleware/validate"
import { matchedData, query } from "express-validator"
import { getTextLines } from "../../utils/getTextLines"
import { findTagsByText } from "../../services/tag"

const router = express.Router()

/**
 * @openapi
 * /search:
 *  get:
 *      summary: 搜索接口
 *      tags: [搜索]
 */
router.get('/search', validate([
    query('q').isString().withMessage('q must be a string'),
    query('t').isString().withMessage('t must be a string')
]), pageQuery, async (req, res) => {
    const query = req.query
    const q = query.q as string
    const t = query.t
    let result = null
    let data = []
    if (t == 'article') {
        result = await findArticlesByText(q, query as any)
        const deviceWidth = parseInt(req.get('DeviceWidth') + '')
        const renderWidth = deviceWidth / 2
        const maxHeight = renderWidth * 1.6
        const minHeight = renderWidth
        for (let i = 0; i < result.rows.length; i++) {
            const item = result.rows[i].dataValues
            const calcHeight = item.images?.length
                ? renderWidth * item.images?.[0].height / item.images?.[0].width
                : renderWidth * 1.2
            const renderHeight = calcHeight > maxHeight ? maxHeight : calcHeight < minHeight ? minHeight : calcHeight
            const lines = await getTextLines({
                text: item.text,
                textSize: 16,
                wrapHeight: renderHeight
            })
            data.push({
                ...item,
                lines: lines.slice(0, 2),
                moreLines: lines.length > 2
            })
        }        
    } else if (t == 'tag') {
        result = await findTagsByText(q, query as any)
        data = result.rows
    } else if (t == 'user') {

    }
    res.json({
        data: data,
        page: query.page,
        count: query.count,
        total: result?.count
    })
})

export default router