// currently makes trouble in dev
// const { REACT_APP_API } = process.env;

export const mainURL = "https://onlineberatung.net";
export const XHRheader = { AcceptLanguage: "de" };
export const loginEndpoint = `${mainURL}/auth/realms/caritas-online-beratung/protocol/openid-connect/token`;
export const customerEndpoint = `${mainURL}/customers`;
export const counselorEndpoint = `${mainURL}/counselors`;
