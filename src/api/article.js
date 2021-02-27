/**
 * 文章相关请求
 */

'user strict'

import request from '@/utils/request'

// 获取文章频道列表
export const getChannels = () => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/channels'
  })
}

// 获取文章列表
export const getArticles = params => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/articles',
    params
  })
}

// 修改文章评论状态
export const changeStatus = (articleId, allowComment) => {
  return request({
    method: 'PUT',
    url: '/mp/v1_0/comments/status',
    params: {
      article_id: articleId // 文章 id
    },
    data: {
      allow_comment: allowComment // 是否允许评论
    }
  })
}

// 发布文章
export const addArticles = data => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/articles',
    params: {
      draft: false
    },
    data
  })
}

// 删除文章
export const deleteArticle = articleId => {
  return request({
    method: 'DELETE',
    url: `/mp/v1_0/articles/${articleId}`
  })
}

// 获取指定文章
export const getArticleItem = articleId => {
  return request({
    method: 'GET',
    url: `/mp/v1_0/articles/${articleId}`
  })
}

// 修改文章
export const changeArticle = (articleId, data, draft = false) => {
  return request({
    method: 'PUT',
    url: `/mp/v1_0/articles/${articleId}`,
    params: {
      draft
    },
    data
  })
}
