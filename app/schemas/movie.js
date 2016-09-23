var mongoose =require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var MovieSchema = new Schema({
    doctor: String,
    title: String,
    language: String,
    country: String,
    year: String,
    summary: String,
    poster: String,
    flash:String,
    category:{
        type:ObjectId,
        ref:'Category'
    },
    danmu:{
        type:ObjectId,
        ref:'Danmu'
    },
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});
MovieSchema.pre('save',function(next){
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    next();
});
MovieSchema.statics = {
    fetch: function(cb){
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb);
    },
    findById :function(id,cb){
        return this
            .findOne({_id:id})
            .exec(cb);
    }
};
module.exports =MovieSchema;
