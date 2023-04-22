import { render } from "@testing-library/react";
import { ActiveLink } from ".";

jest.mock("next/router", () => {
  // mock library
  return {
    useRouter: () => {
      return {
        asPath: "/",
      };
    },
  };
});

describe("ActiveLink component", () => {
  it("should renders correctly", () => {
    const { getByText } = render(
      <ActiveLink href="/" activeClassName="active">
        About
      </ActiveLink>
    );

    expect(getByText("About")).toBeInTheDocument();
  });

  it("should receive active class", () => {
    const { getByText } = render(
      <ActiveLink href="/" activeClassName="active">
        About
      </ActiveLink>
    );

    expect(getByText("About")).toHaveClass("active");
  });
});
