const db = require('../models')
const Category = db.Category

const categoryService = require('../services/categoryService.js')

const categoryController = {
    //瀏覽所有分類
    getCategories: (req, res) => {
      categoryService.getCategories(req, res, (data) => {
        return res.render('admin/categories', data)
      })
    },
    //新增分類
    postCategory: (req,res) => {
        if(!req.body.name){
            req.flash('error_messages',"name didn't exist")
            return res.render('back')
        }else{
            return Category.create({
                name: req.body.name
            }).then((category) => {
                return res.redirect('/admin/categories')
            })
        }
    },
    //編輯分類
    putCategory: (req, res) => {
        if (!req.body.name) {
          req.flash('error_messages', "name didn't exist")
          return res.redirect('back')
        } else {
          return Category.findByPk(req.params.id)
            .then((category) => {
              category.update(req.body)
                .then((category) => {
                  res.redirect('/admin/categories')
                })
            })
        }
      },
    //刪除
    deleteCategory: (req, res) => {
        return Category.findByPk(req.params.id)
        .then((category) => {
            category.destroy()
            .then((category) => {
            res.redirect('/admin/categories')
            })
        })
    },
}


module.exports = categoryController