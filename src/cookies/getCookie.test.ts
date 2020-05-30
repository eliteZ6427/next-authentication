import request from "supertest";
import http from "http";
import { setCookie } from "./setCookie";
import { getCookie } from "./getCookie";

describe("getCookie", () => {
  const defaultCookieName = "next-authentication-token";
  const id = "e296443f-9111-44ef-860c-37a6c9facc2e";
  const cookieOptions = {
    httpOnly: true,
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  };

  const server = http.createServer((req, res) => {
    if ("cookie" in req.headers) {
      // eslint-disable-next-line
      // @ts-ignore
      const cookie = getCookie(req);
      res.end(cookie);
      return;
    }

    setCookie(res, id, cookieOptions);
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("ok");
  });

  const agent = request.agent(server);

  it("should save cookies", async (done) => {
    agent
      .get("/")
      .expect(
        "set-cookie",
        `${defaultCookieName}=${id}; Max-Age=86400; Path=/; HttpOnly`,
        done
      );
  });

  it("should send cookies", (done) => {
    agent.get("/").expect(id, done);
  });
});
