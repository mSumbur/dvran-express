import { Schema, Types, model } from "mongoose";
import { createUGCSchema, IBaseModel, IUGCModel } from "./types";

export interface IPostComment extends IBaseModel, IUGCModel {
    postId: Types.ObjectId
    userId: Types.ObjectId
    parentId?: Types.ObjectId
    content: string    
}

const postCommentSchema = createUGCSchema<IPostComment>({
    postId: { type: Schema.Types.ObjectId, ref: 'posts' },
    userId: { type: Schema.Types.ObjectId, ref: 'users' },
    parentId: { type: Schema.Types.ObjectId, ref: 'post_comments' },
    content: String
})

postCommentSchema.virtual('user', {
    ref: 'users',
    localField: 'userId',
    foreignField: '_id',
    justOne: true
})
postCommentSchema.set('toObject', { virtuals: true })
postCommentSchema.set('toJSON', { virtuals: true })

const PostCommentModel = model<IPostComment>('post_comments', postCommentSchema)

export default PostCommentModel