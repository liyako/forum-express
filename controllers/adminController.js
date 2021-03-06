const db = require('../models') 
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const fs = require('fs')
const restaurant = require('../models/restaurant')
const imgur = require('imgur-node-api')
const adminService = require('../services/adminService')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminController = {
    //瀏覽所有餐廳
    getRestaurants: (req, res) => {
      adminService.getRestaurants(req, res,(data => {
        return res.render('admin/restaurants',data)
      }))
    },
    //新增餐廳
    createRestaurant: (req,res) => {
      Category.findAll({
        raw: true,
        nest: true
      }).then(categories => {
        return res.render('admin/create',{
          categories: categories
        })
      })
    },
    postRestaurant: (req, res) => {
      if(!req.body.name){
        req.flash('error_messages', "name didn't exist")
        return res.redirect('back')
      }
    
      const { file } = req
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID);
        imgur.upload(file.path, (err, img) => {
          return Restaurant.create({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: file ? img.data.link : null,
            CategoryId: req.body.categoryId,
          }).then((restaurant) => {
            req.flash('success_messages', 'restaurant was successfully created')
            return res.redirect('/admin/restaurants')
          })
        })
      }
      else {
        return Restaurant.create({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: null,
          CategoryId: req.body.categoryId
        }).then((restaurant) => {
          req.flash('success_messages', 'restaurant was successfully created')
          return res.redirect('/admin/restaurants')
        })
       }
    },
    //瀏覽單一餐廳
    getRestaurant: (req, res) => {
      adminService.getRestaurant(req,res,(data) => {
        return res.render('admin/restaurant', data)
      })
    },
    //編輯餐廳資訊
    editRestaurant: (req, res) => {
      Category.findAll({
        raw: true,
        nest: true
      }).then(categories => {
        return Restaurant.findByPk(req.params.id,{ raw: true }).then(restaurant => {
        return res.render('admin/create',{
          categories: categories,
          restaurant: restaurant
          })
        })
      })
    },
    putRestaurant: (req, res) => {
      if(!req.body.name){
        req.flash('error_messages', "name didn't exist")
        return res.redirect('back')
      }
    
      const { file } = req
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID);
        imgur.upload(file.path, (err, img) => {
          return Restaurant.findByPk(req.params.id)
            .then((restaurant) => {
              restaurant.update({
                name: req.body.name,
                tel: req.body.tel,
                address: req.body.address,
                opening_hours: req.body.opening_hours,
                description: req.body.description,
                image: file ? img.data.link : restaurant.image,
                CategoryId: req.body.categoryId
              })
              .then((restaurant) => {
                req.flash('success_messages', 'restaurant was successfully to update')
                res.redirect('/admin/restaurants')
              })
            })
        })
      }
      else {
        return Restaurant.findByPk(req.params.id)
          .then((restaurant) => {
            restaurant.update({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: restaurant.image,
              CategoryId: req.body.categoryId
            })
            .then((restaurant) => {
              req.flash('success_messages', 'restaurant was successfully to update')
              res.redirect('/admin/restaurants')
            })
          })
      }
    },
    //刪除
    deleteRestaurant: (req, res) => {
      adminService.deleteRestaurant(req,res,(data) => {
        if (data['status'] === 'success'){
          res.redirect('/admin/restaurants')
        }
      })
    },
    //瀏覽所有使用者
    getUsers: (req, res) => {
      return User.findAll({raw: true})
        .then(users => {
        return res.render('admin/users',{users: users})
        })
    },
    //編輯使用者權限
    putUsers: (req, res) => {
      return User.findByPk(req.params.id)
        .then(user => {
          if(req.user.id  == user.id){
            req.flash('error_messages', "permission denied")
            return res.redirect('back')
          }
          if (!user.isAdmin) {
            user.update({isAdmin: true})
            req.flash('success_messages', user.name+" set as admin")
          } else {
            user.update({isAdmin: false})
            req.flash('success_messages', user.name+" set as user")
          }
        })
        .then((user) => {
          req.flash('success_messages', "user was successfully to update")
          res.redirect('/admin/users')
        })
    },
  }
  
  module.exports = adminController