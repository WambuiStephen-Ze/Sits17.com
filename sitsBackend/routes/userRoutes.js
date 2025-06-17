//user  routes 
import express from 'express';
import { registerParent, getUser, updateUserData, loginParent } from '../controllers/userController.js';

const router = express.Router();
// registering new parent
router.post('/register', registerParent);

//login parents as users
router.post('/login', loginParent);


// get user by id
router.get('/:id', getUser);

// update user date
router.put('/:id', updateUserData);

export default router;
