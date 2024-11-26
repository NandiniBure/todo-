const mongoose=require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true},
  desc: { type: String},
  userId: { type:mongoose.Schema.Types.ObjectId,ref:'User',required:true },
  completed:{type:Boolean,default:false},
  dueDate:{type:Date},
},{timestamps:true});

module.exports=mongoose.model('Task',TaskSchema);
