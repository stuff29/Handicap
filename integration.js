/* ==========================================
   Golf Tracker v3
   Integration Compatibility Layer
   ========================================== */

"use strict";


window.Integration = {


    requiredModules: [

        "GolfConfig",

        "Utils",

        "StorageManager",

        "CSV",

        "WHS",

        "Handicap",

        "Dashboard",

        "History",

        "Analysis",

        "Solver",

        "TimeMachine",

        "Charts",

        "UI"

    ],




    /* ================================
       Validate Modules
    ================================= */


    validateModules() {


        const missing = [];



        this.requiredModules.forEach(
            module => {


                if(
                    typeof window[module]
                    === "undefined"
                ) {


                    missing.push(
                        module
                    );


                }


            }
        );



        if(
            missing.length > 0
        ) {


            console.error(

                "Missing Golf Tracker modules:",

                missing

            );


            return false;


        }



        console.log(

            "Golf Tracker modules loaded successfully."

        );


        return true;


    },





    /* ================================
       Validate DOM
    ================================= */


    validateDOM() {


        const optionalElements = [


            "dashboardStats",

            "historyTable",

            "analysisContainer",

            "solverResults",

            "timeMachineResults",

            "trendChart",

            "errorMessage",

            "loadingMessage"


        ];



        const missing = [];



        optionalElements.forEach(
            id => {


                if(
                    !document.getElementById(id)
                ) {


                    missing.push(id);


                }


            }
        );



        if(
            missing.length > 0
        ) {


            console.warn(

                "Optional UI elements missing:",

                missing

            );


        }



    },





    /* ================================
       Application Diagnostics
    ================================= */


    diagnostics() {


        return {


            version:

                GolfConfig?.version
                || "unknown",



            roundsLoaded:

                GolfTracker?.rounds?.length
                || 0,



            players:

                Object.keys(

                    GolfTracker?.players
                    || {}

                ),



            timestamp:

                new Date()
                .toISOString()



        };


    },





    /* ================================
       Startup Hook
    ================================= */


    initialize() {


        const modulesOK =

            this.validateModules();



        this.validateDOM();



        if(modulesOK) {


            console.log(

                "Golf Tracker v3 integration ready."

            );


        }


    }


};





document.addEventListener(

    "DOMContentLoaded",

    () => {


        Integration.initialize();


    }

);