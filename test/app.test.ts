import request from 'supertest';
import { app, server } from '../index';  // 导入你的 Express 应用
// import { describe, it } from 'node:test';

jest.mock('express-jwt', () => {
    return {
        expressjwt: jest.fn().mockImplementation(() => (req: any, res: any, next: any) => next()),  // 模拟 JWT 通过
    }
})

describe('GET /api/features', () => {
    it('should return a 200 status and a message', async () => {
        const response = await request(app).get('/api/features')
        expect(response.status).toBe(200)
        expect(response.body.code).toBe(200)
        expect(response.body.data).toEqual([])
    })

    // 关闭服务器
    afterAll((done) => {
        // @ts-ignore
        server.close(done)        
        // app.close(done)  // 关闭服务器并传递 done 回调
    })
})

// describe('POST /api/article', () => {
//     it('should return a 200 status and a article', async () => {
//         const response = await request(app).post('/api/article').send({})
//         expect(response.status).toBe(200)
//     })
// })

