import { pollPost, pollGet } from '../controllers/poll.controller.js';
import { choicePost } from '../controllers/choice.controller.js';
import express from 'express';
import hasInfos from '../middlewares/middleware.js';

const router = express.Router();
router.use(hasInfos)
router.post('/poll', pollPost);
router.get('/poll', pollGet)
router.post('/choice', choicePost)

export default router;