/* ==========================================================
   Golf Tracker v2
   Deliverable 4
   Golf Canada Handicap Engine
   ========================================================== */


const SHEET_URL =
"https://docs.google.com/spreadsheets/d/1Xk9ZIqOW5zBehjcnJr7xQjMQ38Ns_iwf6VGxPr9moow/export?format=csv&gid=0";


let rounds = [];





// ==========================================================
// INITIALIZE
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



const csv =
await response.text();



rounds =
parseCSV(csv);



renderTable();


updateDashboard();


calculateAllHandicaps();



}

catch(error){


console.error(error);


alert(
"Unable to load spreadsheet."
);


}



}







// ==========================================================
// CSV PARSER
// ==========================================================


function parseCSV(csv){


const rows =
csv.trim().split("\n");


const headers =
rows[0]
.split(",")
.map(x=>x.trim());



return rows
.slice(1)
.map(row=>{


const values =
row.split(",");



let obj={};



headers.forEach(
(header,index)=>{


obj[header]=
values[index]
?
values[index].trim()
:
"";


});



return normalizeRound(obj);



});


}







// ==========================================================
// NORMALIZE DATA
// ==========================================================


function normalizeRound(row){


return{


player:
row.Player,


score:
Number(row.Score),


date:
row.Date,


course:
row.Course,


rating:
Number(row.Rating),


slope:
Number(row.Slope),


tee:
row.Tee,


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
// TABLE
// ==========================================================


function renderTable(){


const tbody =
document.querySelector(
"#roundTable tbody"
);



if(!tbody)return;



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



if(playerRounds.length < 3){


return{

index:null,

counting:[],

message:
"Need more rounds"

};


}




const last20 =
playerRounds.slice(0,20);



const differentials =
last20
.map(r=>r.differential)
.sort(
(a,b)=>a-b
);



const counting =
differentials
.slice(0,8);



const average =

counting.reduce(
(a,b)=>a+b,
0
)
/
counting.length;



const handicap =

Number(
(
average
*
0.96
)
.toFixed(1)
);



return{


index:handicap,

counting:counting,

totalRounds:last20.length


};


}








// ==========================================================
// ALL HANDICAPS
// ==========================================================


function calculateAllHandicaps(){


const results =
document.getElementById(
"handicapResults"
);



if(!results)return;



let html="";



["Mike","Johnny"]
.forEach(player=>{


const h =
calculateHandicap(player);



html += `


<div class="summary-item">


<h3>${player}</h3>



<div class="stat">


${
h.index
?
h.index
:
"--"
}


</div>


Handicap Index



<br><br>


Rounds Used:
${h.totalRounds || 0}



<br>


Counting Differentials:

${
h.counting
?
h.counting.join(", ")
:
"--"
}


</div>



`;



});



results.innerHTML =
`
<div class="summary-box">

${html}

</div>

`;



}








// ==========================================================
// DASHBOARD
// ==========================================================


function updateDashboard(){


const stats =
document.getElementById(
"statsText"
);



if(!stats)return;



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

${calculateHandicap("Mike").index || "--"}

</div>

Mike Handicap

</div>



<div class="summary-item">

<div class="stat">

${calculateHandicap("Johnny").index || "--"}

</div>

Johnny Handicap

</div>



</div>


`;



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
