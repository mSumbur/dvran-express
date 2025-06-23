import { model, Schema, Types } from "mongoose"
import { createSchema, IBaseModel } from "./types"

export enum IPostActionsType {
    like = 1,
    collect = 2,
    read = 3,
    report = 4
}

export interface IPostActions extends IBaseModel {
    postId: Types.ObjectId
    type: IPostActionsType
}

const postActionsSchema = createSchema<IPostActions>({
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'posts'
    },
    type: {
        type: Number,
        enum: Object.values(IPostActionsType)
    }
})

export const PostActionsModel = model<IPostActions>('post_actions', postActionsSchema)