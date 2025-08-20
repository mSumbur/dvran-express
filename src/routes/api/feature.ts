import express from "express"
import { jwtAuthOption } from "../../middleware/jwtAuth"
import axios from "axios"
import { MediaModel, PostModel, UserModel } from "../../db/model"
import { Types } from "mongoose"
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
        { icon: '🔝', name: 'ᠥᠩᠬᠦᠷᠢᠯ ᠦᠰᠥᠭᠳᠤ ᠬᠥᠰᠢᠭᠡ', path: '/module-board/index?title=ᠥᠩᠬᠦᠷᠢᠯ\nᠦᠰᠥᠭᠳᠤ\nᠬᠥᠰᠢᠭᠡ' },
        { icon: '📝', name: 'ᠲᠡᠮᠳᠡᠭᠯᠡᠯ', path: '/pages/note/index?title=ᠲᠡᠮᠳᠡᠭᠯᠡᠯ' },
        { icon: '📅', name: 'ᠲᠤᠷᠠᠰᠬᠠᠯ ᠢᠨ ᠡᠳᠤᠷ', path: '/module-mday/index?title=ᠲᠤᠷᠠᠰᠬᠠᠯ\nᠢᠨ ᠡᠳᠤᠷ' },
        // { icon: '🎇', name: 'ᠭᠠᠯ ᠵᠢᠷᠤᠭ', path: '/module-galpic/index?title=ᠭᠠᠯ ᠵᠢᠷᠤᠭ' },
        // { icon: '🌤️', name: 'ᠴᠠᠭ ᠠᠭᠤᠷ', path: '/module-weather/detail?title=ᠴᠠᠭ ᠠᠭᠤᠷ' },
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

router.get('/syncolddata', async (req, res) => {
    const resp = await axios.get('https://app.dvran.cn/api/post?select[0]=delta&select[1]=text')
    const data = []
    if (resp?.data?.code == 200) {
        const list = resp.data.data || []
        for (let i = 0; i < list.length; i++) {
            const post = list[i]
            let user = await UserModel.findOne({
                openid: post.user?.openid
            })
            if (!user) {
                user = new UserModel()
                user.openid = post.user.openid
                user.nickname = post.user?.nickName
                user.bio = post.user?.description
                user.avatar = process.env?.MEDIA_DOMAIN + '/' + post.user?.avatar
                await user.save() 
            }
            const imageList = []
            for (let j = 0; j < post.images?.length; j++) {
                let image = await MediaModel.findOne({
                    url: process.env?.MEDIA_DOMAIN + '/' + post.images[j].name
                })
                if (!image) {
                    image = new MediaModel()
                    image.url = process.env?.MEDIA_DOMAIN + '/' + post.images[j].name
                    image.width = post.images[j].width
                    image.height = post.images[j].height
                    image.userId = post.user._id
                    image.size = 0
                    image.type = 0
                    await image.save()
                }
                imageList.push(image)
            }
            const newPost = await new PostModel()
            newPost.userId = new Types.ObjectId(user._id)
            newPost.openid = user.openid
            newPost.media = imageList.map(i => i._id) as any
            newPost.text = post.text
            newPost.delta = post.delta?.map((i: any) => ({ value: i.insert })) as any
            await newPost.save()
            data.push(newPost)
        }
    }
    res.json({
        code: 200,
        data
    })
})

export default router
