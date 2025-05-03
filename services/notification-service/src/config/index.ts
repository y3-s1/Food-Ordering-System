import dotenv from 'dotenv';
dotenv.config();

export const PORT         = Number(process.env.PORT) || 5004;
export const MONGO_URI    = process.env.MONGO_URI!;
export const JWT_SECRET   = process.env.JWT_SECRET!;

export const EMAIL_HOST   = process.env.EMAIL_HOST!;
export const EMAIL_PORT   = process.env.EMAIL_PORT!;
export const EMAIL_USER   = process.env.EMAIL_USER!;
export const EMAIL_PASS   = process.env.EMAIL_PASS!;

export const SMS_ACCOUNT_SID  = process.env.SMS_ACCOUNT_SID!;
export const SMS_AUTH_TOKEN   = process.env.SMS_AUTH_TOKEN!;
export const SMS_FROM_NUMBER  = process.env.SMS_FROM_NUMBER!;
