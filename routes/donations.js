import express from 'express';
import { body, validationResult } from 'express-validator';
import Donation from '../models/Donation.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Create donation (Donor)
router.post('/',
  authMiddleware,
  body('title').notEmpty(),
  body('servings').isInt({ min: 1 }),
  body('pickupBy').isISO8601(),
  body('location').isObject(),
  async (req,res)=>{
    if (req.user.role !== 'DONOR') return res.status(403).json({ error: 'Only donors can create donations' });
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const donation = await Donation.create({
      donorId: req.user._id,
      title: req.body.title,
      description: req.body.description,
      foodType: req.body.foodType,
      servings: req.body.servings,
      pickupBy: new Date(req.body.pickupBy),
      imageUrl: req.body.imageUrl,
      address: req.body.address,
      location: req.body.location
    });
    res.status(201).json(donation);
  }
);

// Nearby open donations (NGO)
router.get('/nearby', authMiddleware, async (req,res)=>{
  const { lng = 0, lat = 0, maxKm = 20 } = req.query;
  const donations = await Donation.find({
    status: 'OPEN',
    pickupBy: { $gte: new Date() },
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
        $maxDistance: Number(maxKm) * 1000
      }
    }
  }).limit(100);
  res.json(donations);
});

// Get donor's donations
router.get('/mine', authMiddleware, async (req,res)=>{
  const q = req.user.role === 'DONOR' ? { donorId: req.user._id } : {};
  const donations = await Donation.find(q).sort({ createdAt: -1 }).limit(100);
  res.json(donations);
});

// Update status
router.patch('/:id/status', authMiddleware, async (req,res)=>{
  const { status } = req.body;
  const allowed = ['OPEN','CLAIMED','COMPLETED','CANCELLED'];
  if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' });
  const donation = await Donation.findById(req.params.id);
  if (!donation) return res.status(404).json({ error: 'Not found' });
  if (String(donation.donorId) !== req.user._id) return res.status(403).json({ error: 'Not your donation' });
  donation.status = status;
  await donation.save();
  res.json(donation);
});

export default router;
