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

// Test 404 (user not found)
test("fetchUser throws 'User not found.' for invalid user", async () => {
  nock("https://www.codewars.com")
    .get("/api/v1/users/NoSuchUser123")
    .reply(404, {});

  await assert.rejects(
    fetchUser("NoSuchUser123"),
    /User not found./
  );
});

// Test network failure
test("fetchUser throws a network error when fetch fails", async () => {
  nock("https://www.codewars.com")
    .get("/api/v1/users/NetworkFailUser")
    .replyWithError("Network Error");

  await assert.rejects(
    fetchUser("NetworkFailUser"),
    /Failed to fetch data/
  );
});