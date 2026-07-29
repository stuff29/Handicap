/* ==========================================
   Golf Tracker v3
   Application Configuration
   ========================================== */


"use strict";


window.GolfConfig = {


    /* ================================
       Application Information
    ================================= */


    appName: "Golf Tracker v3",

    version: "3.0.0",



    /* ================================
       Google Sheet Data Source

       Replace CSV_URL with your existing
       published Google Sheet CSV link.

       Example:
       https://docs.google.com/spreadsheets/
       d/XXXX/export?format=csv

    ================================= */


    CSV_URL:
        "",



    /* ================================
       Players
    ================================= */


    players: {


        Mike: {


            name: "Mike",


            targetHandicap: 10.0,


            color: "green"


        },


        Johnny: {


            name: "Johnny",


            targetHandicap: 15.0,


            color: "blue"


        }


    },




    /* ================================
       Handicap Settings

       WHS / Golf Canada Rules
    ================================= */


    handicap: {


        roundsUsed: 20,


        countingRounds: 8,


        maxScoreDifferential: true,


        decimalPlaces: 1



    },




    /* ================================
       Solver Settings
    ================================= */


    solver: {


        defaultRoundsToPredict: 5,


        maxRoundsToPredict: 20


    },




    /* ================================
       Time Machine
    ================================= */


    timeMachine: {


        enabled: true,


        showCountingRounds: true


    },




    /* ================================
       Chart Settings
    ================================= */


    charts: {


        enabled: true,


        handicapTrend: true,


        differentialTrend: true,


        scoreTrend: true



    },




    /* ================================
       Display Settings
    ================================= */


    display: {


        dateFormat:
            "YYYY-MM-DD",


        handicapFormat:
            "0.0"



    }



};