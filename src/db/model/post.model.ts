import { model, Schema, Types } from "mongoose"
import { createUGCSchema, IBaseModel, IUGCModel } from "./types"

export enum PostStatus {
    pending = 0,   // 待审核
    approved = 1,  // 审核通过
    rejected = 2,  // 审核拒绝
    archived = 3,  // 归档（下线）
}

export enum PostVisibility {
    public = 0,   // 所有人可见
    private = 1,  // 仅自己可见
    friends = 2,  // 仅好友可见
}

export enum PostRecommendType {
    none = 0,
    home = 1,      // 首页推荐
    hot  = 2,      // 热门
    topic = 3,     // 专题页推荐
}

export enum PostContentType {
    text = 0,
    image = 1,
    video = 2,
    link = 3
}

export interface IPost extends IBaseModel, IUGCModel {
    title?: string
    text: string
    delta?: object
    openid?: string
    userId: Types.ObjectId    
        
    status: PostStatus
    isPinned: boolean
    isRecommended: boolean
    recommendType: PostRecommendType   // 0: 不推荐, 1: 首页, 2: 热门
    visibility: PostVisibility    
    contentType: PostContentType
    flags: string[]

    tags: Types.ObjectId[]
    media?: Types.ObjectId[]
}

const postSchema = createUGCSchema<IPost>({
    title: String,
    text: String,
    openid: String,
    delta: { type: [Schema.Types.Mixed], select: false },

    userId: { type: Schema.Types.ObjectId, ref: 'users' },
    tags: [{ type: Schema.Types.ObjectId, ref: 'tags' }],
    media: [{ type: Schema.Types.ObjectId, ref: 'media' }],

    isPinned: { type: Boolean, default: false },
    isRecommended: { type: Boolean, default: false },
    recommendType: { type: Number, enum: PostRecommendType, default: PostRecommendType.none },
    contentType: { type: Number, enum: PostContentType, default: PostContentType.image },
    visibility: { type: Number, enum: PostVisibility, default: PostVisibility.public },
    status: { type: Number, enum: PostStatus, default: PostStatus.approved },                
    flags: { type: [String], default: [] } // ['hot', 'featured', 'ad']
})

// 虚拟字段 user
postSchema.virtual('user', {
    ref: 'users',
    localField: 'userId',
    foreignField: '_id',
    justOne: true
})
postSchema.set('toObject', { virtuals: true })
postSchema.set('toJSON', { virtuals: true })

export const PostModel = model<IPost>('posts', postSchema)

// export const ArticleModel = PostModel.discriminator('article',
//     new Schema({
        
//     })
// )

// export const AnniversaryModel = PostModel.discriminator('anniversary',
//     new Schema({
//         bgImg: {
//             type: Schema.Types.ObjectId,
//             ref: 'media'
//         },
//         style: Object
//     })
// )

// export const NoteModelModel = PostModel.discriminator('note',
//     new Schema({
//         color: String
//     })
// )