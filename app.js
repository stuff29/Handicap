/* ==========================================
   Golf Tracker v3
   Application Controller
   ========================================== */


(function () {


"use strict";



/* ---------- Application State ---------- */


window.GolfTracker = {

    rounds: [],

    players: {},

    currentPage: "dashboard",

    currentTimeIndex: 0,

    initialized: false

};



/* ---------- DOM Helpers ---------- */


function showLoading() {

    const loader =
        document.getElementById("loading");

    if(loader) {

        loader.classList.remove("hidden");

    }

}



function hideLoading() {

    const loader =
        document.getElementById("loading");

    if(loader) {

        loader.classList.add("hidden");

    }

}




/* ---------- Navigation ---------- */


function initializeNavigation() {


    const buttons =
        document.querySelectorAll(".nav-btn");


    buttons.forEach(button => {


        button.addEventListener(
            "click",
            function(){


                const page =
                    this.dataset.page;


                switchPage(page);


            }
        );


    });


}




function switchPage(page){


    document
    .querySelectorAll(".page")
    .forEach(section => {

        section.classList.remove("active");

    });



    const target =
        document.getElementById(page);



    if(target){

        target.classList.add("active");

    }



    document
    .querySelectorAll(".nav-btn")
    .forEach(button=>{


        button.classList.remove("active");


        if(button.dataset.page === page){

            button.classList.add("active");

        }


    });



    GolfTracker.currentPage = page;



}




/* ---------- Data Loading ---------- */


async function loadApplicationData(){


    try {


        showLoading();



        const csvData =
            await CSV.loadCSV();



        GolfTracker.rounds =
            CSV.parseRounds(csvData);



        GolfTracker.players =
            Handicap.initializePlayers(
                GolfTracker.rounds
            );



        refreshApplication();



        GolfTracker.initialized = true;



    }


    catch(error){


        console.error(
            "Golf Tracker startup error:",
            error
        );


        alert(
            "Unable to load golf data. Check your CSV settings."
        );


    }


    finally {


        hideLoading();


    }



}




/* ---------- Refresh ---------- */


function refreshApplication(){



    if(!GolfTracker.initialized &&
       GolfTracker.rounds.length === 0){

        return;

    }



    Dashboard.render(
        GolfTracker.players
    );



    History.render(
        GolfTracker.rounds
    );



    Analysis.render(
        GolfTracker.players,
        GolfTracker.rounds
    );



    Solver.initialize(
        GolfTracker.players,
        GolfTracker.rounds
    );



    TimeMachine.initialize(
        GolfTracker.rounds
    );



    Charts.render(
        GolfTracker.players
    );



}




/* ---------- Button Events ---------- */


function initializeButtons(){



    const refresh =
        document.getElementById(
            "refreshBtn"
        );



    if(refresh){


        refresh.addEventListener(
            "click",
            loadApplicationData
        );


    }



}



/* ---------- Startup ---------- */


async function start(){


    initializeNavigation();


    initializeButtons();


    await loadApplicationData();


}



document.addEventListener(
    "DOMContentLoaded",
    start
);



})();
