import Comment, { CommentCreationAttributes } from "../db/model/comment"

/**
 * 创建评论
 * @param value CommentCreationAttributes
 * @returns 
 */
export async function createComment(value: CommentCreationAttributes) {
    const comment = await Comment.create(value)
    return comment
}