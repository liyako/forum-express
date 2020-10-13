const express = require('express')
const router = express.Router()

const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js') 
const userController = require('../controllers/userController.js')
const categoryController = require('../controllers/categoryController.js')
const commentController = require('../controllers/commentController')


const passport = require('../config/passport')

const multer = require('multer')
const upload = multer({dest: 'temp/'})

const authenticated = (req,res,next) => {
     if (req.isAuthenticated()) {
         return next()
     }
     res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.isAdmin) { return next() }
      return res.redirect('/')
    }
    res.redirect('/signin')
}
//index
router.get('/',authenticated, (req, res) => res.redirect('/restaurants'))
router.get('/restaurants',authenticated, restController.getRestaurants)
//show
router.get('/restaurants/feeds', authenticated, restController.getFeeds)//注意順序
router.get('/restaurants/top', authenticated, restController.getToprestaurant)
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
//dashboard
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)
//comment
router.post('/comments',authenticated, commentController.postComment)
//delete
router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)
//Favorite
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)
//Like
router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)
//follow
router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)
//==============admin====================================
//連到admin 頁面就轉到/admin/restaurants
router.get('/admin',authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))
router.get('/admin/restaurants',authenticatedAdmin, adminController.getRestaurants)
router.get('/admin/users',authenticatedAdmin, adminController.getUsers)
router.put('/admin/users/:id', authenticatedAdmin, adminController.putUsers)
//admin create
router.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
router.post('/admin/restaurants',authenticatedAdmin,upload.single('image'),adminController.postRestaurant)
//admin show
router.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)
//admin edit
router.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
router.put('/admin/restaurants/:id', authenticatedAdmin,upload.single('image') ,adminController.putRestaurant)
//admin delete
router.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)

//=============category======================================================
//連到admin 頁面就轉到/admin/categories
router.get('/admin/categories',authenticatedAdmin, categoryController.getCategories)
//categories create
router.post('/admin/categories',authenticatedAdmin, categoryController.postCategory)
//categories edit
router.get('/admin/categories/:id/edit', authenticatedAdmin, categoryController.getCategories)
router.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory)
//categories delete
router.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)
//==============signup/signin====================================
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)
//TopUser注意順序
router.get('/users/top', authenticated, userController.getTopUser)
//Profile
router.get('/users/:id',authenticated, userController.getUser)
//editProfile
router.get('/users/:id/edit',authenticated, userController.editUser)
router.put('/users/:id', authenticated,upload.single('image'),userController.putUser)

module.exports = router