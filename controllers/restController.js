const db = require('../models') 
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
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
        categoryName: r.Category.name
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
        {model:Comment, include:[User]}
      ]
    }).then(restaurant => {
      //console.log(restaurant.Comments[0].dataValues)
      return res.render('restaurant',{
        restaurant: restaurant.toJSON()
      })
    })
  },
}
module.exports = restController