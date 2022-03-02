import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// import { act } from "react-dom/test-utils";
import Counselor from "./Counselor";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

test("renders Card with all the information", () => {
  render(
    <Counselor
      counselor={{
        id: 1,
        firstname: "John",
        lastname: "Doe",
        email: "js@mail.com",
        gender: "male",
        phone: "017755932591",
        active: true,
        username: "john",
        agency: "Agentur 1",
      }}
      handleDeleteCounselor={jest.fn()}
      handleEditCounselor={jest.fn()}
    />
  );

  const firstname = screen.getByText("John");
  const lastname = screen.getByText("Doe");
  expect(firstname).toBeInTheDocument();
  expect(lastname).toBeInTheDocument();

  const email = screen.getByText("email");
  const phone = screen.getByText("phone");
  const agency = screen.getByText("agency");
  const username = screen.getByText("counselor.username");
  expect(email).toBeInTheDocument();
  expect(phone).toBeInTheDocument();
  expect(agency).toBeInTheDocument();
  expect(username).toBeInTheDocument();

  const emailContent = screen.getByText("js@mail.com");
  const phoneContent = screen.getByText("017755932591");
  const agencyContent = screen.getByText("Agentur 1");
  const usernameContent = screen.getByText("john");
  expect(emailContent).toBeInTheDocument();
  expect(phoneContent).toBeInTheDocument();
  expect(agencyContent).toBeInTheDocument();
  expect(usernameContent).toBeInTheDocument();
});

test("renders the buttons", () => {
  render(
    <Counselor
      counselor={{
        id: 1,
        firstname: "John",
        lastname: "Doe",
        email: "js@mail.com",
        gender: "male",
        phone: "017755932591",
        active: true,
        username: "john",
        agency: "Agentur 1",
      }}
      handleDeleteCounselor={jest.fn()}
      handleEditCounselor={jest.fn()}
    />
  );

  const buttons = screen.getAllByRole("button");
  const editButton = screen.getByRole("button", { name: "form edit" });
  const deleteButton = screen.getByRole("button", {
    name: "user-delete delete",
  });
  expect(buttons).toHaveLength(2);
  expect(editButton).toBeInTheDocument();
  expect(deleteButton).toBeInTheDocument();
});

test("interactions with buttons work", () => {
  // const promise = Promise.resolve();
  // const onFormSubmit = jest.fn(() => promise);
  const handleDelete = jest.fn();
  const handleEdit = jest.fn();

  render(
    <Counselor
      counselor={{
        id: 1,
        firstname: "John",
        lastname: "Doe",
        email: "js@mail.com",
        gender: "male",
        phone: "017755932591",
        active: true,
        username: "john",
        agency: "Agentur 1",
      }}
      handleDeleteCounselor={handleDelete}
      handleEditCounselor={handleEdit}
    />
  );

  const editButton = screen.getByRole("button", { name: "form edit" });
  /* const deleteButton = screen.getByRole("button", {
    name: "user-delete delete",
  }); */

  userEvent.click(editButton);

  const inputFields = screen.getAllByRole("textbox");
  expect(inputFields).toHaveLength(5);
  /*
          const saveButton = screen.getByRole("button", { name: "save save" });
          userEvent.click(saveButton);
        
          expect(onFormSubmit).toHaveBeenCalled();
          await act(() => promise);
        
          expect(handleEdit).toHaveBeenCalledWith("1234");
          expect(handleDelete).toHaveBeenCalled();
        
          screen.getByRole("blah");
          
         */
});
