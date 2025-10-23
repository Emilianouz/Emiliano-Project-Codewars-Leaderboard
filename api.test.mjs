import test from "node:test";
import assert from "node:assert";
import nock from "nock";
import { fetchUser } from "./api.mjs";

// Test valid user
test("fetchUser returns valid data for existing user", async () => {
  nock("https://www.codewars.com")
    .get("/api/v1/users/CodeYourFuture")
    .reply(200, {
      username: "CodeYourFuture",
      ranks: { overall: { score: 942 } },
      clan: "CodeYourFuture"
    });

  const user = await fetchUser("CodeYourFuture");

  assert.strictEqual(user.username, "CodeYourFuture");
  assert.strictEqual(user.ranks.overall.score, 942);
  assert.strictEqual(user.clan, "CodeYourFuture");
});
