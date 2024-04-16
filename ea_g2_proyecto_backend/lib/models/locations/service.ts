import { ILocation } from './model';
import locations from './schema';
import ActivityService from '../activities/service';
import mongoose, { Types } from 'mongoose';

export default class LocationService {
    
    public async createLocation(location_params: ILocation): Promise<ILocation> {
        try {
            const session = new locations(location_params);
            return await session.save();
        } catch (error) {
            throw error;
        }
    }

    public async filterLocation(query: any): Promise<ILocation | null> {
        try {
            return await locations.findOne(query);
        } catch (error) {
            throw error;
        }
    }

    public async get5Locations(page: number): Promise<ILocation[] | null>{
        try {
            const activityLocations = await locations.find({active: true});
            return activityLocations.slice(page*5, 5*(page+1));
        } catch (error) {
            throw error;
        }
    }

    public async locationLength(): Promise<number | null>{
        try {
            return (await locations.find({active: true})).length
        } catch (error) {
            throw error;
        }
    }

    public async updateLocation(location_params: ILocation, location_id: any): Promise<void> {
        try {
            await locations.findOneAndUpdate(location_id, location_params);
        } catch (error) {
            throw error;
        }
    }

    public async deleteLocation(_id: string): Promise<{ deletedCount: number }> {
        try {
            const location = await locations.findOne({ _id });
            if (!location) {
                throw new Error('location not found');
            }
    
            // Eliminar el comentario de la colección de comentarios
            const deletionResult = await locations.deleteOne({ _id });
            if (deletionResult.deletedCount !== 1) {
                throw new Error('location deletion failed');
            }
            return deletionResult;

        } catch (error) {
            throw error;
        }
    }


    public async populateLocation(query: any): Promise<ILocation | null> {
        try {
            const location = await locations.findOne(query).populate('activities').exec();
            if (!location) {
                return null;
            }
            const populatedLocation: ILocation = {
                ...location.toObject(),
                _id: location._id
            };
            return populatedLocation;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}