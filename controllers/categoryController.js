const db = require('../models')
const Category = db.Category

const categoryController = {
    //瀏覽所有分類
    getCategories: (req, res) => {
        return Category.findAll({
            raw: true,nest: true
        }).then(categories => {
        return res.render('admin/categories',{categories: categories})
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

    }
}


module.exports = categoryController