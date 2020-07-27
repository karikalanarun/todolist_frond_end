import jwt_decode from 'jwt-decode';

export const isUserLoggedIn: () => boolean = () => {
  const authToken = localStorage.getItem('auth_token');
  if (!authToken) {
    return false;
  }
  let current_time = new Date().getTime() / 1000;
  let exp = (jwt_decode(authToken) as any).exp;
  if (!exp) {
    return true;
  }
  if (current_time > exp) {
    return false;
  }

  return true;
};

export const isUserNotLoggedIn: () => boolean = () => !isUserLoggedIn();
