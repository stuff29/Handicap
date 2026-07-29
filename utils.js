/* ==========================================
   Golf Tracker v3
   Utility Functions
   ========================================== */

"use strict";


window.Utils = {


    /* ================================
       Number Helpers
    ================================= */


    toNumber(value, fallback = 0) {


        const number =
            parseFloat(value);


        return Number.isFinite(number)
            ? number
            : fallback;


    },



    round(value, decimals = 1) {


        const factor =
            Math.pow(10, decimals);


        return Math.round(
            value * factor
        ) / factor;


    },



    clamp(value, min, max) {


        return Math.min(
            Math.max(value, min),
            max
        );


    },




    /* ================================
       Date Helpers
    ================================= */


    parseDate(value) {


        if(!value) {

            return null;

        }


        const date =
            new Date(value);


        if(isNaN(date.getTime())) {

            return null;

        }


        return date;


    },



    formatDate(value) {


        const date =
            Utils.parseDate(value);



        if(!date) {

            return "-";

        }


        return date
            .toISOString()
            .split("T")[0];


    },



    compareDates(a,b) {


        const dateA =
            Utils.parseDate(a);


        const dateB =
            Utils.parseDate(b);



        if(!dateA && !dateB) {

            return 0;

        }


        if(!dateA) {

            return 1;

        }


        if(!dateB) {

            return -1;

        }


        return dateA - dateB;


    },





    /* ================================
       Handicap Display
    ================================= */


    formatHandicap(value) {


        if(value === null ||
           value === undefined ||
           isNaN(value)) {


            return "--";


        }


        return Number(value)
            .toFixed(1);


    },



    formatDifferential(value) {


        if(value === null ||
           value === undefined ||
           isNaN(value)) {


            return "--";


        }


        return Number(value)
            .toFixed(1);


    },





    /* ================================
       Array Helpers
    ================================= */


    sortByDateAscending(rounds) {


        return [...rounds]
            .sort(
                (a,b) =>
                    Utils.compareDates(
                        a.date,
                        b.date
                    )
            );


    },



    sortByDateDescending(rounds) {


        return [...rounds]
            .sort(
                (a,b) =>
                    Utils.compareDates(
                        b.date,
                        a.date
                    )
            );


    },



    unique(values) {


        return [
            ...new Set(values)
        ];


    },



    groupBy(array,key) {


        return array.reduce(
            (groups,item)=>{


                const value =
                    item[key];


                if(!groups[value]) {

                    groups[value] = [];

                }


                groups[value].push(item);


                return groups;


            },
            {}
        );


    },





    /* ================================
       Player Helpers
    ================================= */


    getPlayerRounds(rounds, player) {


        return rounds.filter(
            round =>
                round.player === player
        );


    },



    getPlayers(rounds) {


        return Utils.unique(
            rounds.map(
                round =>
                    round.player
            )
        );


    },





    /* ================================
       Validation
    ================================= */


    isValidRound(round) {


        if(!round) {

            return false;

        }


        return (

            round.player &&
            round.score !== undefined &&
            round.date

        );


    },



    cleanString(value) {


        if(value === null ||
           value === undefined) {

            return "";

        }


        return String(value)
            .trim();


    },





    /* ================================
       Object Helpers
    ================================= */


    clone(object) {


        return JSON.parse(
            JSON.stringify(object)
        );


    },



    merge(target, source) {


        return Object.assign(
            {},
            target,
            source
        );


    },





    /* ================================
       UI Helpers
    ================================= */


    createElement(
        tag,
        className = "",
        text = ""
    ) {


        const element =
            document.createElement(tag);



        if(className) {

            element.className =
                className;

        }


        if(text) {

            element.textContent =
                text;

        }


        return element;


    },



    escapeHTML(value) {


        return String(value)
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );


    }


};