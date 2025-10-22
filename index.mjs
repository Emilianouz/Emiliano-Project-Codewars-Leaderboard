// This is a placeholder file to show how you can "mock" fetch requests using
// the nock library.
// You can delete the contents of the file once you have understood how it
// works.

// export function makeFetchRequest() {
//   return fetch("https://www.codewars.com/api/v1/users/CodeYourFuture");
// }
const inputUsers = document.getElementById("user-input");
const submitButton = document.getElementById("submit-btn");
const statusMessage = document.getElementById("status");
const languageSelect = document.getElementById("language-select");
const controls = document.getElementById("controls");
const tableBody = document.querySelector("#leaderboard tbody");
const tableContainer = document.getElementById("table-container");
let inputData;
let usersData;
let listOfLanguages = [];
let infoUsers = [];
let utilUserData = []

window.onload = function (){

  submitButton.addEventListener("click", handleButtonClick);

  languageSelect.addEventListener("change",function(){
    tableBody.innerHTML = "";
    const language = languageSelect.value;
    listInfoUsersByLanguage(utilUserData,language)
    renderTableRanking(infoUsers);
  });
};

async function handleButtonClick(e) {
  e.preventDefault();
  tableBody.innerHTML = "";
  inputData = inputUsers.value.trim().split(',')
    .map(name => name.trim().replace(/\s+/g, '')).filter(Boolean);
  try {
    await getUsersData();
    filterUtilUsersData();
    renderLanguageSelector(listOfLanguages);
    renderTableRanking(infoUsers);
    statusMessage.textContent =  `Data loaded.\n` + statusMessage.textContent;
  } catch (err) {
    statusMessage.textContent = `Error fetching users: ${err.message}`;
  } 
}

function userUrl(userName){
  return `https://www.codewars.com/api/v1/users/${userName}`;
}

async function fetchUser(userName) {
  try {
    const res = await fetch(userUrl(userName));

    // Handle HTTP errors
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
};
 
async function getUsersData(){
  const results = await Promise.allSettled(inputData.map(fetchUser));

  const successful = results
    .filter(r => r.status === "fulfilled")
    .map(r => r.value);

  const failed = results
    .filter(r => r.status === "rejected")
    .map(r => r.reason.message);

    // It shows users if fail
  if (failed.length > 0){
    statusMessage.textContent = `Some users could not be fetched:\n${failed.join("\n")}`;
  } else {
    statusMessage.textContent = "";
  }

  if (successful.length === 0){
    throw new Error("No valid users found.")
  }
  usersData = successful;
  return usersData;
}

function filterUtilUsersData() {
  if (!Array.isArray(usersData)) {
    statusMessage = "UsersData is undefined or not an array"
    return;
  }
  utilUserData = [];
  usersData.forEach(user => {
    const pairLanguageScore = Object.entries(user.ranks.languages)
    .map(([lang,data])=>[lang,data.score]);
    
    utilUserData.push({
      username: user.username,
      clan: user.clan,
      overallScore: user.ranks.overall.score,
      scores:pairLanguageScore
    });
  });
  listLanguages(utilUserData);
  listInfoUsers(utilUserData);
};
// fill variable listOfLanguages from utilUserData
function listLanguages(utilUserData){
  listOfLanguages = [];
  utilUserData.forEach(user => {
    user.scores.forEach(([language,score])=>{
      if(!listOfLanguages.includes(language)){
      listOfLanguages.push(language);
      }
    });
  });
}
// fill infoUsers from utilUserData
function listInfoUsers(utilUserData){
  infoUsers = [];
  utilUserData.forEach(user =>{
    infoUsers.push([user.username,user.clan,user.overallScore])
  })
  infoUsers.sort((a,b)=> b[2] - a[2]);
}
// fill infoUsers filtered from language 
function listInfoUsersByLanguage(utilUserData,language){
  infoUsers = [];
  utilUserData.forEach(user => {
    const languageScorePair = user.scores.find(([lang])=> lang === language);
    if (languageScorePair) {
      const score = languageScorePair[1];
      infoUsers.push([user.username,user.clan,score]);
    }
  });
  infoUsers.sort((a,b)=> b[2] - a[2]);
}

function renderLanguageSelector(listOfLanguages){
  languageSelect.innerHTML = "";
  for(const language of listOfLanguages){
    const option = document.createElement("option");
    option.textContent = language;
    option.value = language;
    languageSelect.appendChild(option);
  }
  controls.hidden = false;
}

function renderTableRanking(filteredRanking){ // TO-DO:add in first line highlight
  tableContainer.hidden = false;

  filteredRanking.forEach((user) => {
    const myUser = user[0];
    const myClan = user[1];
    const myScore = user[2];

    const tr = document.createElement('tr');
    const tdUser = document.createElement('td');
    tdUser.textContent = myUser;
    tdUser.scope = 'row';
    const tdClan = document.createElement('td');
    tdClan.textContent = myClan; // Could be ''
    const tdScore = document.createElement('td');
    tdScore.textContent = String(myScore);
    tr.appendChild(tdUser);
    tr.appendChild(tdClan);
    tr.appendChild(tdScore);
    tableBody.appendChild(tr);
  });
}

// Just4FunCoder,uttumuttu,B1ts,SallyMcGrath,40thieves,Kacarott,K01egA,CodeYourFuture

/* 
CHECK: BRUSH UP ON      DONE

MANAGE ERROR FETCHING   DONE

TEST

CSS

ACCESSIBILITY

RUBRIC
*/
