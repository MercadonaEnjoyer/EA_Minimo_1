import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = new Schema({
    location: { type: String, required: true },
    active: { type: Boolean, required: true},
    activities: {type: Schema.Types.ObjectId, ref: 'activities', required: true}
    }
);

export default mongoose.model('locations', schema);