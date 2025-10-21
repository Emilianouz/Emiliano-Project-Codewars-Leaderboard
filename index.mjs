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
let listOfLanguages = ['Javascript','VisualBasic','Pascal','COBOL'];
let infoUsers = [
                ['CodeYourFuture','TheFounders',837,'COBOL'],
                ['Molotov','Frijoleros',636,'Pascal'],
                ['LosPrisioineros','TrenAlSur',37,'VisualBasic']
              ];
window.onload = function (){

  submitButton.addEventListener("click", function (e) {
    e.preventDefault();
    // limpiar datos tbody.innerHTML = '' y la lista tambien, hid los hidden
    inputData = inputUsers.value.trim().split(',').map(name => name.trim().replace(/\s+/g, '')).filter(Boolean);
    getUsersData();
    // functions that load table and list, and render
    fillLanguageSelector();
    renderTableRanking(infoUsers);
  });


};

function userUrl(userName){
  return `https://www.codewars.com/api/v1/users/${userName}`;
}

  async function fetchUser(userName) {
    const res = await fetch(userUrl(userName));
    if (!res.ok){
      //const text = await res.text().catch(()=>res.statusText);
      throw new  Error(`${res.status} ${res.statusText} - ${text}`)
    }
    const parResponse = await res.json();
    return parResponse;
  }
 
async function getUsersData(){
    usersData = await Promise.all(inputData.map(fetchUser));
    /**Promise.all() takes an array of promises and waits for all of them to finish.
If all promises resolve, it returns a new promise that resolves to an array of results. */
      console.log(usersData)
}


//D get the values from the input - brush it up input 
// build arrays ORDER entrega filteredRanking ORDENADOS y FILTRADOS por lenguage

//D fetch from input
//get the full information, for users
// organize info: listOfLanguages, infoUsers


//D fill select
function fillLanguageSelector(){
  languageSelect.innerHTML = "";
  for(const language of listOfLanguages){
    const option = document.createElement("option");
    option.textContent = language;
    option.value = language;
    languageSelect.appendChild(option);
  }
  controls.hidden = false;
}
// fill table TIENE QUE RECIBIRLOS YA FILTRADOS(POR LENGUAGE) Y ORDENADOS
function renderTableRanking(filteredRanking){ // add in first line highlight
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

// filter with select
