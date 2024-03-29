import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Service = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true

    },
    image: {
        type: String,
        required: true
    }
}
,
{
    timestamps:true
}

)

export default mongoose.model('Service', Service)