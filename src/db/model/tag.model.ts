import { model } from "mongoose"
import { createUGCSchema, IUGCModel, IBaseModel } from "./types"

export interface ITag extends IBaseModel, IUGCModel {
    name: string
    image: string
    description: string
}

const tagSchema = createUGCSchema<ITag>({
    name: String,
    image: String,
    description: String
})

const TagModel = model<ITag>('tags', tagSchema)

export default TagModel