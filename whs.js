/* ==========================================
   Golf Tracker v3
   WHS / Golf Canada Handicap Engine
   ========================================== */

"use strict";

window.WHS = {

    calculateDifferential(round) {

        if (!round) {
            return null;
        }

        const score = Number(round.score);
        const rating = Number(round.rating);
        const slope = Number(round.slope);

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
            (adjustedScore - rating) *
            (113 / slope);

        return this.roundDifferential(
            differential
        );
    },


    applyMaximumScore(score, round) {

        /*
         * Hole-by-hole Net Double Bogey adjustment
         * cannot be performed because the CSV contains
         * total scores rather than individual hole scores.
         *
         * Therefore the submitted score is currently
         * used unchanged.
         */

        return score;
    },


    roundDifferential(value) {

        return Math.round(
            value * 10
        ) / 10;
    },


    calculateHandicapIndex(rounds) {

        if (
            !rounds ||
            rounds.length === 0
        ) {
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
         * WHS handicap calculation uses
         * the most recent 20 acceptable scores.
         */

        const recent20 =
            differentials.slice(-20);

        const sorted =
            [...recent20].sort(
                (a, b) =>
                    a.differential -
                    b.differential
            );

        const count =
            this.getCountingRoundNumber(
                recent20.length
            );

        if (count === 0) {
            return null;
        }

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


    identifyCountingRounds(rounds) {

        if (
            !rounds ||
            rounds.length === 0
        ) {
            return [];
        }

        const withDiff =
            rounds.map(round => ({
                ...round,

                differential:
                    this.calculateDifferential(
                        round
                    )
            }));

        const recentRounds =
            withDiff.length > 20
                ? withDiff.slice(
                    withDiff.length - 20
                )
                : withDiff;

        const sorted =
            [...recentRounds].sort(
                (a, b) =>
                    a.differential -
                    b.differential
            );

        const count =
            this.getCountingRoundNumber(
                recentRounds.length
            );

        const countingRounds =
            sorted.slice(
                0,
                count
            );

        /*
         * Use a unique round identity based on
         * player + date + score rather than date alone.
         */

        const countingKeys =
            new Set(
                countingRounds.map(
                    r =>
                        `${r.player}|${r.date}|${r.score}`
                )
            );

        return withDiff.map(round => ({

            ...round,

            counting:
                countingKeys.has(
                    `${round.player}|${round.date}|${round.score}`
                )

        }));
    },


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
