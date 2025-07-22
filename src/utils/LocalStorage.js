export const setLoginStatus = (status) => {
  localStorage.setItem('isLoggedIn', JSON.stringify(status));
};

export const getLoginStatus = () => {
  return JSON.parse(localStorage.getItem('isLoggedIn')) || false;
};

export const setUserData = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUserData = () => {
  return JSON.parse(localStorage.getItem('user'));
};

export const clearLoginStatus = () => {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('user');
};
