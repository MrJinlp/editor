/** 
 * tips
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                                         *
 *  1.需要真机调试,输入框那边绑定的是confirm事件,如需开发者工具查看请改成失焦事件                *
 *  2.rich-text的img标签,只支持网络图片                                                      *
 *  附官方说明 https://developers.weixin.qq.com/miniprogram/dev/component/rich-text.html    *
 *                                                                                         *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 **/


const imageStyle = 'height:8rem; width:90%; margin:.2rem auto;display:block'
const textStyle = 'display:block;'
Page({
  data: {
    isHide: true,// 显示输入框
    content: [],// 节点数组
  },
  // 选择图片
  addPhoto: function (e) {
    const that = this
    let { content } = this.data
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        that.upload(res.tempFilePaths[0])
      }
    })
  },

  // 显示文本输入框
  showInput: function (e) {
    console.log('e', e)
    if (this.data.isHide === false) {
      return
    }
    this.setData({ isHide: false })
  },

  // textarea文本的完成事件
  textConfirm: function (e) {
    const that = this
    const value = e.detail.value
    this.addNode({
      name: 'p', value, success: function () {
        that.setData({ isHide: true, value: '' })
      }
    })
  },

  // 清空确认操作
  isClear: function () {
    const that = this
    const { content } = this.data
    if (!content.length > 0) {
      return wx.showToast({
        title: '当前并未编辑内容，无需清空',
        icon: 'none',
      })
    }
    return wx.showModal({
      title: '确认清空',
      content: '该操作将会清空当前编辑的内容',
      success(res) {
        if (res.confirm) {
          that.clear()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  // 清空
  clear: function () {
    this.setData({ content: [] })
  },

  // 上传图片
  upload: function (filePath) {
    const that = this
    const uploadTask = wx.uploadFile({
      url: '你的上传地址',
      filePath: filePath,
      name: 'image',
      success(res) {
        const data = res.data
        that.addNode({ name: 'img', filePath })
      },
      fail(err) {
        console.log('fail', err)
        that.addNode({ name: 'img', filePath }) //自己定义请求失败逻辑，这里做测试用
      },
    })

    // 显示上传进度
    uploadTask.onProgressUpdate((res) => {
      wx.showLoading({
        title: `已上传${res.progress}%`,
      })
      if (res.progress === 100) {
        return setTimeout(function () {
          wx.hideLoading()
        }, 1500)
      }
    })
  },

  // 添加节点
  addNode: function (option) {
    let { content } = this.data
    let { success, name, value, filePath, type } = option
    let node = {}
    name === 'img' ?
      node = {
        name: name,
        attrs: {
          class: `article-${name}`,
          style: imageStyle,
          src: filePath,
        },
      } :
      node = {
        name: name,
        attrs: {
          class: 'text-content text',
          style: '  display:block;',
        },
        children: [{
          type: 'text',
          text: value
        }]
      }
    type==='confirm'?null:content.push(node)
    this.setData({ content }, function () {
      success ? success() : null
    })
  },

  // 撤销上一步
  reset: function (e) {
    let { content } = this.data
    if (content.length === 0) {
      return
    }
    content.pop()
    this.setData({ content })
  },
})
