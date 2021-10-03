const fetch = require("node-fetch");
const GRAPHQL_URL = "https://hub.snapshot.org/graphql";
async function fetchactiveProposals() {
  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query {
  proposals (
    first: 20,
    skip: 0,
    where: {
      space_in: ["chiliagon.eth"],
      state: "active"
    },
    orderBy: "created",
    orderDirection: desc
  ) {
    id
    title
    body
    choices
    start
    end
    snapshot
    state
    author
    space {
      id
      name
    }
  }
}
      `,
    }),
  });

  const responseBody = await response.json();
  let data = responseBody["data"]["proposals"];
  return data;
}
module.exports = { fetchactiveProposals };
