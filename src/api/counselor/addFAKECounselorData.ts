import { CounselorData } from "../../types/counselor";

export const fakeCounselors = (counselorResponse: CounselorData[]) => {
  const male: CounselorData = {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "js@mail.com",
    gender: "male",
    phone: "017755932591",
    active: true,
    username: "john",
    agency: "Agentur 1",
    key: "1",
  };

  const female: CounselorData = {
    id: 2,
    firstName: "Jeanne",
    lastName: "Doe",
    email: "jd2@mail.com",
    gender: "femal",
    phone: "017755932592",
    active: true,
    username: "jeanne",
    agency: "Agentur 2",
    key: "2",
  };

  for (let i = 0; i < 10; i += 1) {
    counselorResponse.push(
      i % 2 === 0
        ? {
            ...female,
            id: i + 1,
            firstName: `${female.firstName} ${i}`,
            username: `${female.username}_${i}`,
            active: (i + 1) % 2 === 0,
            key: `${i + 1}`,
          }
        : {
            ...male,
            id: i + 1,
            firstName: `${male.firstName} ${i}`,
            username: `${male.username}_${i}`,
            active: (i + 5) % 2 === 0,
            key: `${i + 1}`,
          }
    );
    // more statements
  }
};

/**
 * retrieve all needed counselor data
 * @param counselorData
 * @return data
 */
const addCounselorData = (counselorData: CounselorData) => {
  const counselorResponse: any[] = [];
  counselorResponse.push({ ...counselorData, id: counselorResponse.length });
  fakeCounselors(counselorResponse);

  // eslint-disable-next-line no-console
  console.log("FAKE add CounselorDta", counselorResponse);

  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(counselorResponse);
    }, 1000);
  });
};

export default addCounselorData;
