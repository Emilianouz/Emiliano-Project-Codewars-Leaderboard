
export function userUrl(userName){
  return `https://www.codewars.com/api/v1/users/${userName}`;
}

export async function fetchUser(userName) {
  try {
    const res = await fetch(userUrl(userName));

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error(`User not found.`);
      } else {
        throw new Error(`Error fetching ${userName}: ${res.status} ${res.statusText}`);
      }
    }

    const parsedResponse = await res.json();
    return parsedResponse;
  } catch (err){
    throw new Error(`Failed to fetch data for "${userName}": ${err.message}`);
  }
}