import { render, screen } from "@testing-library/react";
import PostPreview, { getStaticProps } from "../../pages/posts/preview/[slug]";
import { useSession } from "next-auth/react";
import { getPrismicClient } from "../../services/prismic";
import { useRouter } from "next/router";

const post = {
  slug: "post-1",
  title: "Post 1",
  content: "<p>Post 1 excerpt</p>",
  updatedAt: "19 de Maio",
};

jest.mock("next-auth/react");
jest.mock("../../services/prismic");
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("Post preview page", () => {
  it("renders correctly", () => {
    const useSessionMocked = jest.mocked(useSession);
    useSessionMocked.mockReturnValueOnce({
      update: () => Promise.resolve({ user: null, expires: "" }),
      data: {
        expires: "fake-expires",
        user: {
          name: "John Doe",
          email: "john",
          activeSubscription: null,
        },
      },
      status: "authenticated",
    });

    render(<PostPreview post={post} />);

    expect(screen.getByText("Post 1")).toBeInTheDocument();
    expect(screen.getByText("Post 1 excerpt")).toBeInTheDocument();
    expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument();
  });

  it("redirects user to full post when user is subscribed", async () => {
    const pushMocked = jest.fn();

    (useRouter as jest.Mock).mockReturnValueOnce({
      push: pushMocked,
    } as any);

    const useSessionMocked = jest.mocked(useSession);

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

    render(<PostPreview post={post} />);

    expect(pushMocked).toHaveBeenCalledWith("/posts/post-1");
  });

  it("loads initial data", async () => {
    const getPrismicClientMocked = jest.mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ type: "heading", text: "My post 1" }],
          content: [{ type: "paragraph", text: "Post excerpt 1" }],
        },
        last_publication_date: "04-01-2022",
      }),
    } as any);

    const response = await getStaticProps({ params: { slug: "post-1" } });

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: "post-1",
            title: "My post 1",
            content: "Post excerpt 1",
            updatedAt: "01 de abril de 2022",
          },
        },
      })
    );
  });
});
