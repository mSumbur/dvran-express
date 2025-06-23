import { model, Schema, Types } from "mongoose"
import { createUGCSchema, IBaseModel, IUGCModel } from "./types"

export enum IPostType {
    nothing = -1,
    article = 0,
    mnote = 1,
    mday = 2
}

export interface IPost extends IBaseModel, IUGCModel {
    title?: string
    text: string
    openid?: string
    userId: Types.ObjectId,
    tags: Types.ObjectId[]
    type: IPostType         // 类型    
}

const postSchema = createUGCSchema<IPost>({
    title: String,
    text: String,
    openid: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'tags'
    }],
    type: {
        type: Number,
        enum: Object.values(IPostType),
        default: IPostType.nothing
    }
}, { discriminatorKey: 'type' })

export const PostModel = model<IPost>('posts', postSchema)

export const ArticleModel = PostModel.discriminator('article',
    new Schema({
        images: [{ 
            type: Schema.Types.ObjectId,
            ref: 'media'
        }]
    })
)

export const AnniversaryModel = PostModel.discriminator('anniversary',
    new Schema({
        bgImage: {
            type: Schema.Types.ObjectId,
            ref: 'media'
        }
    })
)

export const NoteModelModel = PostModel.discriminator('note', 
    new Schema({
        color: String
    })
)