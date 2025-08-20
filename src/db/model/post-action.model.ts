import { model, Schema, Types } from "mongoose"
import { createSchema, IBaseModel } from "./types"

export enum IPostActionType {
    like = 1,
    collect = 2,
    read = 3,
    report = 4
}

export interface IPostAction extends IBaseModel {
    postId: Types.ObjectId
    userId: Types.ObjectId
    type: IPostActionType
}

const postActionSchema = createSchema<IPostAction>({
    postId: { type: Schema.Types.ObjectId, ref: 'posts' },
    userId: { type: Schema.Types.ObjectId, ref: 'users' },
    type: { type: Number, enum: IPostActionType }
})

const PostActionModel = model<IPostAction>('post_actions', postActionSchema)

export default PostActionModel