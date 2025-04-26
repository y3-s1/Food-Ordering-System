import { Request, Response } from 'express';
import mongoose from 'mongoose';
import User, { IUser, UserRole } from '../models/User';
import { hashPassword, comparePasswords } from '../utils/passwordUtils';
import { generateToken } from '../utils/tokenUtils';
import { sendOtpEmail, sendConfirmationEmail } from '../services/emailService';
import crypto from 'crypto';

// Define a type for token generation that matches the expected input
export interface TokenPayload {
  _id: string;
  email: string;
  isAdmin: boolean;
  role: UserRole;
}

// Register User
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      name, 
      email, 
      password, 
      role, 
      isAdmin 
    }: { 
      name: string; 
      email: string; 
      password: string; 
      role: UserRole;
      isAdmin?: boolean 
    } = req.body;

    const hashedPassword = await hashPassword(password);
    const otp = crypto.randomInt(100000, 999999).toString();

    const user: IUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role, // Add role to user creation
      isAdmin: isAdmin || false,
      otp,
      otpExpires: new Date(Date.now() + 300000), // OTP valid for 5 minutes
    });

    await sendOtpEmail(email, otp);
    res.status(201).json({ message: 'OTP sent to email',email: user.email });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};
// Verify OTP
export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp }: { email: string; otp: string } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ error: 'User not found' });
      return;
    }

    if (!user.otp || !user.otpExpires || user.otp !== otp || user.otpExpires < new Date()) {
      res.status(400).json({ error: 'Invalid or expired OTP' });
      return;
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    await sendConfirmationEmail(user.email);
    res.json({ message: 'User verified successfully' });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ error: 'OTP verification failed' });
  }
};

// Resend OTP
export const resendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email }: { email: string } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (user.isVerified) {
      res.status(400).json({ error: "User already verified" });
      return;
    }

    const newOtp = crypto.randomInt(100000, 999999).toString();
    user.otp = newOtp;
    user.otpExpires = new Date(Date.now() + 300_000);
    await user.save();

    await sendOtpEmail(user.email, newOtp);
    res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ error: "Failed to resend OTP" });
  }
};

// Login User
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: { email: string; password: string } = req.body;
    const user: IUser | null = await User.findOne({ email });

    if (!user || !user.isVerified || !(await comparePasswords(password, user.password))) {
      res.status(401).json({ error: 'Invalid credentials or user not verified' });
      return;
    }

    // Ensure _id is converted to string
    const userId = user._id instanceof mongoose.Types.ObjectId 
      ? user._id.toString() 
      : String(user._id);

    // Explicitly convert _id to string
    const tokenPayload: TokenPayload = {
      _id: userId,
      email: user.email,
      isAdmin: user.isAdmin,
      role: user.role
    };

    const token = generateToken(tokenPayload);
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(200).json({
      message: 'Login successful',
      user: {
        _id: userId,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};

// Logout User
export const logout = (req: Request, res: Response): void => {
  try {
    // Clear the authentication token cookie
    res.clearCookie('token');
    
    // Invalidate the user session if using session management
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: 'Error destroying session', error: err });
        }
      });
    }

    // Optionally, handle any additional cleanup, such as logging the user out from a database (if needed)

    // Send a success response
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    // Handle any unexpected errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: 'An error occurred while logging out', error: errorMessage });
  }
};