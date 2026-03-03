import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { hashPassword, verifyPassword } from '../utils/hash.js';
import { signJWT } from '../utils/jwt.js';

const router = express.Router();

router.post('/register',
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['DONOR','NGO']),
  async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { name, email, password, role, phone, orgName } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });
    const passwordHash = await hashPassword(password);
    const user = await User.create({ name, email, passwordHash, role, phone, orgName });
    const token = signJWT(user);
    res.json({ token, user: { _id: user._id, name, email, role, phone, orgName } });
  }
);

router.post('/login',
  body('email').isEmail(),
  body('password').notEmpty(),
  async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = signJWT(user);
    res.json({ token, user: { _id: user._id, name: user.name, email, role: user.role } });
  }
);

export default router;
