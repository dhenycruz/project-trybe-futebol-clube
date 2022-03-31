const verifyEmail = (email: string): true | false => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

export default verifyEmail;
