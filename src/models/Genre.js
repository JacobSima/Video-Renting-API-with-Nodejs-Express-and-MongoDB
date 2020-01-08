const mongoose = require('mongoose')
const Schema = mongoose.Schema

const genreSchema = new Schema({
  name:{
    type:String,
    minlength:4,
    maxlength:255,
    required:[true,'Please provide genre name'],
    unique:true,
    trim:true
  },
  description:{
    type:String,
    minlength:5,
    maxlength:1024,
    required:[true,'Please add some description']
  },
  

},{
  toJSON:{virtuals:true},toObject:{virtuals:true},
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

// genre cascading deletion
genreSchema.pre('remove',async function(){
  await this.model('Movie').deleteMany({genre:this._id})
})

// reverse population of movies list within the genre list
genreSchema.virtual('movies',{
  ref:'Movie',
  localField:'_id',
  foreignField:'genre',
  justOne:false,
  options:{select:'title'}
})


const Genre = mongoose.model('Genre',genreSchema)
module.exports = Genre