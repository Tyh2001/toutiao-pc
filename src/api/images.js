/**
 * 素材相关
 */

'user strict'

import request from '@/utils/request'

/**
 * 获取用户图片素材
 * @param {Object} params 素材信息
 */
export const getImages = params => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/user/images',
    params
  })
}

/**
 * 收藏图片素材
 * @param {Number} imgId 图片 id
 * @param {Object} collect 是否收藏
 */
export const CollectionImages = (imgId, collect) => {
  return request({
    method: 'PUT',
    url: `/mp/v1_0/user/images/${imgId}`,
    data: {
      collect
    }
  })
}
