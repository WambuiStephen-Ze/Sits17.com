// sitter-user matching logic 
// services/matchingService.js
import { SitterProfile } from '../models/sitter.js';
import { UserProfile } from '../models/user.js';

export const findMatchingSitters = async (userLocation) => {
  try {
    const sitters = await SitterProfile.findAll({
      where: {
        location: userLocation,
        availability: true
      }
    });
    return sitters;
  } catch (error) {
    console.error('Error finding matching sitters:', error);
    throw error;
  }
};
