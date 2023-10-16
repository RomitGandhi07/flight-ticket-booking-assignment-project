import express from 'express';
import { registerTravelerController } from './register';
import { loginTravelerController } from './login';
const router = express.Router();

router.post('/register', registerTravelerController);
router.post('/login', loginTravelerController);

export { router as travelersRouter};