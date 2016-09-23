var mongoose =require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var DanmuSchema = new Schema({
    text:String,
    color:String,
    size:String,
    position:String,
    time:String,
    movie:[{type:ObjectId,ref:'movie'}],
    meta:{
        createAt:{
            type:Date,
            default:Date.now()
        },
        updateAt:{
            type:Date,
            default:Date.now()
        }
    }
});
DanmuSchema.pre('save',function(next){
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    next();
});
DanmuSchema.statics = {
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
module.exports = DanmuSchema;