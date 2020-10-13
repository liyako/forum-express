const db = require('../../models')
const Restaurant = db.Restaurant
const Category = db.Category
const adminService = require('../../services/adminService')

const adminController = {
  //瀏覽所有餐廳
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res,(data => {
      return res.json(data)
    }))
  },
  //瀏覽單一餐廳
  getRestaurant: (req, res) => {
    adminService.getRestaurant(req,res,(data) => {
      return res.json(data)
    })
  },
  //刪除
  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req,res,(data) => {
      return res.json(data)
    })
  },
}
module.exports = adminController