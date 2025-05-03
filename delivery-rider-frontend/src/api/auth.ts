import axios from 'axios';

export const loginRider = async (email: string, password: string) => {
  const res = await axios.post(
    'http://localhost:5004/api/auth/login',
    { email, password },
    { withCredentials: true }
  );
  return res.data;
};
