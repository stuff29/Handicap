/* ==========================================================
   Golf Tracker v2
   Deliverable 6
   Handicap Solver + Goal Tracking
   Part 1
   ========================================================== */


const SHEET_URL =
"https://docs.google.com/spreadsheets/d/1Xk9ZIqOW5zBehjcnJr7xQjMQ38Ns_iwf6VGxPr9moow/export?format=csv&gid=0";


let rounds = [];


// ==========================================================
// PLAYER GOALS
// ==========================================================

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
// LOAD SHEET
// ==========================================================

async function loadGoogleSheet(){


try{


const response =
await fetch(SHEET_URL);


if(!response.ok){

throw new Error(
"Sheet unavailable"
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



}

catch(error){

console.error(error);

alert(
"Spreadsheet loading error"
);


}


}







// ==========================================================
// CSV
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


if(!score || !rating || !slope)

return 0;



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



const countingRounds =
sorted.slice(0,8);



let handicap=null;



if(countingRounds.length >=3){


const average =

countingRounds.reduce(
(a,r)=>
a+r.differential,
0
)
/
countingRounds.length;



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

countingRounds,

allRounds:last20,

droppedRounds:
sorted.slice(8)

};


}

/* ==========================================================
   Golf Tracker v2
   Deliverable 6
   Handicap Solver + Goal Tracking
   Part 2
   ========================================================== */



// ==========================================================
// SCORE TABLE DISPLAY
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
new Date(b.date)-new Date(a.date)
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

Goal: 10

</div>



<div class="summary-item">

<h3>Johnny</h3>

<div class="stat">

${johnny.handicap ?? "--"}

</div>

Goal: 15

</div>



<div class="summary-item">

<h3>Rounds</h3>

<div class="stat">

${rounds.length}

</div>

Loaded

</div>



</div>

`;



}








// ==========================================================
// HANDICAP DISPLAY
// ==========================================================

function calculateAllHandicaps(){


const box =
document.getElementById(
"handicapResults"
);



if(!box){

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
Counting Differentials
</h4>


<p>

${
result.countingRounds
.map(r=>r.differential)
.join(", ")
|| "--"
}

</p>


</div>


`;



});



box.innerHTML=html;



}








// ==========================================================
// HANDICAP SOLVER
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
`${player} has already reached the goal handicap.`


};


}





/*
 Estimate required differential average.

 This assumes future rounds replace
 the current weakest counting differentials.
*/


const counting =
current.countingRounds
.map(r=>r.differential)
.sort(
(a,b)=>b-a
);



const weakest =
counting[0];



const neededAverage =


(
(target / 0.96) *
8
-
counting
.slice(1)
.reduce(
(a,b)=>a+b,
0
)

)
/
1;



const projectedDifferential =

Number(
neededAverage.toFixed(1)
);



const projectedScore =
estimateScoreFromDifferential(
projectedDifferential,
player
);



return {


target,

current:
current.handicap,


neededDifferential:
projectedDifferential,


estimatedScore:
projectedScore


};


}








// ==========================================================
// ESTIMATE SCORE FROM DIFFERENTIAL
// ==========================================================

function estimateScoreFromDifferential(
differential,
player
){


const playerRounds =
rounds.filter(
r=>r.player===player
);



if(playerRounds.length===0){

return "--";

}



const avgRating =

playerRounds.reduce(
(a,r)=>a+r.rating,
0
)
/
playerRounds.length;



const avgSlope =

playerRounds.reduce(
(a,r)=>a+r.slope,
0
)
/
playerRounds.length;



const score =

(
differential *
avgSlope /
113
)
+
avgRating;



return Math.round(score);

}








// ==========================================================
// SOLVER DISPLAY
// ==========================================================

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



${
result.message
?
result.message
:

`

<p>
Current Handicap:
<strong>${result.current}</strong>
</p>


<p>
Goal:
<strong>${result.target}</strong>
</p>


<p>
Approximate differential needed:
<strong>
${result.neededDifferential}
</strong>
</p>


<p>
Estimated score needed:
<strong>
${result.estimatedScore}
</strong>
</p>


`

}



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


selected.classList.remove(
"hidden"
);


}


}
