/* ==========================================
   Golf Tracker v3
   Handicap Management Module
   ========================================== */

"use strict";


window.Handicap = {


    /* ================================
       Initialize Players
    ================================= */


    initializePlayers(rounds) {


        const players = {};



        const configuredPlayers =
            Object.keys(
                GolfConfig.players
            );



        configuredPlayers.forEach(
            playerName => {


                const playerRounds =

                    rounds.filter(
                        round =>
                        round.player === playerName
                    );



                players[playerName] =

                    this.buildPlayerProfile(
                        playerName,
                        playerRounds
                    );


            }
        );



        return players;


    },





    /* ================================
       Build Player Profile
    ================================= */


    buildPlayerProfile(
        name,
        rounds
    ) {


        const sortedRounds =

            Utils.sortByDateAscending(
                rounds
            );



        const handicap =

            WHS.calculateHandicapIndex(
                sortedRounds
            );



        const analyzedRounds =

            this.analyzeRounds(
                sortedRounds
            );



        return {


            name: name,


            targetHandicap:

                GolfConfig.players[name]
                    ?.targetHandicap ?? null,



            handicap:

                handicap,



            rounds:

                analyzedRounds,



            totalRounds:

                sortedRounds.length,



            averageScore:

                this.averageScore(
                    sortedRounds
                ),



            averageDifferential:

                this.averageDifferential(
                    sortedRounds
                )



        };


    },





    /* ================================
       Analyze Counting Rounds
    ================================= */


    analyzeRounds(rounds) {


        if(!rounds.length) {

            return [];

        }



        const withDifferentials =


            rounds.map(
                round => {


                    return {


                        ...round,


                        differential:

                            WHS.calculateDifferential(
                                round
                            )


                    };


                }
            );



        const recent20 =

            withDifferentials.slice(-20);



        const sorted =

            [...recent20]

            .sort(
                (a,b)=>

                a.differential -
                b.differential

            );



        const count =

            WHS.getCountingRoundNumber(
                recent20.length
            );



        const counting =

            sorted.slice(
                0,
                count
            );



        return withDifferentials.map(
            round => {


                return {


                    ...round,


                    counting:

                        counting.includes(
                            round
                        )



                };


            }
        );


    },





    /* ================================
       Average Score
    ================================= */


    averageScore(rounds) {


        if(!rounds.length) {

            return null;

        }



        const total =

            rounds.reduce(
                (sum,round)=>

                    sum +
                    Number(round.score),

                0
            );



        return Math.round(
            (
                total /
                rounds.length
            )
            *
            10
        )
        /
        10;


    },





    /* ================================
       Average Differential
    ================================= */


    averageDifferential(rounds) {


        const differentials =

            rounds.map(
                round =>

                WHS.calculateDifferential(
                    round
                )

            )
            .filter(
                value =>
                value !== null
            );



        if(!differentials.length) {

            return null;

        }



        const total =

            differentials.reduce(
                (sum,value)=>

                    sum + value,

                0
            );



        return Math.round(

            (
                total /
                differentials.length
            )
            *
            10

        )
        /
        10;


    },





    /* ================================
       Get Player Handicap
    ================================= */


    getHandicap(
        players,
        name
    ) {


        if(
            !players[name]
        ){

            return null;

        }



        return players[name]
            .handicap;


    },





    /* ================================
       Handicap Change Explanation
    ================================= */


    explainChange(
        oldHandicap,
        newHandicap
    ) {


        if(
            oldHandicap === null ||
            newHandicap === null
        ){

            return "Not enough rounds.";

        }



        const change =

            Math.round(
                (
                    newHandicap -
                    oldHandicap
                )
                *
                10
            )
            /
            10;



        if(change < 0) {


            return (

                "Handicap improved by " +
                Math.abs(change) +
                " strokes."

            );


        }



        if(change > 0) {


            return (

                "Handicap increased by " +
                change +
                " strokes."

            );


        }



        return "No handicap change.";


    }

};