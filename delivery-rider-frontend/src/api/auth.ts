import axios from 'axios';

export const loginRider = async (email: string, password: string) => {
  const res = await axios.post(
    'http://localhost:8081/api/users/api/auth/login',
    { withCredentials: true },
    { email, password }
  );
  return res.data;
};
