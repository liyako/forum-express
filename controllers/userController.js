const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Favorite  = db.Favorite
const Like  = db.Like
const Followship = db.Followship  
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    // confirm password
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      // confirm unique user
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_messages', '信箱重複！')
          return res.redirect('/signup')
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            req.flash('success_messages', '成功註冊帳號！')
            return res.redirect('/signin')
          })
        }
      })
    }
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  //瀏覽 Profile 
  getUser: (req, res) => {
    return User.findByPk(req.params.id,{ 
      include:[
        Comment,
        {model:Comment, include:[Restaurant]},
        {model: User, as: 'Followings'},
        {model: User, as: 'Followers'},
        {model: Restaurant, as: 'FavoritedRestaurants'}
      ]
    })
    .then(user => {
      const isFollowings = req.user.Followings.map(d => d.id).includes(user.id)
      const isFollowers = req.user.Followers.map(d => d.id).includes(user.id)
      const isFavoritedRestaurants = req.user.FavoritedRestaurants.map(d => d.id).includes(user.id)
      const isFollowed = req.user.Followings.map(d => d.id).includes(user.id)
      
      const set = new Set()
      const checkid = []
      const leagth = user.Comments.length
      for (i=0;i<leagth;i++){
        checkid.push( user.Comments[i].dataValues )
      }
      const result = checkid.filter(item=>!set.has(item.RestaurantId)?set.add(item.RestaurantId):false) 
      return res.render('users',{
        user: user.toJSON(),
        isFollowings: isFollowings,
        isFollowers: isFollowers,
        isFavoritedRestaurants:isFavoritedRestaurants,
        isFollowed:isFollowed,
        result:result
      })
    })
  },
  //編輯單一Profile資訊
  editUser: (req, res) => {
    return User.findByPk(req.params.id,{ raw: true})
      .then(user => {
      return res.render('edituser',{user: user})
    })
  },
  putUser: (req, res) => {
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(req.params.id)
          .then((user) => {
            user.update({
              name: req.body.name,
              image: file ? img.data.link : user.image
            })
            .then((user) => {
              req.flash('success_messages', 'user was successfully to update')
              res.redirect(`/users/${req.params.id}`)
            })
          })
      })
    }
    else {
      return User.findByPk(req.params.id)
        .then((user) => {
          user.update({
            name: req.body.name,
            image: user.image,
          })
          .then((user) => {
            req.flash('success_messages', 'user was successfully to update')
            res.redirect(`/users/${req.params.id}`)
          })
        })
    }
  },
  //Favorite 
  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })
     .then((restaurant) => {
       return res.redirect('back')
     })
   },

   removeFavorite: (req, res) => {
    return Favorite.findOne({where: {
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    }})
      .then((favorite) => {
        favorite.destroy()
         .then((restaurant) => {
           return res.redirect('back')
         })
      })
  },
  //like
  addLike: (req, res) => {
    return Like.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })
     .then((restaurant) => {
       return res.redirect('back')
     })
   },
   removeLike: (req, res) => {
    return Like.findOne({where: {
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    }})
      .then((like) => {
        like.destroy()
         .then((restaurant) => {
           return res.redirect('back')
         })
      })
  },
  //getTopUser
  getTopUser: (req, res) => {
    return User.findAll({
      include: [
        { model: User, as: 'Followers' }
      ]
    }).then(users => {
      users = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
      }))
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
      return res.render('topUser', { users: users })
    })
  },
  //Following
  addFollowing: (req, res) => {
    return Followship.create({
      followerId: req.user.id,
      followingId: req.params.userId
    })
     .then((followship) => {
       return res.redirect('back')
     })
   },
   removeFollowing: (req, res) => {
    return Followship.findOne({where: {
      followerId: req.user.id,
      followingId: req.params.userId
    }})
      .then((followship) => {
        followship.destroy()
         .then((followship) => {
           return res.redirect('back')
         })
      })
   }
}

module.exports = userController