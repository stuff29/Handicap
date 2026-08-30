/* ==========================================
   Golf Tracker v3
   WHS / Golf Canada Handicap Engine
   Corrected Round Selection
   ========================================== */

"use strict";


window.WHS = {


    /* ==========================================
       Score Differential
       
       Differential =
       (Adjusted Score - Course Rating)
       × 113 / Slope Rating
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
            !Number.isFinite(score) ||
            !Number.isFinite(rating) ||
            !Number.isFinite(slope) ||
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
       
       Currently returns the entered score.
       
       Full Net Double Bogey adjustment requires
       hole-by-hole score information.
    ========================================== */

    applyMaximumScore(score, round) {

        return score;

    },


    /* ==========================================
       Differential Rounding
       
       WHS rounds to nearest tenth.
    ========================================== */

    roundDifferential(value) {

        return Math.round(
            value * 10
        ) / 10;

    },


    /* ==========================================
       Parse Date Safely
       
       Dates are expected in YYYY-MM-DD format.
    ========================================== */

    getDateValue(round) {

        if (!round || !round.date) {
            return 0;
        }


        const value =
            new Date(
                String(round.date) +
                "T00:00:00"
            ).getTime();


        return Number.isFinite(value)
            ? value
            : 0;

    },


    /* ==========================================
       Sort Rounds Chronologically
       
       Returns a new array.
       
       Oldest → newest.
       
       The original array is never modified.
    ========================================== */

    sortChronologically(rounds) {

        if (!Array.isArray(rounds)) {
            return [];
        }


        return [...rounds].sort(
            (a, b) => {

                const dateA =
                    this.getDateValue(a);

                const dateB =
                    this.getDateValue(b);


                if (dateA !== dateB) {
                    return dateA - dateB;
                }


                /*
                 * If two rounds have the same date,
                 * preserve their original relative order.
                 */

                return 0;

            }
        );

    },


    /* ==========================================
       Get Most Recent 20 Rounds
       
       WHS handicap calculations use the
       most recent 20 eligible scores.
    ========================================== */

    getRecentRounds(rounds) {

        const sorted =
            this.sortChronologically(
                rounds
            );


        if (sorted.length <= 20) {
            return sorted;
        }


        return sorted.slice(
            sorted.length - 20
        );

    },


    /* ==========================================
       Counting Differential Count
       
       WHS:
       
       3-5 rounds  = 1
       6-8 rounds  = 2
       9-11 rounds = 3
       12-14       = 4
       15-16       = 5
       17          = 6
       18          = 7
       19-20       = 8
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
       Prepare Rounds With Differentials
    ========================================== */

    prepareRounds(rounds) {

        if (!Array.isArray(rounds)) {
            return [];
        }


        return rounds
            .map(
                (round, index) => ({

                    ...round,

                    /*
                     * Internal identifier.
                     *
                     * This allows us to distinguish
                     * two rounds played on the same date.
                     */

                    _whsIndex: index,

                    differential:
                        this.calculateDifferential(
                            round
                        )

                })
            )
            .filter(
                round =>
                    round.differential !== null &&
                    Number.isFinite(
                        round.differential
                    )
            );

    },


    /* ==========================================
       Identify Counting Rounds
       
       THIS IS NOW THE SINGLE SOURCE OF TRUTH
       
       1. Sort chronologically.
       2. Take the most recent 20.
       3. Determine how many count.
       4. Select the lowest differentials.
    ========================================== */

    getCountingRounds(rounds) {

        const prepared =
            this.prepareRounds(
                rounds
            );


        if (prepared.length === 0) {
            return [];
        }


        const recent20 =
            this.getRecentRounds(
                prepared
            );


        const count =
            this.getCountingRoundNumber(
                recent20.length
            );


        if (count === 0) {
            return [];
        }


        const sortedByDifferential =
            [...recent20].sort(
                (a, b) => {

                    if (
                        a.differential !==
                        b.differential
                    ) {

                        return (
                            a.differential -
                            b.differential
                        );

                    }


                    /*
                     * If differentials are identical,
                     * use the newer round as the
                     * tie-breaker.
                     */

                    return (
                        this.getDateValue(b) -
                        this.getDateValue(a)
                    );

                }
            );


        return sortedByDifferential.slice(
            0,
            count
        );

    },


    /* ==========================================
       Calculate Handicap Index
       
       Uses:
       
       - Most recent 20 eligible rounds
       - Lowest required number of differentials
    ========================================== */

    calculateHandicapIndex(rounds) {

        const prepared =
            this.prepareRounds(
                rounds
            );


        if (prepared.length === 0) {
            return null;
        }


        const recent20 =
            this.getRecentRounds(
                prepared
            );


        if (recent20.length === 0) {
            return null;
        }


        const countingRounds =
            this.getCountingRoundNumber(
                recent20.length
            );


        if (countingRounds === 0) {

            /*
             * For fewer than 3 rounds,
             * there is not enough information
             * for the normal calculation.
             */

            return null;

        }


        const sorted =
            [...recent20].sort(
                (a, b) =>
                    a.differential -
                    b.differential
            );


        const selected =
            sorted.slice(
                0,
                countingRounds
            );


        const total =
            selected.reduce(
                (sum, round) =>
                    sum +
                    round.differential,
                0
            );


        const handicap =
            total /
            selected.length;


        return Math.round(
            handicap * 10
        ) / 10;

    },


    /* ==========================================
       Identify Counting Rounds
       
       Returns the original rounds with a
       counting property.
       
       This is used by the History module.
    ========================================== */

    identifyCountingRounds(rounds) {

        if (!Array.isArray(rounds)) {
            return [];
        }


        const prepared =
            this.prepareRounds(
                rounds
            );


        const countingRounds =
            this.getCountingRounds(
                rounds
            );


        /*
         * Use the internal WHS index to identify
         * the exact rounds that count.
         */

        const countingIndexes =
            new Set(
                countingRounds.map(
                    round =>
                        round._whsIndex
                )
            );


        return prepared.map(
            round => ({

                ...round,

                counting:
                    countingIndexes.has(
                        round._whsIndex
                    )

            })
        );

    },


    /* ==========================================
       Calculate Player Handicap
    ========================================== */

    calculatePlayerHandicap(
        rounds,
        player
    ) {

        if (!Array.isArray(rounds)) {
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

    },


    /* ==========================================
       Get Player Counting Rounds
       
       Convenience method used by other modules.
    ========================================== */

    getPlayerCountingRounds(
        rounds,
        player
    ) {

        if (!Array.isArray(rounds)) {
            return [];
        }


        const playerRounds =
            rounds.filter(
                round =>
                    round.player === player
            );


        return this.getCountingRounds(
            playerRounds
        );

    }

};
