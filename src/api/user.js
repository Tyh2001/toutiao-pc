/**
 * 用户相关
 */

'user strict'

import request from '@/utils/request.js'

/**
 * 登录
 * @param {Object} data 用户信息
 */
export const onLogin = data => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/authorizations',
    data
  })
}

/**
 * 获取用户信息
 */
export const getProfile = () => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/user/profile'
  })
}

/**
 * 取粉丝列表
 */
export const getFollowers = () => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/followers'
  })
}

/**
 * 获取用户个人资料
 */
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/user/profile'
  })
}

/**
 * 编辑用户个人资料
 * @param {Object} data 新的用户信息
 */
export const changUserInfo = data => {
  return request({
    method: 'PATCH',
    url: '/mp/v1_0/user/profile',
    data
  })
}

/**
 * 编辑用户头像
 * @param {Object} data 用户头像
 */
export const changUserPhoto = data => {
  return request({
    method: 'PATCH',
    url: '/mp/v1_0/user/photo',
    data
  })
}
