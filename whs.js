/* ==========================================
   Golf Tracker v3
   WHS / Golf Canada Handicap Engine
   ========================================== */

"use strict";


window.WHS = {


    /* ================================
       Score Differential

       Formula:

       Differential =
       (Adjusted Score - Course Rating)
       x 113 / Slope Rating

    ================================= */


    calculateDifferential(round) {


        if(!round) {

            return null;

        }



        const score =
            Number(round.score);



        const rating =
            Number(round.rating);



        const slope =
            Number(round.slope);



        if(
            isNaN(score) ||
            isNaN(rating) ||
            isNaN(slope) ||
            slope <= 0
        ){

            return null;

        }



        const adjustedScore =
            this.applyMaximumScore(
                score,
                round
            );



        const differential =

            (
                adjustedScore -
                rating
            )

            *

            (

                113 /
                slope

            );



        return this.roundDifferential(
            differential
        );


    },





    /* ================================
       Maximum Score Framework

       Placeholder for Net Double Bogey
       adjustments.

       Full hole-by-hole adjustments
       require hole scores.

    ================================= */


    applyMaximumScore(score, round) {


        return score;


    },





    /* ================================
       Differential Rounding

       WHS rounds to nearest tenth

    ================================= */


    roundDifferential(value) {


        return Math.round(
            value * 10
        ) / 10;


    },





    /* ================================
       Calculate Handicap Index

       Uses:

       Lowest 8 differentials
       from most recent 20 rounds

    ================================= */


    calculateHandicapIndex(rounds) {


        if(
            !rounds ||
            rounds.length === 0
        ){

            return null;

        }



        const differentials =

            rounds

            .map(round => {


                return {

                    ...round,

                    differential:
                        this.calculateDifferential(
                            round
                        )

                };


            })


            .filter(
                round =>
                round.differential !== null
            );



        if(differentials.length === 0){

            return null;

        }



        const recent20 =

            differentials

            .slice(-20);



        const sorted =

            [...recent20]

            .sort(
                (a,b)=>
                a.differential -
                b.differential
            );



        const count =

            this.getCountingRoundNumber(
                recent20.length
            );



        const countingRounds =

            sorted.slice(
                0,
                count
            );



        const total =

            countingRounds.reduce(

                (sum,round)=>

                    sum +
                    round.differential,

                0

            );



        const handicap =

            total /
            countingRounds.length;



        return Math.round(
            handicap * 10
        ) / 10;


    },





    /* ================================
       Counting Differential Count

       WHS:

       3-5 rounds = 1
       6-8 rounds = 2
       9-11 rounds = 3
       12-14 rounds = 4
       15-16 rounds = 5
       17 rounds = 6
       18 rounds = 7
       19-20 rounds = 8

    ================================= */


    getCountingRoundNumber(totalRounds) {


        if(totalRounds < 3){

            return 0;

        }


        if(totalRounds <= 5){

            return 1;

        }


        if(totalRounds <= 8){

            return 2;

        }


        if(totalRounds <= 11){

            return 3;

        }


        if(totalRounds <= 14){

            return 4;

        }


        if(totalRounds <= 16){

            return 5;

        }


        if(totalRounds === 17){

            return 6;

        }


        if(totalRounds === 18){

            return 7;

        }


        return 8;


    },





    /* ================================
       Determine Counting Rounds

    ================================= */


    identifyCountingRounds(rounds) {


        const withDiff =

            rounds.map(
                round => ({

                    ...round,

                    differential:
                    this.calculateDifferential(
                        round
                    )

                })
            );



        const sorted =

            [...withDiff]

            .sort(
                (a,b)=>

                a.differential -
                b.differential

            );



        const count =

            this.getCountingRoundNumber(
                rounds.length
            );



        const countingIds =

            sorted

            .slice(0,count)

            .map(
                round =>
                round
            );



        return rounds.map(round => {


            const isCounting =

                countingIds.includes(
                    round
                );



            return {

                ...round,

                counting:
                    isCounting

            };


        });



    },





    /* ================================
       Player Handicap Calculation

    ================================= */


    calculatePlayerHandicap(
        rounds,
        player
    ) {


        const playerRounds =

            rounds.filter(
                round =>
                round.player === player
            );



        return this.calculateHandicapIndex(
            playerRounds
        );


    }


};