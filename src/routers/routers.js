import { pollPost, pollGet, pollGetChoice, pollResults } from '../controllers/poll.controller.js';
import { choicePost, choicevotePost } from '../controllers/choice.controller.js';
import express from 'express';
// import hasInfos from '../middlewares/middleware.js';

const router = express.Router();
router.post('/poll', pollPost);
router.get('/poll', pollGet)
router.post('/choice', choicePost)
router.get('/poll/:id/choice', pollGetChoice)
router.post('/choice/:id/vote', choicevotePost)
router.get('/poll/:id/result', pollResults)

export default router;