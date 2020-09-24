const db = require('../../models')
const Category = db.Category

const categoryService = require('../../services/categoryService.js')

const categoryController = {
    //瀏覽所有分類
    getCategories: (req, res) => {
        categoryService.getCategories(req,res, (data) => {
            return res.json(data)
        })
    }
}

module.exports = categoryController