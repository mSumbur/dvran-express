export { default as UserModel } from "./user"
export { default as ArticleModel } from "./article"
export { default as ArticleMediaModel } from "./articleMedia"
export { default as TagModel } from "./tag"
export { default as MediaModel } from "./media"
export { default as ArticleTagModel } from "./articleTag"
export { default as ArticleLikeModel } from "./articleLike"
export { default as ArticleCollectModel } from "./articleCollect"
export { default as UserFollowModel } from "./userFollow"
export { default as MessageModel } from "./message"
export { default as CommentModel } from "./comment"
// 扩展功能
export { default as NodeModel } from "./note"
export { default as MdayModel } from "./mday"

/**
 * 
 * 1.posts:
 *  帖子、倒数日、笔记
 *
 *   帖子：图片
 *   倒数日：图片北京、目标日期
 *   笔记：
 * 
 * 2.post_actions:
 *  浏览（100条）、点赞、收藏、举报
 * 3.post_comments:
 *  评论
 * 4.users:
 *  用户
 * 5.user_actions:
 *  关注、拉黑
 * 6.media:
 *  图片、视频
 * 7.tags:
 *  标签
 * 8.notices:
 *  通知
 * 
 */
