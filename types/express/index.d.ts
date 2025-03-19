// import { Request as EXRequest } from "express"

import * as express from 'express';

export {}

declare global {
    namespace Express {
        interface Request {
            auth: {
                userId: number,
                openid: string,
                isAdmin: boolean
            }
        }
    }
}