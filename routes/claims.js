import express from 'express';
import { body, validationResult } from 'express-validator';
import Claim from '../models/Claim.js';
import Donation from '../models/Donation.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// NGO claims a donation
router.post('/', authMiddleware,
  body('donationId').notEmpty(),
  async (req,res)=>{
    if (req.user.role !== 'NGO') return res.status(403).json({ error: 'Only NGOs can claim' });
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const donation = await Donation.findById(req.body.donationId);
    if (!donation || donation.status !== 'OPEN') return res.status(400).json({ error: 'Donation not available' });
    const claim = await Claim.create({ donationId: donation._id, ngoId: req.user._id, note: req.body.note });
    donation.status = 'CLAIMED';
    await donation.save();
    res.status(201).json(claim);
  }
);

// Donor approves/rejects claim
router.patch('/:id', authMiddleware, async (req,res)=>{
  const { status } = req.body;
  const claim = await Claim.findById(req.params.id).populate('donationId');
  if (!claim) return res.status(404).json({ error: 'Not found' });
  if (String(claim.donationId.donorId) !== req.user._id) return res.status(403).json({ error: 'Not your donation' });
  const allowed = ['APPROVED','REJECTED','PICKED_UP'];
  if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' });
  claim.status = status;
  await claim.save();
  res.json(claim);
});

// My claims (NGO) or incoming claims (Donor)
router.get('/mine', authMiddleware, async (req,res)=>{
  const q = req.user.role === 'NGO' ? { ngoId: req.user._id } : {};
  const claims = await Claim.find(q).sort({ createdAt: -1 }).limit(100);
  res.json(claims);
});

export default router;
