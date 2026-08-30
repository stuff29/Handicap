```javascript
/* ==========================================
   Golf Tracker v3
   WHS / Golf Canada Handicap Engine
   Corrected Counting-Round Logic
   ========================================== */

"use strict";


window.WHS = {


    /* ==========================================
       Score Differential

       Formula:

       Differential =
       (Adjusted Score - Course Rating)
       x 113 / Slope Rating
    ========================================== */

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


    /* ==========================================
       Maximum Score Framework

       Hole-by-hole Net Double Bogey adjustment
       requires hole-by-hole scores.

       The current tracker contains total scores,
       so the score is returned unchanged.
    ========================================== */

    applyMaximumScore(score, round) {

        return score;

    },


    /* ==========================================
       Differential Rounding

       WHS rounds to nearest tenth
    ========================================== */

    roundDifferential(value) {

        return Math.round(
            value * 10
        ) / 10;

    },


    /* ==========================================
       Calculate Handicap Index

       Uses the lowest applicable number of
       differentials from the most recent 20
       rounds.
    ========================================== */

    calculateHandicapIndex(rounds) {

        if (
            !rounds ||
            rounds.length === 0
        ) {

            return null;

        }


        const differentials =

            rounds

                .map((round, index) => ({

                    ...round,

                    _sourceIndex: index,

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


        /*
         * Only the most recent 20 valid
         * score differentials are used.
         */

        const recent20 =

            differentials.slice(-20);


        const count =

            this.getCountingRoundNumber(
                recent20.length
            );


        /*
         * Fewer than 3 rounds does not
         * produce a handicap index.
         */

        if (
            count === 0
        ) {

            return null;

        }


        const sorted =

            [...recent20]

                .sort(
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


    /* ==========================================
       Counting Differential Count

       WHS:

       3-5 rounds  = 1
       6-8 rounds  = 2
       9-11 rounds = 3
       12-14      = 4
       15-16      = 5
       17         = 6
       18         = 7
       19-20      = 8
    ========================================== */

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


    /* ==========================================
       Determine Counting Rounds

       This function uses EXACTLY the same
       logic as calculateHandicapIndex().

       Important:
       - Only the most recent 20 valid
         differentials count.
       - Only the lowest applicable number
         of differentials are selected.
       - Rounds are identified by their
         original object reference/index,
         NOT by date.

       This prevents two rounds on the same
       date from being confused with one another.
    ========================================== */

    identifyCountingRounds(rounds) {

        if (
            !rounds ||
            rounds.length === 0
        ) {

            return [];

        }


        /*
         * Calculate differentials while preserving
         * the original round object.
         */

        const withDiff =

            rounds.map(
                (round, index) => ({

                    ...round,

                    _sourceRound:
                        round,

                    _sourceIndex:
                        index,

                    differential:
                        this.calculateDifferential(
                            round
                        )

                })
            );


        /*
         * The function can safely receive either:
         *
         * 1. One player's rounds
         * 2. A complete set of rounds containing
         *    multiple players
         *
         * Group by player when player information
         * exists.
         */

        const groups = {};


        withDiff.forEach(round => {

            const key =
                round.player !== undefined
                    ? String(round.player)
                    : "__ALL__";


            if (!groups[key]) {
                groups[key] = [];
            }


            groups[key].push(round);

        });


        /*
         * Determine the counting rounds within
         * each player's group.
         */

        Object.values(groups).forEach(
            playerRounds => {


                const validRounds =

                    playerRounds

                        .filter(
                            round =>
                                round.differential !== null &&
                                Number.isFinite(
                                    round.differential
                                )
                        );


                /*
                 * Only the most recent 20
                 * valid differentials.
                 */

                const recent20 =

                    validRounds.length > 20

                        ? validRounds.slice(
                            validRounds.length - 20
                        )

                        : validRounds;


                const count =

                    this.getCountingRoundNumber(
                        recent20.length
                    );


                /*
                 * Sort a COPY so the original
                 * chronological order remains intact.
                 */

                const sorted =

                    [...recent20]

                        .sort(
                            (a, b) =>
                                a.differential -
                                b.differential
                        );


                const countingRounds =

                    sorted.slice(
                        0,
                        count
                    );


                /*
                 * Use object references to identify
                 * the actual rounds.
                 *
                 * This is important because dates
                 * are NOT guaranteed to be unique.
                 */

                const countingSet =
                    new Set(
                        countingRounds.map(
                            round =>
                                round._sourceRound
                        )
                    );


                playerRounds.forEach(round => {

                    round.counting =
                        countingSet.has(
                            round._sourceRound
                        );

                });

            }
        );


        return withDiff;

    },


    /* ==========================================
       Player Handicap Calculation
    ========================================== */

    calculatePlayerHandicap(
        rounds,
        player
    ) {

        if (
            !rounds ||
            !player
        ) {

            return null;

        }


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
