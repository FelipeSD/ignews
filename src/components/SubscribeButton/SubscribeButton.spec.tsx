import { render, fireEvent } from "@testing-library/react";
import { SubscribeButton } from "./index";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

jest.mock("next-auth/react");
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("SubscribeButton component", () => {
  it("renders correctly", () => {
    const useSessionMocked = jest.mocked(useSession);
    useSessionMocked.mockReturnValueOnce({
      update: () => Promise.resolve({ user: null, expires: "" }),
      data: null,
      status: "unauthenticated",
    });

    const { getByText } = render(<SubscribeButton />);

    expect(getByText("Subscribe")).toBeInTheDocument();
  });

  it("redirects to sign in when not authenticated", () => {
    const useSessionMocked = jest.mocked(useSession);
    useSessionMocked.mockReturnValueOnce({
      update: () => Promise.resolve({ user: null, expires: "" }),
      data: null,
      status: "unauthenticated",
    });

    const signInMocked = jest.mocked(signIn);

    const { getByText } = render(<SubscribeButton />);

    const subscribeButton = getByText("Subscribe");

    fireEvent.click(subscribeButton);

    expect(signInMocked).toHaveBeenCalled();
  });

  it("redirects to posts when user already has a subscription", () => {
    const useSessionMocked = jest.mocked(useSession);
    const pushMock = jest.fn();

    useSessionMocked.mockReturnValueOnce({
      update: () => Promise.resolve({ user: null, expires: "" }),
      data: {
        expires: "fake-expires",
        user: {
          name: "John Doe",
          email: "john",
          activeSubscription: {},
        },
      },
      status: "authenticated",
    });

    (useRouter as jest.Mock).mockReturnValueOnce({
      push: pushMock,
    } as any);

    const { getByText } = render(<SubscribeButton />);

    const subscribeButton = getByText("Subscribe");

    fireEvent.click(subscribeButton);

    expect(pushMock).toHaveBeenCalledWith("/posts");
  });
});
