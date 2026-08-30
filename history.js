```javascript
/* ==========================================
   Golf Tracker v3
   Enhanced Round History Module
   Corrected Counting-Round Logic
   ========================================== */

"use strict";


window.History = {

    currentFilter: "All",


    /* ==========================================
       Render Round History
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
            this.analyzeRounds(
                rounds
            );


        const sorted =
            Utils.sortByDateDescending(
                analyzed
            );


        container.innerHTML =
            this.buildTable(
                sorted
            );

    },


    /* ==========================================
       Analyze Rounds
    ========================================== */

    analyzeRounds(rounds) {

        /*
         * Get the official counting-round
         * determination directly from WHS.
         */

        const whsRounds =
            WHS.identifyCountingRounds(
                rounds
            );


        /*
         * Match each original round to its WHS
         * result using the original object reference.
         *
         * This avoids using the date as an identifier.
         */

        return rounds.map(round => {

            const whsRound =
                whsRounds.find(
                    item =>
                        item._sourceRound === round
                );


            const differential =
                WHS.calculateDifferential(
                    round
                );


            return {

                ...round,

                differential:
                    differential,


                counting:
                    whsRound
                        ? whsRound.counting === true
                        : false,


                impact:
                    this.getImpact(
                        round,
                        rounds
                    )

            };

        });

    },


    /* ==========================================
       Determine Counting Round
    ========================================== */

    isCountingRound(
        round,
        rounds
    ) {

        /*
         * This method is retained for compatibility
         * with other modules, but now delegates
         * completely to WHS.
         */

        if (
            !round ||
            !rounds
        ) {

            return false;

        }


        const whsRounds =
            WHS.identifyCountingRounds(
                rounds
            );


        const result =
            whsRounds.find(
                item =>
                    item._sourceRound === round
            );


        return result
            ? result.counting === true
            : false;

    },


    /* ==========================================
       Round Impact
    ========================================== */

    getImpact(
        round,
        rounds
    ) {

        const playerRounds =

            rounds.filter(
                r =>
                    r.player === round.player
            );


        /*
         * Remove THIS exact round.
         *
         * Do not remove every round with the
         * same date.
         */

        const beforeRounds =

            playerRounds.filter(
                r =>
                    r !== round
            );


        const before =
            WHS.calculateHandicapIndex(
                beforeRounds
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


        rounds.forEach(round => {

            /*
             * Counting rounds receive:
             *
             * counting mike
             * counting johnny
             *
             * CSS controls the actual colours.
             */

            let rowClass;


            if (round.counting) {

                rowClass =
                    "counting " +
                    String(
                        round.player
                    ).toLowerCase();

            } else {

                rowClass =
                    "non-counting " +
                    String(
                        round.player
                    ).toLowerCase();

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
                        ${Utils.escapeHTML(
                            String(
                                round.impact
                            )
                        )}
                    </td>

                </tr>

            `;

        });


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
