import express from "express"
import { jwtAuthOption } from "../../middleware/jwtAuth"
const router = express.Router()

/**
 * @openapi
 * /features:
 *  get:
 *      summary: 获取功能列表
 *      tags: [功能]
 */
router.get('/features', jwtAuthOption, async (req, res) => {
    const { isAdmin } = req.auth
    const list = [
        { icon: '⬆️', name: 'ᠥᠩᠬᠦᠷᠢᠯ ᠦᠰᠥᠭᠳᠤ ᠬᠥᠰᠢᠭᠡ', path: '/module-board/index?title=ᠥᠩᠬᠦᠷᠢᠯ\nᠦᠰᠥᠭᠳᠤ\nᠬᠥᠰᠢᠭᠡ' },
        // { icon: '📝', name: 'ᠲᠡᠮᠳᠡᠭᠯᠡᠯ', path: '/pages/note/index?title=ᠲᠡᠮᠳᠡᠭᠯᠡᠯ' },
        // { icon: '📅', name: 'ᠲᠤᠷᠠᠰᠬᠠᠯ ᠢᠨ ᠡᠳᠤᠷ', path: '/module-mday/index?title=ᠲᠤᠷᠠᠰᠬᠠᠯ\nᠢᠨ ᠡᠳᠤᠷ' },
        { icon: '🕙', name: 'ᠴᠠᠭ', path: '/module-clock/index?title=ᠴᠠᠭ' }
    ]
    if (isAdmin) {
        list.push({ icon: '💻', name: 'cms', path: '/cms/pages/home' })
    }
    res.json({
        code: 200,
        data: list
    })
})

export default router
