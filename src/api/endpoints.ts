const { REACT_APP_API } = process.env;

export const mainURL = REACT_APP_API;
export const XHRheader = { AcceptLanguage: "de" };
export const loginEndpoint = `${mainURL}/access-tokens`;
export const customerEndpoint = `${mainURL}/customers`;
export const counselorEndpoint = `${mainURL}/counselors`;
