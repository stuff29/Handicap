/* ==========================================================
   Golf Tracker v2
   Complete Deliverable 5
   Google Sheet + Handicap Analysis Engine
   ========================================================== */


const SHEET_URL =
"https://docs.google.com/spreadsheets/d/1Xk9ZIqOW5zBehjcnJr7xQjMQ38Ns_iwf6VGxPr9moow/export?format=csv&gid=0";


let rounds = [];




// ==========================================================
// START APP
// ==========================================================

document.addEventListener(
"DOMContentLoaded",
function(){

    loadGoogleSheet();

});




// ==========================================================
// LOAD GOOGLE SHEET
// ==========================================================

async function loadGoogleSheet(){

try{


const response =
await fetch(SHEET_URL);


if(!response.ok){

throw new Error(
"Google Sheet unavailable"
);

}



const csv =
await response.text();



rounds =
parseCSV(csv);



renderTable();

updateDashboard();

calculateAllHandicaps();

renderHandicapAnalysis();



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
// NORMALIZE ROUND DATA
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
// SCORE DIFFERENTIAL
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
// DISPLAY ROUND TABLE
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
// HANDICAP CALCULATION
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
a.differential -
b.differential
);



const countingRounds =
sorted.slice(0,8);



let handicap = null;



if(countingRounds.length >= 3){


const average =

countingRounds.reduce(
(sum,r)=>
sum+r.differential,
0
)
/
countingRounds.length;



handicap =
Number(
(
average *
0.96
)
.toFixed(1)
);


}



return {


handicap,

allRounds:last20,

countingRounds,

droppedRounds:
sorted.slice(8)


};


}








// ==========================================================
// SHOW HANDICAPS
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


<div class="summary-item">


<h3>${player}</h3>


<div class="stat">

${
result.handicap !== null
?
result.handicap
:
"--"
}

</div>


Handicap Index


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
// HANDICAP BREAKDOWN
// ==========================================================

function renderHandicapAnalysis(){


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
Counting Rounds
</h3>


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



<h3>
Non-Counting Rounds
</h3>


<table>


<tr>

<th>Date</th>

<th>Course</th>

<th>Differential</th>

</tr>



${
result.droppedRounds
.map(r=>`

<tr>

<td>${r.date}</td>

<td>${r.course}</td>

<td>${r.differential}</td>

</tr>

`)
.join("")
}



</table>



</div>


`;



});



container.innerHTML += html;


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

<div class="stat">

${rounds.length}

</div>

Rounds Loaded

</div>



<div class="summary-item">

<div class="stat">

${mike.handicap ?? "--"}

</div>

Mike Handicap

</div>



<div class="summary-item">

<div class="stat">

${johnny.handicap ?? "--"}

</div>

Johnny Handicap

</div>


</div>


`;



}








// ==========================================================
// EXPLANATION ENGINE FOUNDATION
// ==========================================================

function explainHandicap(player){


const result =
calculateHandicap(player);



if(result.handicap === null){

return `${player} needs more rounds.`;

}



return `

${player}'s handicap is ${result.handicap}.

It is based on the lowest ${
result.countingRounds.length
}
Score Differentials from the eligible rounds.

`;



}








// ==========================================================
// REFRESH BUTTON
// ==========================================================

function refreshData(){

loadGoogleSheet();

}








// ==========================================================
// PAGE NAVIGATION
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
