import { Router, Request, Response } from 'express';
import prisma from '../database/prisma';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';
import passport from '../config/passport';

const router = Router();

router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, firstName, lastName, password } = req.body;

    if (!email || !firstName || !lastName || !password) {
      res.status(400).json({ success: false, message: 'Email, first name, last name, and password are required' });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      res.status(409).json({ success: false, message: 'User already exists' });
      return;
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashedPassword,
      }
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { id: newUser.id, email: newUser.email, firstName: newUser.firstName, lastName: newUser.lastName },
    });
  } catch (error) {
    console.error('[AUTH] Register error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { 
        token, 
        userId: user.id, 
        email: user.email, 
        firstName: user.firstName, 
        lastName: user.lastName,
        provider: user.provider,
        profilePicture: user.profilePicture,
        tier: user.tier
      },
    });
  } catch (error) {
    console.error('[AUTH] Login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Google OAuth routes
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    session: false, // Disable sessions
    failureRedirect: 'http://localhost:5173/login?error=oauth_failed' 
  }),
  async (req, res) => {
    try {
      const user = req.user as any;
      
      if (!user) {
        return res.redirect('http://localhost:5173/login?error=oauth_failed');
      }

      // Generate JWT token
      const token = generateToken(user.id);

      // Redirect to frontend with token
      res.redirect(`http://localhost:5173/auth/callback?token=${token}&userId=${user.id}&email=${user.email}&firstName=${user.firstName}&lastName=${user.lastName}&provider=${user.provider}&profilePicture=${encodeURIComponent(user.profilePicture || '')}&tier=${user.tier}`);
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.redirect('http://localhost:5173/login?error=oauth_failed');
    }
  }
);

export default router;
