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
         * Give every round a temporary internal
         * index so that rounds are identified by
         * their actual record rather than date.
         */

        const indexedRounds =
            rounds.map(
                (round, index) => ({
                    ...round,
                    _historyIndex: index
                })
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
         * Get this player's rounds only.
         */

        const playerRounds =
            rounds
                .filter(
                    r =>
                        r.player ===
                        round.player
                )
                .sort(
                    (a, b) =>
                        new Date(b.date) -
                        new Date(a.date)
                );


        /*
         * WHS Handicap Index uses the most
         * recent 20 scores when 20 or more
         * scores are available.
         */

        const recent20 =
            playerRounds.slice(
                0,
                20
            );


        /*
         * Calculate differentials for the
         * eligible 20 rounds.
         */

        const differentials =
            recent20

                .map(
                    r => ({

                        round: r,

                        differential:
                            WHS.calculateDifferential(
                                r
                            )

                    })
                )

                .filter(
                    x =>
                        x.differential !== null &&
                        Number.isFinite(
                            x.differential
                        )
                )

                .sort(
                    (a, b) =>
                        a.differential -
                        b.differential
                );


        /*
         * Select exactly the Best 8
         * differentials, or fewer if the
         * player has fewer than 20 valid
         * rounds.
         */

        const best =
            differentials.slice(
                0,
                Math.min(
                    8,
                    differentials.length
                )
            );


        /*
         * IMPORTANT:
         *
         * Identify the actual round by its
         * internal history index.
         *
         * Do NOT identify by date because two
         * rounds can potentially have the same
         * date.
         */

        return best.some(
            x =>
                x.round._historyIndex ===
                round._historyIndex
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
                    (a, b) =>
                        new Date(a.date) -
                        new Date(b.date)
                );


        /*
         * Remove only this exact round.
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
                        ? round.player
                            .toLowerCase()
                        : "";


                const rowClass =
                    round.counting

                        ? "counting " +
                          playerClass

                        : "non-counting " +
                          playerClass;


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
