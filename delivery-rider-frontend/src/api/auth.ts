import axios from 'axios';
import { registerDriverStatus } from '../api/delivery';

const handleLoginSuccess = async (user: string) => {
  try {
    const defaultLat = 0;
    const defaultLng = 0;

    await registerDriverStatus(user, defaultLat, defaultLng);
  } catch (err: any) {
    if (err.response?.status === 409) {
      // Driver is already registered, safe to continue
      console.log('Driver already registered.');
    } else {
      console.error('Failed to register driver status:', err);
    }
  }
};

export const loginRider = async (email: string, password: string) => {
  const res = await axios.post(
    'http://localhost:5004/api/auth/login',
    { email, password },
    { withCredentials: true }
  );

  const user = res.data.user._id;
  await handleLoginSuccess(user);

  return res.data;
};
