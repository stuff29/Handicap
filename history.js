```javascript
/* ==========================================
   Golf Tracker v3
   Enhanced Round History Module
   Deliverable 38
   ========================================== */

"use strict";


window.History = {

    currentFilter: "All",


    /* ==========================================
       Render
    ========================================== */

    render(rounds) {

        const container =
            document.getElementById(
                "historyTable"
            );


        if (!container) {
            return;
        }


        if (
            !rounds ||
            rounds.length === 0
        ) {

            container.innerHTML = `
                <div class="card">
                    No rounds loaded.
                </div>
            `;

            return;
        }


        const analyzed =
            this.analyzeRounds(rounds);


        const sorted =
            Utils.sortByDateDescending(
                analyzed
            );


        container.innerHTML =
            this.buildTable(sorted);

    },


    /* ==========================================
       Analyze Rounds
    ========================================== */

    analyzeRounds(rounds) {

        /*
         * Assign every round its original array
         * position. This gives us a unique way
         * to identify a round even when two
         * rounds have the same date.
         */

        const indexedRounds =
            rounds.map(
                (round, index) => {

                    return {
                        ...round,
                        _historyIndex: index
                    };

                }
            );


        return indexedRounds.map(
            round => {

                const differential =
                    WHS.calculateDifferential(
                        round
                    );


                return {

                    ...round,

                    differential,

                    counting:
                        this.isCountingRound(
                            round,
                            indexedRounds
                        ),

                    impact:
                        this.getImpact(
                            round,
                            indexedRounds
                        )

                };

            }
        );

    },


    /* ==========================================
       Determine Counting Rounds
    ========================================== */

    isCountingRound(
        round,
        rounds
    ) {

        /*
         * Only consider this player's rounds.
         */

        const playerRounds =
            rounds
                .filter(
                    r =>
                        r.player ===
                        round.player
                )
                .sort(
                    (a, b) => {

                        return (
                            new Date(b.date) -
                            new Date(a.date)
                        );

                    }
                );


        /*
         * WHS uses the most recent 20 scores
         * once a player has 20 or more scores.
         */

        const eligibleRounds =
            playerRounds.slice(
                0,
                20
            );


        /*
         * Calculate each eligible differential.
         */

        const differentials =
            eligibleRounds
                .map(
                    r => {

                        return {
                            round: r,

                            differential:
                                WHS.calculateDifferential(
                                    r
                                )
                        };

                    }
                )
                .filter(
                    item => {

                        return (
                            item.differential !== null &&
                            Number.isFinite(
                                item.differential
                            )
                        );

                    }
                )
                .sort(
                    (a, b) => {

                        return (
                            a.differential -
                            b.differential
                        );

                    }
                );


        /*
         * Select the Best 8.
         */

        const bestEight =
            differentials.slice(
                0,
                8
            );


        /*
         * Identify the actual round using its
         * unique history index rather than date.
         */

        return bestEight.some(
            item => {

                return (
                    item.round._historyIndex ===
                    round._historyIndex
                );

            }
        );

    },


    /* ==========================================
       Round Impact
    ========================================== */

    getImpact(
        round,
        rounds
    ) {

        const playerRounds =
            rounds
                .filter(
                    r =>
                        r.player ===
                        round.player
                )
                .sort(
                    (a, b) => {

                        return (
                            new Date(a.date) -
                            new Date(b.date)
                        );

                    }
                );


        /*
         * Remove this exact round rather than
         * removing every round with the same date.
         */

        const previousRounds =
            playerRounds.filter(
                r =>
                    r._historyIndex !==
                    round._historyIndex
            );


        const before =
            WHS.calculateHandicapIndex(
                previousRounds
            );


        const after =
            WHS.calculateHandicapIndex(
                playerRounds
            );


        if (
            before === null ||
            after === null
        ) {

            return "Not enough rounds";

        }


        if (after < before) {

            return (
                "Improved " +
                before.toFixed(1) +
                " → " +
                after.toFixed(1)
            );

        }


        if (after > before) {

            return (
                "Increased " +
                before.toFixed(1) +
                " → " +
                after.toFixed(1)
            );

        }


        return "No change";

    },


    /* ==========================================
       Build Table
    ========================================== */

    buildTable(rounds) {

        let html = `

            <table>

                <thead>

                    <tr>

                        <th>Date</th>
                        <th>Player</th>
                        <th>Course</th>
                        <th>Score</th>
                        <th>Differential</th>
                        <th>Status</th>
                        <th>Impact</th>

                    </tr>

                </thead>

                <tbody>

        `;


        rounds.forEach(
            round => {

                const playerClass =
                    round.player
                        ? round.player.toLowerCase()
                        : "";


                let rowClass;


                if (round.counting) {

                    rowClass =
                        "counting " +
                        playerClass;

                } else {

                    rowClass =
                        "non-counting " +
                        playerClass;

                }


                html += `

                    <tr class="${rowClass}">

                        <td>
                            ${Utils.formatDate(
                                round.date
                            )}
                        </td>


                        <td>
                            ${Utils.escapeHTML(
                                round.player
                            )}
                        </td>


                        <td>
                            ${Utils.escapeHTML(
                                round.course
                            )}
                        </td>


                        <td>
                            ${round.score}
                        </td>


                        <td>
                            ${Utils.formatDifferential(
                                round.differential
                            )}
                        </td>


                        <td>
                            ${
                                round.counting
                                    ? "Counting"
                                    : "Non-counting"
                            }
                        </td>


                        <td>
                            ${round.impact}
                        </td>

                    </tr>

                `;

            }
        );


        html += `

                </tbody>

            </table>

        `;


        return html;

    },


    /* ==========================================
       Filter By Player
    ========================================== */

    filterByPlayer(
        rounds,
        player
    ) {

        if (
            !player ||
            player === "All"
        ) {

            return rounds;

        }


        return rounds.filter(
            round =>
                round.player === player
        );

    },


    /* ==========================================
       Get Counting Rounds
    ========================================== */

    getCountingRounds(rounds) {

        return rounds.filter(
            round =>
                round.counting
        );

    },


    /* ==========================================
       Get Non-Counting Rounds
    ========================================== */

    getNonCountingRounds(rounds) {

        return rounds.filter(
            round =>
                !round.counting
        );

    }

};
```
