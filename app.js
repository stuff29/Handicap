/* ==========================================
   Golf Tracker v3
   Application Controller
   Robust Modular Loader
   ========================================== */

(function () {

"use strict";


window.GolfTracker = {

    rounds: [],

    players: {},

    currentPage: "dashboard",

    currentTimeIndex: 0,

    initialized: false

};



function moduleExists(name) {

    if (typeof window[name] === "undefined") {

        console.warn(
            "Module not loaded:",
            name
        );

        return false;

    }

    return true;

}



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




/* ================================
   Navigation
================================ */


function initializeNavigation() {


    document
    .querySelectorAll(".nav-btn")
    .forEach(button => {


        button.addEventListener(
            "click",
            () => {


                switchPage(
                    button.dataset.page
                );


            }
        );


    });


}



function switchPage(page) {


    document
    .querySelectorAll(".page")
    .forEach(section => {

        section.classList.remove(
            "active"
        );

    });



    const selected =
        document.getElementById(page);



    if(selected) {

        selected.classList.add(
            "active"
        );

    }



    document
    .querySelectorAll(".nav-btn")
    .forEach(button => {


        button.classList.remove(
            "active"
        );


        if(button.dataset.page === page){

            button.classList.add(
                "active"
            );

        }


    });



    GolfTracker.currentPage = page;


}




/* ================================
   CSV Loading
================================ */


async function loadApplicationData() {


    showLoading();



    try {


        if(!moduleExists("CSV")) {

            console.warn(
                "CSV module not available yet."
            );

            return;

        }



        const csv =
            await CSV.loadCSV();



        GolfTracker.rounds =
            CSV.parseRounds(csv);



        if(moduleExists("Handicap")) {

            GolfTracker.players =
                Handicap.initializePlayers(
                    GolfTracker.rounds
                );

        }



        refreshApplication();



    }


    catch(error) {


        console.error(
            "Golf Tracker data error:",
            error
        );


    }


    finally {


        hideLoading();


    }


}




/* ================================
   Refresh Application
================================ */


function refreshApplication() {


    if(
        moduleExists("Dashboard") &&
        Dashboard.render
    ){

        Dashboard.render(
            GolfTracker.players
        );

    }



    if(
        moduleExists("History") &&
        History.render
    ){

        History.render(
            GolfTracker.rounds
        );

    }



    if(
        moduleExists("Analysis") &&
        Analysis.render
    ){

        Analysis.render(
            GolfTracker.players,
            GolfTracker.rounds
        );

    }



    if(
        moduleExists("Solver") &&
        Solver.initialize
    ){

        Solver.initialize(
            GolfTracker.players,
            GolfTracker.rounds
        );

    }



    if(
        moduleExists("TimeMachine") &&
        TimeMachine.initialize
    ){

        TimeMachine.initialize(
            GolfTracker.rounds
        );

    }



    if(
        moduleExists("Charts") &&
        Charts.render
    ){

        Charts.render(
            GolfTracker.players
        );

    }


}




/* ================================
   Buttons
================================ */


function initializeButtons() {


    const refresh =
        document.getElementById(
            "refreshBtn"
        );


    if(refresh) {


        refresh.addEventListener(
            "click",
            loadApplicationData
        );


    }


}




/* ================================
   Start
================================ */


async function start() {


    initializeNavigation();


    initializeButtons();


    await loadApplicationData();


    GolfTracker.initialized = true;


    console.log(
        "Golf Tracker v3 loaded"
    );


}



document.addEventListener(
    "DOMContentLoaded",
    start
);


})();
