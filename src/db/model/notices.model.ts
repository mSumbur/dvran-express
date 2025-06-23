import { model, Schema, Types } from "mongoose";
import { createSchema, IBaseModel } from "./types";

export interface INotices extends IBaseModel {
    title: string
    content: string
    relationId: Types.ObjectId
}

const noticesSchema = createSchema<INotices>({
    title: String,
    content: String,
    relationId: {
        type: Schema.Types.ObjectId,
        ref: 'posts'
    }    
})

export const NoticesModel = model<INotices>('notices', noticesSchema)