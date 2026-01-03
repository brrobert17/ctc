import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import prisma from '../database/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';
import { UserTier } from '@prisma/client';

const router = Router();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const clientUrl = process.env.CLIENT_URL;

const stripe = new Stripe(stripeSecretKey ?? '', {
  apiVersion: '2023-10-16',
});

type CheckoutItem = {
  name: string;
  unit_amount: number;
  quantity: number;
};

router.post('/create-checkout-session', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!stripeSecretKey) {
      res.status(500).json({ error: 'Missing STRIPE_SECRET_KEY' });
      return;
    }

    if (!clientUrl) {
      res.status(500).json({ error: 'Missing CLIENT_URL' });
      return;
    }

    if (!/^https?:\/\//i.test(clientUrl)) {
      res.status(500).json({ error: 'Invalid CLIENT_URL: must include http:// or https://' });
      return;
    }

    const { items = [], orderId } = req.body as { items?: CheckoutItem[]; orderId?: string };

    const safeItems = Array.isArray(items) ? items : [];

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: safeItems.map((i) => ({
        price_data: {
          currency: 'usd',
          product_data: { name: i.name },
          unit_amount: i.unit_amount,
        },
        quantity: i.quantity,
      })),
      success_url: `${clientUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/pricing`,
      metadata: { orderId: orderId ?? '' },
    });

    res.json({ url: session.url });
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? 'Internal server error' });
  }
});

router.post('/confirm-checkout-session', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!stripeSecretKey) {
      res.status(500).json({ error: 'Missing STRIPE_SECRET_KEY' });
      return;
    }

    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { sessionId } = req.body as { sessionId?: string };
    if (!sessionId) {
      res.status(400).json({ error: 'Missing sessionId' });
      return;
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      res.status(402).json({ error: 'Payment not completed' });
      return;
    }

    await prisma.user.update({
      where: { id: userId },
      data: { tier: UserTier.LIFETIME },
    });

    res.status(200).json({ success: true, tier: UserTier.LIFETIME });
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? 'Internal server error' });
  }
});

export default router;
