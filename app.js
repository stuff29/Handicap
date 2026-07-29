/* ==========================================================
   Golf Tracker v2
   Deliverable 5 - Handicap Analysis Engine
   Part 1
   ========================================================== */


const SHEET_URL =
"https://docs.google.com/spreadsheets/d/1Xk9ZIqOW5zBehjcnJr7xQjMQ38Ns_iwf6VGxPr9moow/export?format=csv&gid=0";


let rounds = [];






// ==========================================================
// INITIALIZE
// ==========================================================


document.addEventListener(
"DOMContentLoaded",
()=>{

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
"Google Sheet could not be accessed"
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
// CSV PROCESSING
// ==========================================================


function parseCSV(csv){


const lines =
csv.trim().split("\n");



const headers =
lines[0]
.split(",")
.map(h=>h.trim());



return lines.slice(1)
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
// SCORE DIFFERENTIAL
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



const handicap =


countingRounds.length

?

Number(

(
countingRounds

.reduce(
(sum,r)=>
sum+r.differential,
0
)

/

countingRounds.length

*

0.96

)

.toFixed(1)

)

:

null;



return{


handicap,

allRounds:last20,

countingRounds,


droppedRounds:

sorted.slice(8)


};



}









// ==========================================================
// HANDICAP ANALYSIS DISPLAY
// ==========================================================


function renderHandicapAnalysis(){


const container =
document.getElementById(
"handicapResults"
);



if(!container)

return;



let html="";



["Mike","Johnny"]
.forEach(player=>{


const result =
calculateHandicap(player);



html += `


<div class="panel">


<h3>${player}</h3>


<h4>
Current Handicap:
${result.handicap ?? "--"}
</h4>



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
result.countingRounds.map(r=>`

<tr>

<td>${r.date}</td>

<td>${r.course}</td>

<td>${r.score}</td>

<td>${r.differential}</td>

</tr>


`).join("")

}


</table>


</div>


`;



});



container.innerHTML=html;



}



/* ==========================================================
   Golf Tracker v2
   Deliverable 5 - Handicap Analysis Engine
   Part 2
   ========================================================== */



// ==========================================================
// DASHBOARD SUMMARY
// ==========================================================


function updateDashboard(){


const stats =
document.getElementById(
"statsText"
);



if(!stats)

return;



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

Total Rounds Loaded

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
// HANDICAP EXPLANATION ENGINE
// ==========================================================


function explainHandicap(player){


const result =
calculateHandicap(player);



if(!result.handicap){


return `

${player} does not yet have enough rounds
to calculate a handicap.

`;

}



let explanation = "";



explanation += `

<h3>${player} Handicap Analysis</h3>

`;



explanation += `

<p>

Current Handicap Index:

<strong>

${result.handicap}

</strong>

</p>

`;



explanation += `

<p>

The handicap is calculated using the
lowest 8 Score Differentials from the
most recent 20 rounds.

</p>

`;



explanation += `

<p>

${result.countingRounds.length}
rounds are currently counting.

</p>

`;



if(result.droppedRounds.length > 0){


explanation += `

<p>

${result.droppedRounds.length}
rounds are currently not counting because
their differentials are higher than the
selected counting rounds.

</p>

`;

}



return explanation;


}








// ==========================================================
// DISPLAY EXPLANATION
// ==========================================================


function showHandicapExplanation(player){


const box =
document.getElementById(
"handicapExplanation"
);



if(!box)

return;



box.innerHTML =
explainHandicap(player);


}









// ==========================================================
// HANDICAP CHANGE FOUNDATION
// ==========================================================


function compareHandicapChange(
player,
previousHandicap
){


const current =
calculateHandicap(player);



if(!current.handicap)

return "No handicap available.";



const change =
(
current.handicap -
previousHandicap
)
.toFixed(1);



if(change < 0){


return `

${player}'s handicap improved by
${Math.abs(change)} strokes.

The new lower differential replaced a
higher counting differential.

`;

}



if(change > 0){


return `

${player}'s handicap increased by
${change} strokes.

A stronger previous differential has
dropped out of the calculation.

`;

}



return `

${player}'s handicap did not change.

`;

}








// ==========================================================
// PLAYER ROUND BREAKDOWN
// ==========================================================


function getRoundBreakdown(player){


const result =
calculateHandicap(player);



return {


counting:

result.countingRounds.map(r=>({

date:r.date,

course:r.course,

score:r.score,

differential:r.differential

})),



notCounting:

result.droppedRounds.map(r=>({

date:r.date,

course:r.course,

score:r.score,

differential:r.differential

}))


};



}








// ==========================================================
// REFRESH BUTTON SUPPORT
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
