import request from '@/utils/request'

// 获取文章列表
export const getArticlesList = params => {
  return request({
    method: 'GET',
    url: '/app/v1_1/articles',
    params
  })
}

// 获取文章详情
export const getArticleDetail = articleId => {
  return request({
    method: 'GET',
    url: `/app/v1_0/articles/${articleId}`
  })
}

// 收藏文章
export const addCollect = articleId => {
  return request({
    method: 'POST',
    url: '/app/v1_0/articles/collections',
    data: {
      target: articleId
    }
  })
}

// 取消收藏文章
export const deleteCollect = articleId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/articles/collections/${articleId}`
  })
}
