/* ==========================================
   Golf Tracker v3
   Local Storage Manager
   ========================================== */

"use strict";


window.StorageManager = {


    prefix: "GolfTrackerV3_",



    /* ================================
       Core Storage Functions
    ================================= */


    save(key, value) {


        try {


            localStorage.setItem(

                this.prefix + key,

                JSON.stringify(value)

            );


            return true;


        }


        catch(error) {


            console.error(
                "Storage save error:",
                error
            );


            return false;


        }


    },




    get(key, defaultValue = null) {


        try {


            const value =

                localStorage.getItem(

                    this.prefix + key

                );



            if(value === null) {

                return defaultValue;

            }



            return JSON.parse(value);



        }


        catch(error) {


            console.error(
                "Storage read error:",
                error
            );


            return defaultValue;


        }


    },




    remove(key) {


        localStorage.removeItem(

            this.prefix + key

        );


    },




    clear() {


        Object.keys(localStorage)

            .filter(
                key =>
                key.startsWith(
                    this.prefix
                )
            )

            .forEach(
                key =>
                localStorage.removeItem(key)
            );


    },





    /* ================================
       CSV Settings
    ================================= */


    saveCSVURL(url) {


        return this.save(
            "csvURL",
            url
        );


    },



    getCSVURL() {


        return this.get(
            "csvURL",
            ""
        );


    },





    /* ================================
       User Preferences
    ================================= */


    savePreference(
        name,
        value
    ) {


        const preferences =
            this.get(
                "preferences",
                {}
            );



        preferences[name] =
            value;



        return this.save(
            "preferences",
            preferences
        );


    },




    getPreference(
        name,
        defaultValue = null
    ) {


        const preferences =
            this.get(
                "preferences",
                {}
            );



        return preferences.hasOwnProperty(name)

            ? preferences[name]

            : defaultValue;


    },





    /* ================================
       Navigation State
    ================================= */


    saveCurrentPage(page) {


        return this.save(
            "currentPage",
            page
        );


    },



    getCurrentPage() {


        return this.get(
            "currentPage",
            "dashboard"
        );


    },





    /* ================================
       Solver Settings
    ================================= */


    saveSolverSettings(settings) {


        return this.save(
            "solverSettings",
            settings
        );


    },



    getSolverSettings() {


        return this.get(
            "solverSettings",
            {

                player: "Mike",

                target: 10,

                rounds: 5

            }
        );


    },





    /* ================================
       Time Machine State
    ================================= */


    saveTimeIndex(index) {


        return this.save(
            "timeIndex",
            index
        );


    },



    getTimeIndex() {


        return this.get(
            "timeIndex",
            0
        );


    },





    /* ================================
       Application Initialization
    ================================= */


    initializeDefaults() {


        if(
            this.get(
                "preferences"
            ) === null
        ) {


            this.save(
                "preferences",
                {

                    theme: "light",

                    defaultPlayer: "Mike"

                }
            );


        }



        if(
            this.get(
                "solverSettings"
            ) === null
        ) {


            this.save(
                "solverSettings",
                {

                    player: "Mike",

                    target: 10,

                    rounds: 5

                }
            );


        }



    }





};