import * as mongoose from 'mongoose';

export interface ILocation {
    _id?: mongoose.Types.ObjectId;
    location: string;
    active: boolean;
    activities: mongoose.Types.ObjectId;
}