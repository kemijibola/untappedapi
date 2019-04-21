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
                let categoryModel = await this.lib.db.model('Category').findOne({name: body.name}).cache();
                if(!categoryModel) next(this.transformResponse(res, false, 'ResourceNotFoundError', 'Category not found'))
                categoryModel = this.lib.db.model('Category')(body);
                const category = await categoryModel.save();
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

module.exports = Categories