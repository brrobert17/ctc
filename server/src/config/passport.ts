import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import prisma from '../database/prisma';

// Google OAuth strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists
          let user = await prisma.user.findUnique({
            where: { email: profile.emails?.[0]?.value },
          });

          if (user) {
            // User exists, return user
            return done(null, user);
          }

          // Create new user
          user = await prisma.user.create({
            data: {
              email: profile.emails?.[0]?.value || '',
              firstName: profile.name?.givenName || '',
              lastName: profile.name?.familyName || '',
              password: '', // No password for OAuth users
              provider: 'google',
              profilePicture: profile.photos?.[0]?.value || null,
            },
          });

          return done(null, user);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );
} else {
  console.warn('Google OAuth not configured - missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET');
}

export default passport;
