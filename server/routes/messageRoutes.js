// routes/messageRoutes.js - FIXED VERSION

import express from 'express';  // ✅ Fixed typo: was "exprsess"
import { getMessage, getusersForSidebar, markMessageAsSeen, sendMessage } from '../controllers/messageController.js';
import { protectRoute } from '../middleware/auth.js';

const messageRouter = express.Router();  // ✅ Fixed: was "exprsess.Router()"

messageRouter.get('/users', protectRoute, getusersForSidebar);
messageRouter.get('/:id', protectRoute, getMessage);
messageRouter.put('/mark/:id', protectRoute, markMessageAsSeen);
messageRouter.post('/send/:id', protectRoute, sendMessage);

export default messageRouter;