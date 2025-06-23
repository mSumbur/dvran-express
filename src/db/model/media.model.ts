import { model, Schema, Types } from "mongoose";
import { createSchema, IBaseModel } from "./types";

export enum IMediaType {
    image = 0,
    video = 1
}

export interface IMedia extends IBaseModel {
    type: IMediaType
    url: string
    width: number
    height: number
    userId: Types.ObjectId
    postId: Types.ObjectId
}

const mediaSchema = createSchema<IMedia>({
    type: {
        type: Number,
        enum: Object.values(IMediaType)
    },
    url: String,
    width: Number,
    height: Number,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'posts'
    }
})

export const MediaModel = model<IMedia>('media', mediaSchema)