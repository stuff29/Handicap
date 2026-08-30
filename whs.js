```text
/* ==========================================
   Golf Tracker v3
   WHS / Golf Canada Handicap Engine
   ========================================== */

"use strict";


window.WHS = {


    /* ================================
       Score Differential
    ================================= */

    calculateDifferential(round) {

        if (!round) {
            return null;
        }


        const score =
            Number(round.score);


        const rating =
            Number(round.rating);


        const slope =
            Number(round.slope);


        if (
            isNaN(score) ||
            isNaN(rating) ||
            isNaN(slope) ||
            slope <= 0
        ) {
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
            ) *
            (
                113 /
                slope
            );


        return this.roundDifferential(
            differential
        );

    },


    /* ================================
       Maximum Score
    ================================= */

    applyMaximumScore(score, round) {

        return score;

    },


    /* ================================
       Differential Rounding
    ================================= */

    roundDifferential(value) {

        return Math.round(
            value * 10
        ) / 10;

    },


    /* ================================
       Calculate Handicap Index
    ================================= */

    calculateHandicapIndex(rounds) {

        if (
            !rounds ||
            rounds.length === 0
        ) {
            return null;
        }


        const differentials =

            rounds

                .map(round => ({

                    ...round,

                    differential:
                        this.calculateDifferential(
                            round
                        )

                }))

                .filter(
                    round =>
                        round.differential !== null &&
                        Number.isFinite(
                            round.differential
                        )
                );


        if (
            differentials.length === 0
        ) {
            return null;
        }


        const recent20 =
            differentials.slice(-20);


        const count =
            this.getCountingRoundNumber(
                recent20.length
            );


        if (count === 0) {
            return null;
        }


        const sorted =
            [...recent20].sort(
                (a, b) =>
                    a.differential -
                    b.differential
            );


        const countingRounds =
            sorted.slice(
                0,
                count
            );


        const total =
            countingRounds.reduce(
                (sum, round) =>
                    sum + round.differential,
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
       WHS Counting Round Number
    ================================= */

    getCountingRoundNumber(totalRounds) {

        if (totalRounds < 3) {
            return 0;
        }


        if (totalRounds <= 5) {
            return 1;
        }


        if (totalRounds <= 8) {
            return 2;
        }


        if (totalRounds <= 11) {
            return 3;
        }


        if (totalRounds <= 14) {
            return 4;
        }


        if (totalRounds <= 16) {
            return 5;
        }


        if (totalRounds === 17) {
            return 6;
        }


        if (totalRounds === 18) {
            return 7;
        }


        return 8;

    },


    /* ================================
       Identify Counting Rounds

       This uses the same Best 8 of
       Most Recent 20 logic as the
       handicap calculation.

       It identifies rounds by their
       original array position rather
       than by date.
    ================================= */

    identifyCountingRounds(rounds) {

        if (
            !rounds ||
            rounds.length === 0
        ) {
            return [];
        }


        const result =
            rounds.map(
                (round, index) => ({

                    ...round,

                    _sourceIndex: index,

                    differential:
                        this.calculateDifferential(
                            round
                        ),

                    counting: false

                })
            );


        const players = {};


        result.forEach(round => {

            const player =
                String(
                    round.player || ""
                );


            if (!players[player]) {
                players[player] = [];
            }


            players[player].push(
                round
            );

        });


        Object.keys(players).forEach(
            playerName => {

                const playerRounds =
                    players[playerName];


                const validRounds =
                    playerRounds.filter(
                        round =>
                            round.differential !== null &&
                            Number.isFinite(
                                round.differential
                            )
                    );


                const recent20 =
                    validRounds.length > 20
                        ? validRounds.slice(-20)
                        : validRounds;


                const count =
                    this.getCountingRoundNumber(
                        recent20.length
                    );


                const sorted =
                    [...recent20].sort(
                        (a, b) =>
                            a.differential -
                            b.differential
                    );


                const countingRounds =
                    sorted.slice(
                        0,
                        count
                    );


                const countingIndexes =
                    new Set(
                        countingRounds.map(
                            round =>
                                round._sourceIndex
                        )
                    );


                playerRounds.forEach(
                    round => {

                        round.counting =
                            countingIndexes.has(
                                round._sourceIndex
                            );

                    }
                );

            }
        );


        return result;

    },


    /* ================================
       Player Handicap
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
```
