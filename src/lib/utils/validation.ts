export const validateEmail = (email: string): boolean => {
    const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return emailPattern.test(email);
  };
  
  export const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };