export const baseDomain = 'https://taliaapp.co';

export default {
  VERIFICATION_USER_HANDLE: (param: string) => `${baseDomain}/check/${param}`,
};
