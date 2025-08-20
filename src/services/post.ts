import { IPost, PostModel } from "../db/model/post.model";

namespace PostService {
    /**
     * 创建帖子
     * @param value     
     */
    export async function createPost(value: IPost & { tagIds?: number[], tagNames?: string[] }) {
        const { _id, type, openid, userId, text } = value
        const post = await PostModel.create({
            
        })
    }
}