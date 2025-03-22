import express from "express";
import { jwtAuth } from "../../middleware/jwtAuth";
import NoteService from "../../services/note";
import { body, matchedData, param } from "express-validator";
import { IPageQuery, pageQuery } from "../../middleware/validaters";
import validate from "../../middleware/validate";

const router = express.Router()

/**
 * @openapi
 * /note/:id:
 *  get:
 *      summary: 获取笔记详情
 *      tags: [扩展功能-笔记]
 */
router.get('/note/:id', jwtAuth, validate([
    param('id').toInt().isInt().withMessage('id must be an integer')
]), async (req, res) => {
    const { id } = matchedData(req)
    const note = await NoteService.findNoteById(id)
    console.log('id: ', id, note)
    res.json({
        code: note ? 200 : 404,
        data: note
    })
})

/**
 * @openapi
 * /notes:
 *  get:
 *      summary: 获取当前用户全部笔记
 *      tags: [扩展功能-笔记]
 */
router.get('/notes', jwtAuth, pageQuery, async (req, res) => {
    const { userId } = req.auth
    const query: IPageQuery = matchedData(req)    
    const result = await NoteService.findNotesByUserId({ ...query, userId })
    res.json({
        code: 200,
        data: result.rows,
        total: result.count,
        page: query.page,
        count: query.count
    })
})

/**
 * @openapi
 * /note:
 *  post:
 *      summary: 创建笔记
 *      tags: [扩展功能-笔记]
 */
router.post('/note', jwtAuth, validate([
    body('text').isString().withMessage('text must be a string')
]), async (req, res) => {
    const { userId, openid } = req.auth
    const { text } = req.body
    const note = await NoteService.createNote({
        userId, openid, text
    })
    res.json({
        code: note ? 200 : 400,
        data: note
    })
})

/**
 * @openapi
 * /note/:id:
 *  patch:
 *      summary: 修改笔记
 *      tags: [扩展功能-笔记]
 */
router.patch('/note/:id', jwtAuth, validate([
    param('id').toInt().isInt().withMessage('id must be an integer'),
    body('text').isString().withMessage('text must be a string')
]), async (req, res) => {
    const { userId } = req.auth
    const { id, text } = matchedData(req)
    const note = await NoteService.updateNote({ userId, id, text })
    res.json({
        code: note ? 200 : 400,
        data: note
    })
})

/**
 * @openapi
 * /note/:id:
 *  delete:
 *      summary: 删除笔记
 *      tags: [扩展功能-笔记]
 */
router.delete('/note/:id', jwtAuth, validate([
    param('id').toInt().isInt().withMessage('id must be an integer')
]), async (req, res) => {
    const { id } = matchedData(req)
    const result = await NoteService.removeNote(id)
    res.json({
        code: result ? 200 : 400,
        data: result
    })
})

export default router