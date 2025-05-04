import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Profile, VerifyCallback } from 'passport-google-oauth20';
import User, { IUser } from '../models/User';

// Log environment variables for debugging
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET);
console.log('GOOGLE_CALLBACK_URL:', process.env.GOOGLE_CALLBACK_URL);

// Validate required options
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('Missing Google OAuth credentials in environment variables');
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ): Promise<void> => {
      try {
        let user: IUser | null = await User.findOne({ email: profile.emails?.[0]?.value });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: profile.emails?.[0]?.value,
            password: '', // Consider generating a random password or skipping this field
            isVerified: true,
            isAdmin: false,
          });
        }

        done(null, user); // Pass user object, avoid false unless intentional
      } catch (err) {
        done(err as Error, undefined);
      }
    }
  )
);

passport.serializeUser((user: Express.User, done) => {
  const typedUser = user as IUser;
  done(null, typedUser._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user || null); // Null if not found, not false
  } catch (err) {
    done(err as Error, null);
  }
});

export default passport;