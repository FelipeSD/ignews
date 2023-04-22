import { render } from "@testing-library/react";
import { Header } from "./index";

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

jest.mock("next-auth/react", () => {
  // mock library
  return {
    useSession: () => ({
      data: null,
    }),
  };
});

describe("Header component", () => {
  it("should renders correctly", () => {
    const { getByText } = render(<Header />);

    expect(getByText("Home")).toBeInTheDocument();
  });
});
