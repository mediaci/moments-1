import { rest } from "msw";

const baseURL = "https://drf-api-3k4w.onrender.com/";

export const handlers = [
    rest.get(`${baseURL}dj-rest-auth/user/`, (req, res, ctx) => {
        return res(
          ctx.json({
            id: 4,
            owner: "anna-g",
            created_at: "05 Oct 2021",
            updated_at: "08 Nov 2021",
            name: "",
            content: "This is my bio!",
            image:
              "https://res.cloudinary.com/duv0jlhyr/image/upload/v1/media/images/image_17_w6t4bx",
            is_owner: false,
            following_id: null,
            posts_count: 0,
            followers_count: 1,
            following_count: 2,
          })
        );
      }),
      
      rest.post(`${baseURL}dj-rest-auth/logout/`, (req, res, ctx) => {
        return res(ctx.status(200));
      })
];
