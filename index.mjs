// This is a placeholder file to show how you can "mock" fetch requests using
// the nock library.
// You can delete the contents of the file once you have understood how it
// works.

// export function makeFetchRequest() {
//   return fetch("https://www.codewars.com/api/v1/users/CodeYourFuture");
// }
const inputUsers = document.getElementById("user-input");
const submitButton = document.getElementById("submit-btn");
const status = document.getElementById("status");
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
  inputData = inputUsers.value.trim().split(',').map(name => name.trim().replace(/\s+/g, '')).filter(Boolean);
  try {
    await getUsersData();
    filterUtilUsersData();
    renderLanguageSelector(listOfLanguages);
    renderTableRanking(infoUsers);
  } catch (err) {
    console.error("Error fetching users:", err.message); // VOLVER GENERAL
  } 
}

function userUrl(userName){
  return `https://www.codewars.com/api/v1/users/${userName}`;
}

async function fetchUser(userName) {
    const res = await fetch(userUrl(userName));
    if (!res.ok){
      //const text = await res.text().catch(()=>res.statusText); - ${text}`
      throw new  Error(`${res.status} ${res.statusText}` )
    }
    const parResponse = await res.json();
    return parResponse;
}
 
async function getUsersData(){
    usersData = await Promise.all(inputData.map(fetchUser));
    /**Promise.all() takes an array of promises and waits for all of them to finish.
If all promises resolve, it returns a new promise that resolves to an array of results. */
     return usersData;
}

function filterUtilUsersData() {
  if (!Array.isArray(usersData)) {
    console.error("usersData is undefined or not an array");
    return;
  }
  
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
CHECK: BRUSH UP ON

MANAGE ERROR FETCHING

TEST

CSS

RUBRIC
*/
