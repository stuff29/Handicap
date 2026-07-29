/* ==========================================================
   Golf Tracker v2
   Deliverable 8
   Complete Handicap Intelligence Engine
   Part 1
   ========================================================== */


const SHEET_URL =
"https://docs.google.com/spreadsheets/d/1Xk9ZIqOW5zBehjcnJr7xQjMQ38Ns_iwf6VGxPr9moow/export?format=csv&gid=0";


let rounds = [];

const playerGoals = {

    Mike: 10,

    Johnny: 15

};



// ==========================================================
// START
// ==========================================================

document.addEventListener(
"DOMContentLoaded",
()=>{

loadGoogleSheet();

});






// ==========================================================
// LOAD DATA
// ==========================================================

async function loadGoogleSheet(){

try{


const response =
await fetch(SHEET_URL);



if(!response.ok){

throw new Error(
"Spreadsheet unavailable"
);

}



const csv =
await response.text();



rounds =
parseCSV(csv);



renderTable();

updateDashboard();

calculateAllHandicaps();

renderSolver();

renderTimeMachine();

renderExplanation();



}

catch(error){

console.error(error);

alert(
"Spreadsheet loading error"
);

}


}






// ==========================================================
// CSV PARSER
// ==========================================================

function parseCSV(csv){


const lines =
csv.trim().split("\n");


const headers =
lines[0]
.split(",")
.map(h=>h.trim());



return lines
.slice(1)
.map(line=>{


const values =
line.split(",");


let row={};



headers.forEach(
(header,index)=>{


row[header] =
values[index]
?
values[index].trim()
:
"";


});



return normalizeRound(row);


});


}






// ==========================================================
// NORMALIZE ROUND
// ==========================================================

function normalizeRound(row){


return {


player:
row.Player || "",


score:
Number(row.Score) || 0,


date:
row.Date || "",


course:
row.Course || "",


rating:
Number(row.Rating) || 0,


slope:
Number(row.Slope) || 0,


tee:
row.Tee || "",



differential:

calculateDifferential(

Number(row.Score),

Number(row.Rating),

Number(row.Slope)

)


};


}






// ==========================================================
// DIFFERENTIAL
// ==========================================================

function calculateDifferential(
score,
rating,
slope
){


if(!score || !rating || !slope){

return 0;

}



return Number(

(
(score-rating)
*
113
/
slope

)
.toFixed(1)

);


}






// ==========================================================
// HANDICAP ENGINE
// ==========================================================

function calculateHandicap(player){


const playerRounds =

rounds
.filter(
r=>r.player===player
)
.sort(
(a,b)=>
new Date(b.date)
-
new Date(a.date)
);



const last20 =
playerRounds.slice(0,20);



const sorted =
[...last20]
.sort(
(a,b)=>
a.differential-b.differential
);



const counting =
sorted.slice(0,8);



let handicap=null;



if(counting.length>=3){


const average =

counting.reduce(
(a,r)=>
a+r.differential,
0
)
/
counting.length;



handicap =
Number(
(
average*
0.96
)
.toFixed(1)
);


}



return {


handicap,

allRounds:last20,

countingRounds:counting,

droppedRounds:
sorted.slice(8)


};


}

/* ==========================================================
   Golf Tracker v2
   Deliverable 8
   Complete Handicap Intelligence Engine
   Part 2
   ========================================================== */



// ==========================================================
// ROUND TABLE
// ==========================================================

function renderTable(){


const tbody =
document.querySelector(
"#roundTable tbody"
);



if(!tbody){

return;

}



tbody.innerHTML="";



rounds
.sort(
(a,b)=>
new Date(b.date)
-
new Date(a.date)
)
.forEach(r=>{


tbody.innerHTML += `


<tr>

<td>${r.player}</td>

<td>${r.date}</td>

<td>${r.course}</td>

<td>${r.score}</td>

<td>${r.rating}</td>

<td>${r.slope}</td>

<td>${r.tee}</td>

</tr>


`;



});


}







// ==========================================================
// DASHBOARD
// ==========================================================

function updateDashboard(){


const stats =
document.getElementById(
"statsText"
);



if(!stats){

return;

}



const mike =
calculateHandicap("Mike");


const johnny =
calculateHandicap("Johnny");



stats.innerHTML = `


<div class="summary-box">


<div class="summary-item">

<h3>Mike</h3>

<div class="stat">

${mike.handicap ?? "--"}

</div>

Goal: ${playerGoals.Mike}

</div>




<div class="summary-item">

<h3>Johnny</h3>

<div class="stat">

${johnny.handicap ?? "--"}

</div>

Goal: ${playerGoals.Johnny}

</div>





<div class="summary-item">

<h3>Total Rounds</h3>

<div class="stat">

${rounds.length}

</div>

</div>


</div>


`;



}








// ==========================================================
// HANDICAP RESULTS
// ==========================================================

function calculateAllHandicaps(){


const container =
document.getElementById(
"handicapResults"
);



if(!container){

return;

}



let html="";



["Mike","Johnny"]
.forEach(player=>{


const result =
calculateHandicap(player);



html += `


<div class="panel">


<h2>${player}</h2>


<h3>

Handicap Index:

${result.handicap ?? "--"}

</h3>



<h4>
Counting Rounds
</h4>



<table>


<tr>

<th>Date</th>

<th>Course</th>

<th>Score</th>

<th>Differential</th>

</tr>



${
result.countingRounds
.map(r=>`

<tr>

<td>${r.date}</td>

<td>${r.course}</td>

<td>${r.score}</td>

<td>${r.differential}</td>

</tr>

`)
.join("")
}



</table>



<h4>
Rounds Not Counting
</h4>



${
result.droppedRounds
.map(r=>`

<p>

${r.date}
-
${r.differential}

</p>

`)
.join("")
}



</div>


`;



});



container.innerHTML=html;



}









// ==========================================================
// SOLVER
// ==========================================================

function calculateSolver(player){


const current =
calculateHandicap(player);



const target =
playerGoals[player];



if(!current.handicap){

return {

message:
"Not enough rounds available."

};

}



if(current.handicap <= target){

return {

message:
`${player} has reached the target handicap.`

};

}




const differentials =

current.countingRounds
.map(r=>r.differential);



const currentAverage =

differentielsAverage(
differentiels
);



const improvementNeeded =

Number(
(
current.handicap -
target
)
.toFixed(1)
);



const requiredDifferential =

Number(
(
currentAverage -
improvementNeeded
)
.toFixed(1)
);



return {


current:
current.handicap,

target,

requiredDifferential,


message:

`${player} needs approximately ${requiredDifferential}
differential average over future counting rounds.`


};


}






function differentialsAverage(arr){


if(!arr.length){

return 0;

}



return arr.reduce(
(a,b)=>a+b,
0
)
/
arr.length;


}







function renderSolver(){


const container =
document.getElementById(
"solverResults"
);



if(!container){

return;

}



let html="";



["Mike","Johnny"]
.forEach(player=>{


const result =
calculateSolver(player);



html += `


<div class="summary-item">


<h3>${player}</h3>


<p>

${result.message}

</p>



</div>


`;



});



container.innerHTML = `


<div class="summary-box">

${html}

</div>


`;



}









// ==========================================================
// TIME MACHINE
// ==========================================================

function renderTimeMachine(){


const container =
document.getElementById(
"historyResults"
);



if(!container){

return;

}



let months={};



rounds.forEach(r=>{


const month =
r.date.substring(0,7);



if(!months[month]){

months[month]=[];

}



months[month].push(r);


});



let html="";



Object.keys(months)
.sort()
.forEach(month=>{


const previousRounds =
rounds.filter(
r=>r.date.startsWith(month)
);



const snapshot =
calculateHistoricalHandicap(
previousRounds
);



html += `


<tr>

<td>${month}</td>

<td>${snapshot}</td>

</tr>


`;



});



container.innerHTML = `


<table>


<tr>

<th>
Month
</th>

<th>
Estimated Handicap
</th>


</tr>


${html}


</table>


`;



}








function calculateHistoricalHandicap(history){


const sorted =

history
.map(r=>r.differential)
.sort(
(a,b)=>a-b
);



const best =
sorted.slice(0,8);



if(best.length===0){

return "--";

}



return Number(

(
best.reduce(
(a,b)=>a+b,
0
)
/
best.length
*
0.96

)

.toFixed(1)

);


}








// ==========================================================
// EXPLANATION ENGINE
// ==========================================================

function renderExplanation(){


const container =
document.getElementById(
"handicapExplanation"
);



if(!container){

return;

}



container.innerHTML = `


<h3>
Handicap Analysis
</h3>


<p>

The handicap is calculated from the lowest
8 Score Differentials from the most recent
20 rounds.

</p>


<p>

New rounds will replace higher differentials
when they improve the player's handicap.

</p>


`;



}








// ==========================================================
// REFRESH
// ==========================================================

function refreshData(){

loadGoogleSheet();

}








// ==========================================================
// NAVIGATION
// ==========================================================

function showPage(id){


document
.querySelectorAll(".page")
.forEach(page=>{


page.classList.add("hidden");


});



const selected =
document.getElementById(id);



if(selected){

selected.classList.remove("hidden");

}


}
