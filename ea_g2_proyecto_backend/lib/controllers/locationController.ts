import { Request, Response } from 'express';
import { ILocation } from '../models/locations/model';
import CommentService from '../models/comments/service';
import UserService from '../models/users/service';
import ActivityService from '../models/activities/service';
import LocationService from '../models/locations/service';

export class LocationController {

    private comment_service: CommentService = new CommentService();
    private user_service: UserService = new UserService();
    private activity_service: ActivityService = new ActivityService();
    private location_service: LocationService = new LocationService();

    public async createLocation(req: Request, res: Response) {
        try{
            // this check whether all the filds were send through the request or not
            if (req.body.location && req.body.activities) {
                const location_params: ILocation = {
                    location: req.body.location,
                    active: true,
                    activities: req.body.activities
                };
                const location_data = await this.location_service.createLocation(location_params);
                return res.status(201).json({ message: 'location created successfully', location: location_data });
            }else{ 
                return res.status(400).json({ error: 'Missing fields' });
            }
        }catch(error){
            console.log(error);
            return res.status(500).json({ error: 'Internal server error createLocation' });
        }
    }

    public async getLocation(req: Request, res: Response) {
        try{
            if (req.params.id) {
                const location_filter = { _id: req.params.id };
                const location_data = await this.location_service.populateLocation(location_filter);
                // Send success response
                return res.status(200).json({ data: location_data, message: 'Successful'});
            } else {
                return res.status(400).json({ error: 'Missing fields' });
            }
        }catch(error){
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    public async getLocations(req: Request, res: Response) {
        try{
            if(req.params.page){
                const page_filter: number = +req.params.page;
                const location_list = await this.location_service.get5Locations(page_filter);
                return res.status(200).json(location_list);
            }else{
                return res.status(400).json({ error: 'Missing fields' });
            }
        }catch(error){
            console.log(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    public async getLength(req: Request, res: Response){
        try{
            const location_length = await this.location_service.locationLength();
            return res.status(200).json(location_length);
        }catch(error){
            console.log(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    public async updateLocation(req: Request, res: Response) {
        try {
            if (req.params.id) {
                const location_filter = { _id: req.params.id };
                const location_data = await this.location_service.filterLocation(location_filter);
                if (!location_data) {
                    return res.status(400).json({ error: 'location not found'});
                }
                const location_params: ILocation = {
                    location: req.body.location || location_data.location,
                    active: req.body.active || location_data.active,
                    activities: req.body.activities || location_data.activities
                };
                await this.location_service.updateLocation(location_params, location_filter);
                const new_location_data = await this.location_service.filterLocation(location_filter);
                return res.status(200).json({ data: new_location_data, message: 'Successful'});
            } else {
                return res.status(400).json({ error: 'Missing ID parameter' });
            }
        } catch (error) {
            console.error("Error updating:", error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    
    

    public async deleteLocation(req: Request, res: Response) {
        try {
            if (req.params.id) {
                const delete_details = await this.location_service.deleteLocation(req.params.id);
                if (delete_details.deletedCount != 0) {
                    return res.status(200).json({ message: 'Successful'});
                } else {
                    return res.status(400).json({ error: 'location not found' });
                }
            } else {
                return res.status(400).json({ error: 'Missing Id' });
            }
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    public async deactivateLocation(req: Request, res: Response){
        try{
            const location_filter = { _id: req.params.id };
            const location_data = await this.location_service.filterLocation(location_filter);
            if (!location_data) {
                return res.status(400).json({ error: 'location not found'});
            }
            const location_params: ILocation = {
                location: location_data.location,
                active: false,
                activities: location_data.activities
            };
            await this.location_service.updateLocation(location_params, location_filter);
            const new_location_data = await this.location_service.filterLocation(location_filter);
            return res.status(200).json({ data: new_location_data, message: 'Successful'});
        }catch(error){
            console.log(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}