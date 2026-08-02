/* ==========================================
   Golf Tracker v3
   Main Application Controller
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


if(typeof Impact !== "undefined"){

    Impact.initialize(
        this.players,
        this.rounds
    );

}



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

    Charts.initialize();

},





    /* ================================
       Rendering
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



        Charts.render(

            this.players

        );



        if(
            typeof Impact !== "undefined"
        ) {


            Impact.initialize(

                this.players,

                this.rounds

            );


            Impact.render(

                this.players

            );


        }


    },





    /* ================================
       Refresh Data
    ================================= */


    async refresh() {


        await this.loadApplicationData();



        this.renderApplication();



        UI.toast(

            "Data refreshed."

        );


    },





    /* ================================
       Access Helpers
    ================================= */


    getPlayer(name) {


        return this.players[name] || null;


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
