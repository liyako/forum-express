const db = require('../models') 
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const Favorite  = db.Favorite
const User = db.User

//分頁
const pageLimit = 10


let restController = {
  //index
  getRestaurants: (req, res) => {
    let whereQuery ={}
    let categoryId =''
    let offset = 0
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit 
    }
    if(req.query.categoryId){
      categoryId = Number(req.query.categoryId)
      whereQuery['CategoryId'] = categoryId
    }
    return Restaurant.findAndCountAll({include:Category,where: whereQuery,offset:offset,pageLimit:pageLimit})
    .then(result => {
      let page = Number(req.query.page) || 1
      let pages = Math.ceil(result.count / pageLimit)
      let totalPage = Array.from({length:pages}).map((item,index) => index +1)
      let prev = page -1 < 1 ? 1 : page - 1
      let next = page + 1 > pages ? pages : page + 1
      const data = result.rows.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0,50),
        isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(r.id),
        isLiked: req.user.LikedRestaurants.map(d => d.id).includes(r.id)
      }))
      //console.log(restaurants) 
      Category.findAll({ raw: true,nest: true}).then(categories => {
        return res.render('restaurants', {
          restaurants: data,
          categories: categories,
          page:page,totalPage:totalPage,prev:prev,next:next,
          categoryId: categoryId
        })
      })
    })
  },
  //顯示單一資料
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id,{
      include:[
        Category,
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' },
        {model:Comment, include:[User]}
      ]
    }).then(restaurant => {
      const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id)
      const isLiked = restaurant.LikedUsers.map(d => d.id).includes(req.user.id)
      restaurant.viewCounts++
      restaurant.save()
      return res.render('restaurant',{
        restaurant: restaurant.toJSON(),
        isFavorited: isFavorited,
        isLiked: isLiked
      })
    })
  },
  //最新動態排序
  getFeeds: (req, res) => {
    return Restaurant.findAll({
      limit: 10,
      raw: true,
      nest: true,
      order: [['createdAt', 'DESC']],
      include: [Category]
    }).then(restaurants => {
      Comment.findAll({
        limit: 10,
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant]
      }).then(comments => {
        return res.render('feeds', {
          restaurants: restaurants,
          comments: comments
        })
      })
    })
  },
  //瀏覽 dashboard
  getDashboard: (req, res) => {
    return Restaurant.findByPk(req.params.id,{
      include:[
        Category,
        {model:Comment, include:[User]},
        {model: User, as: 'FavoritedUsers'}
      ]
    }).then(restaurant => {
      return res.render('dashboard',{
        restaurant: restaurant.toJSON()
      })
    })
  },
  //getToprestaurant
  getToprestaurant: (req, res) => {
    return Restaurant.findAll({
      include: [
        { model: User, as: 'FavoritedUsers' }
      ]
    }).then(restaurants => {
      restaurants = restaurants.map(restaurant => ({
        ...restaurant.dataValues,
        description: restaurant.dataValues.description.substring(0,50),
        FavoriterCount: restaurant.FavoritedUsers.length,
        isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(restaurant.id)
      }))
      restaurants = restaurants.sort((a, b) => b.FavoriterCount - a.FavoriterCount).slice(0, 10)
      return res.render('topRestaurant', { restaurants: restaurants })
    })
  },
}
module.exports = restController