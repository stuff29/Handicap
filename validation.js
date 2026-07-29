/* ==========================================
   Golf Tracker v3
   Data Validation & Diagnostics Module
   ========================================== */

"use strict";


window.Validation = {


    lastReport: null,



    /* ================================
       Run Full Validation
    ================================= */


    run(rounds, players) {


        const report = {


            timestamp:
                new Date()
                .toISOString(),


            totalRounds:
                rounds?.length || 0,


            players:
                {},


            errors:
                [],


            warnings:
                [],


            status:
                "PASS"


        };



        this.validateRounds(
            rounds,
            report
        );



        this.validatePlayers(
            players,
            report
        );



        this.validateWHS(
            rounds,
            report
        );



        if(
            report.errors.length > 0
        ) {


            report.status =
                "FAIL";


        }


        else if(
            report.warnings.length > 0
        ) {


            report.status =
                "WARNING";


        }



        this.lastReport =
            report;



        console.log(
            "Golf Tracker Validation:",
            report
        );



        return report;


    },





    /* ================================
       Round Validation
    ================================= */


    validateRounds(rounds, report) {


        if(
            !rounds ||
            rounds.length === 0
        ) {


            report.errors.push(

                "No rounds loaded."

            );


            return;


        }



        rounds.forEach(
            (round,index)=>{


                if(!round.player) {


                    report.errors.push(

                        `Round ${index + 1} missing player.`

                    );


                }



                if(
                    isNaN(
                        Number(round.score)
                    )
                ) {


                    report.errors.push(

                        `Round ${index + 1} has invalid score.`

                    );


                }



                if(
                    !round.date
                ) {


                    report.warnings.push(

                        `Round ${index + 1} missing date.`

                    );


                }



                if(
                    !round.rating ||
                    !round.slope
                ) {


                    report.warnings.push(

                        `Round ${index + 1} missing rating or slope.`

                    );


                }


            }
        );


    },





    /* ================================
       Player Validation
    ================================= */


    validatePlayers(players, report) {


        const requiredPlayers = [


            "Mike",

            "Johnny"


        ];



        requiredPlayers.forEach(
            player => {


                if(
                    !players ||
                    !players[player]
                ) {


                    report.errors.push(

                        `${player} not found.`

                    );


                    return;


                }



                report.players[player] = {


                    rounds:

                        players[player]
                        .totalRounds,


                    handicap:

                        players[player]
                        .handicap


                };


                if(
                    players[player]
                    .totalRounds < 3
                ) {


                    report.warnings.push(

                        `${player} has fewer than 3 rounds.`

                    );


                }


            }
        );


    },





    /* ================================
       WHS Validation
    ================================= */


    validateWHS(rounds, report) {


        if(
            !rounds ||
            rounds.length === 0
        ) {

            return;

        }



        let tested = 0;



        rounds.forEach(round => {



            const differential =

                WHS.calculateDifferential(
                    round
                );



            if(
                differential !== null
            ) {


                tested++;


            }


        });



        if(
            tested === 0
        ) {


            report.errors.push(

                "No WHS differentials could be calculated."

            );


        }



        else {


            console.log(

                `${tested} rounds passed WHS differential test.`

            );


        }


    },





    /* ================================
       Display Report
    ================================= */


    display() {


        if(
            !this.lastReport
        ) {


            return "No validation report available.";


        }



        return JSON.stringify(

            this.lastReport,

            null,

            2

        );


    }





};