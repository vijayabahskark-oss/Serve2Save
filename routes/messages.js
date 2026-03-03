import express from 'express';
import { body, validationResult } from 'express-validator';
import Message from '../models/Message.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/thread/:userA/:userB', authMiddleware, async (req,res)=>{
  const { userA, userB } = req.params;
  const ids = [userA, userB].sort();
  const msgs = await Message.find({
    fromUserId: { $in: ids },
    toUserId: { $in: ids }
  }).sort({ createdAt: 1 });
  res.json(msgs);
});

router.post('/', authMiddleware,
  body('toUserId').notEmpty(),
  body('body').notEmpty(),
  async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const msg = await Message.create({
      fromUserId: req.user._id,
      toUserId: req.body.toUserId,
      donationId: req.body.donationId,
      body: req.body.body
    });
    res.status(201).json(msg);
  }
);

export default router;
