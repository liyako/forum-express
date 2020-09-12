const db = require('../models') 
const Restaurant = db.Restaurant

const adminController = {
    //瀏覽所有餐廳
    getRestaurants: (req, res) => {
      return Restaurant.findAll({raw: true}).then(restaurants => {
        return res.render('admin/restaurants',{restaurants: restaurants})
      })
    },
    //新增餐廳
    createRestaurant: (req,res) => {
      return res.render('admin/create')
    },
    postRestaurant: (req, res) => {
      if (!req.body.name) {
        req.flash('error_messages', "name didn't exist")
        return res.redirect('back')
      }
      return Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description
      })
        .then((restaurant) => {
          req.flash('success_messages', 'restaurant was successfully created')
          res.redirect('/admin/restaurants')
        })
    },
    //瀏覽單一餐廳
    getRestaurant: (req, res) => {
      return Restaurant.findByPk(req.params.id,{raw: true}).then(restaurant => {
        return res.render('admin/restaurant',{restaurant: restaurant})
      })
    },
    //編輯餐廳資訊
    editRestaurant: (req, res) => {
      return Restaurant.findByPk(req.params.id,{ raw: true }).then(restaurant => {
        return res.render('admin/create',{restaurant: restaurant})
      })
    },
    putRestaurant: (req, res) => {
      if (!req.body.name) {
        req.flash('error_messages', "name didn't exist")
        return res.redirect('back')
      }
      return Restaurant.findByPk(req.params.id)
      .then((restaurant) => {
        restaurant.update({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description
        })
          .then((restaurant) => {
            req.flash('success_messages', 'restaurant was successfully to update')
            res.redirect('/admin/restaurants')
          })
      })
    },
    //刪除
    deleteRestaurant: (req, res) => {
      return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        restaurant.destroy()
        .then((restaurant) => {
          res.redirect('/admin/restaurants')
        })
      })
    },
  }
  
  module.exports = adminController