//index.js
//获取应用实例
import { translate } from '../../utils/api.js' 
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    query: '',
    hideClearIcon: true,
    result: [],
    curLang: 'auto',
    languageList: app.globalData.langList,
    curIndex:app.globalData.langList[0].index,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.query) {
      this.setData({ query: options.query})
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let language = wx.getStorageSync('language')
    if (language.lang !== this.data.curLang){
      this.setData({ curLang: language.lang,curIndex:language.langid })
      this.onConfirm()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  onInput:function(e){
    this.setData({ 'query': e.detail.value })
    if (this.data.query.length > 0) {
      this.setData({ 'hideClearIcon': false })
    } else {
      this.setData({ 'hideClearIcon': true })
    }
  },
  onTapClose:function(){
    this.setData({'query':'','hideClearIcon':true})
  },
  onConfirm:function(){
    if(!this.data.query) return
    translate(this.data.query, { from:'auto',to: this.data.curLang }).then((res)=>{
      this.setData({
        'result':res.trans_result
      })

      let history = wx.getStorageSync('history') || []
      history.unshift({ query: this.data.query, result: res.trans_result[0].dst,langid:this.data.curIndex})
      history.length = history.length > 10 ? 10 : history.length
      wx.setStorageSync('history', history)
    })
  },
  activeLang:function(e){
    let index = e.target.dataset.key
    this.setData({
      curIndex: index
    });
    this.selectLang(index)
    this.onConfirm()
  },
  selectLang:function(index){
    this.data.languageList.map((s) => {
      if (s.index === index) {
        this.setData({ 'curLang': s.lang })
        let language = wx.getStorageSync('language')||{}
        language.lang = s.lang
        language.langid = index
        wx.setStorageSync('language', language)
      }
    })
  }
})
