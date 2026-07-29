/* ==========================================================
   Golf Tracker v2
   Deliverable 3 - app.js Part 1
   Google Sheets Data Connection
   ========================================================== */


// -----------------------------------------------------------
// Google Sheet CSV Source
// -----------------------------------------------------------

const SHEET_URL =
"https://docs.google.com/spreadsheets/d/1Xk9ZIqOW5zBehjcnJr7xQjMQ38Ns_iwf6VGxPr9moow/export?format=csv&gid=0";


// -----------------------------------------------------------
// Application Data
// -----------------------------------------------------------

let rounds = [];

let players = [
    "Mike",
    "Johnny"
];


// -----------------------------------------------------------
// Start Application
// -----------------------------------------------------------

document.addEventListener(
    "DOMContentLoaded",
    function(){

        loadGoogleSheet();

    }
);



// -----------------------------------------------------------
// Load Google Sheet
// -----------------------------------------------------------

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


    }


    catch(error){


        console.error(
            "Unable to load spreadsheet:",
            error
        );


        alert(
            "Could not load Google Sheet data."
        );


    }


}



// -----------------------------------------------------------
// Convert CSV to Objects
// -----------------------------------------------------------

function parseCSV(csv){


    const lines =
        csv
        .trim()
        .split("\n");


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


            }
        );


        return normalizeRound(row);


    });


}



// -----------------------------------------------------------
// Standardize Golf Data
// -----------------------------------------------------------

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


        slope:
            Number(row.Slope) || 0,


        rating:
            Number(row.Rating) || 0,


        tee:
            row.Tee || ""


    };


}



// -----------------------------------------------------------
// Display Rounds
// -----------------------------------------------------------

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
    .forEach(round=>{


        tbody.innerHTML += `

        <tr>

        <td>${round.player}</td>

        <td>${round.date}</td>

        <td>${round.course}</td>

        <td>${round.score}</td>

        <td>${round.rating}</td>

        <td>${round.slope}</td>

        </tr>

        `;


    });


}



// -----------------------------------------------------------
// Dashboard Summary
// -----------------------------------------------------------

function updateDashboard(){


    const stats =
        document.getElementById(
            "statsText"
        );


    if(!stats){

        return;

    }



    if(rounds.length===0){


        stats.innerHTML =
        "No rounds loaded.";


        return;

    }



    const scores =
        rounds.map(
            r=>r.score
        );



    const average =
        scores.reduce(
            (a,b)=>a+b,
            0
        )
        /
        scores.length;



    const best =
        Math.min(
            ...scores
        );



    stats.innerHTML = `


    <div class="summary-box">


        <div class="summary-item">

        <div class="stat">
        ${rounds.length}
        </div>

        Total Rounds

        </div>



        <div class="summary-item">

        <div class="stat">
        ${average.toFixed(1)}
        </div>

        Average Score

        </div>



        <div class="summary-item">

        <div class="stat">
        ${best}
        </div>

        Best Score

        </div>


    </div>


    `;


}



// -----------------------------------------------------------
// Player Filtering Foundation
// -----------------------------------------------------------

function getPlayerRounds(player){


    return rounds.filter(
        r=>r.player===player
    );


}



// -----------------------------------------------------------
// Handicap Engine Placeholder
// Deliverable 4
// -----------------------------------------------------------

function calculateHandicap(player){


    const playerRounds =
        getPlayerRounds(player);


    return null;


}