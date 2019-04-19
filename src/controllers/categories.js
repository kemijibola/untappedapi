const BaseController = require('./baseController');

class Categories extends BaseController {
    constructor(lib){
        super();
        this.lib = lib;
    }

    async index(req, res, next) {
        const categories = this.lib.db.model('Category').find();
        this.writeHAL(res, categories);
    }

    async create(req, res, next){
        const body = req.body;
        if(body){
            try{
                const category = await this.lib.db.model('Category').findOne({name: body.name}).cache();
                if(!category) next(this.transformResponse(res, false, 'ResourceNotFoundError', 'Category not found'))

                let newCategory = this.lib.db.model('Category')(body);
                const category = await newCategory.save();
                const halObj = this.writeHAL(category);
                return this.transformResponse(res, true, halObj, 'Create operation successful');
            }catch(err){
                next(this.transformResponse(res, false, 'InternalServerError', err.message))
            }
        }else {
            next(this.transformResponse(res, false, 'InvalidContent', 'Missing json data.'));
        }
    }

}

module.exports = function(lib){
    let controller = new Categories(lib);
    controller.addAction({
        'path': '/categories',
        'method': 'POST',
        'summary': 'Adds a new category to the database',
        'responseClass': 'Category',
        'nickName': 'addCategory',
    }, controller.create)

    return controller;
}