/* ==========================================
   Golf Tracker v3
   Main Application Controller

   Deliverable 35
========================================== */

"use strict";


window.GolfTracker = {


    rounds: [],

    players: {},



    /* ================================
       Application Startup
    ================================= */


    async start() {


        try {


            UI.showLoading(
                "Loading Golf Tracker..."
            );


            UI.clearError();



            StorageManager.initializeDefaults();



            await this.loadApplicationData();



            this.initializeModules();



            this.renderApplication();



            UI.initialize();



            UI.hideLoading();



        }


        catch(error) {


            console.error(

                "Golf Tracker startup error:",

                error

            );


            UI.showError(

                error.message

            );


            UI.hideLoading();


        }


    },







    /* ================================
       Load CSV Data
    ================================= */


    async loadApplicationData() {


        const csvText =

            await CSV.loadCSV();



        this.rounds =

            CSV.parseRounds(
                csvText
            );



        if(

            !this.rounds ||

            this.rounds.length === 0

        ) {


            throw new Error(

                "No golf rounds found in CSV."

            );


        }





        this.players =

            Handicap.initializePlayers(

                this.rounds

            );



    },







    /* ================================
       Module Initialization
    ================================= */


    initializeModules() {



        Solver.initialize(

            this.players,

            this.rounds

        );





        TimeMachine.initialize(

            this.rounds

        );





        if(

            typeof Charts !== "undefined"

        ) {


            Charts.initialize();


        }





        if(

            typeof Impact !== "undefined"

        ) {


            Impact.initialize(

                this.players,

                this.rounds

            );


        }



    },







    /* ================================
       Render Application
    ================================= */


    renderApplication() {



        Dashboard.render(

            this.players

        );





        History.render(

            this.rounds

        );





        Analysis.render(

            this.players,

            this.rounds

        );





        if(

            typeof Charts !== "undefined"

        ) {


            const firstPlayer =

                Object.keys(
                    this.players
                )[0];



            Charts.renderPlayer(

                firstPlayer

            );


        }






        if(

            typeof Impact !== "undefined"

        ) {


            Impact.render(

                this.players

            );


        }



    },







    /* ================================
       Refresh Data
    ================================= */


    async refresh() {



        try {


            UI.showLoading(

                "Refreshing data..."

            );



            await this.loadApplicationData();



            this.initializeModules();



            this.renderApplication();



            UI.hideLoading();



            UI.toast(

                "Data refreshed."

            );


        }


        catch(error) {



            console.error(

                "Refresh error:",

                error

            );


            UI.showError(

                error.message

            );


            UI.hideLoading();


        }



    },







    /* ================================
       Access Helpers
    ================================= */


    getPlayer(name) {



        return (

            this.players[name]

            ||

            null

        );


    },







    getRounds(player = null) {



        if(!player) {


            return this.rounds;


        }



        return this.rounds.filter(


            round =>

            round.player === player


        );


    }





};







/* ==========================================
   Start Application
========================================== */


document.addEventListener(

    "DOMContentLoaded",

    () => {


        GolfTracker.start();


    }

);
