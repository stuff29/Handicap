/* ==========================================
   Golf Tracker v3
   Enhanced Round History Module
   Deliverable 38
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
       
       Counting status comes directly from WHS.
    ========================================== */

    analyzeRounds(rounds) {

        /*
         * Build a map of the exact rounds that
         * WHS says are currently counting.
         *
         * We use the original round object's
         * identifying properties rather than
         * recalculating the eight lowest here.
         */

        const countingMap =
            new Map();


        /*
         * Group rounds by player.
         */

        const players =
            [
                ...new Set(
                    rounds.map(
                        round =>
                            round.player
                    )
                )
            ];


        players.forEach(player => {

            const playerRounds =
                rounds.filter(
                    round =>
                        round.player === player
                );


            const countingRounds =
                WHS.getPlayerCountingRounds(
                    rounds,
                    player
                );


            /*
             * Create a reliable identifier for
             * each counting round.
             *
             * Date + player + score + course
             * prevents accidental matching of
             * unrelated rounds.
             */

            countingRounds.forEach(round => {

                const key =
                    this.getRoundKey(
                        round
                    );


                countingMap.set(
                    key,
                    true
                );

            });

        });


        return rounds.map(
            round => {

                const differential =
                    WHS.calculateDifferential(
                        round
                    );


                const key =
                    this.getRoundKey(
                        round
                    );


                return {

                    ...round,

                    differential:

                        differential,


                    counting:

                        countingMap.has(
                            key
                        ),


                    impact:

                        this.getImpact(
                            round,
                            rounds
                        )

                };

            }
        );

    },


    /* ==========================================
       Round Identifier
    ========================================== */

    getRoundKey(round) {

        return [

            String(
                round.player ?? ""
            ),

            String(
                round.date ?? ""
            ),

            String(
                round.score ?? ""
            ),

            String(
                round.course ?? ""
            )

        ].join("|");

    },


    /* ==========================================
       Round Impact
       
       Shows the handicap before and after
       including this round.
    ========================================== */

    getImpact(round, rounds) {

        const playerRounds =
            rounds.filter(
                r =>
                    r.player ===
                    round.player
            );


        /*
         * Remove the specific round being
         * evaluated.
         *
         * Date + score + course are used so
         * another round on the same date isn't
         * accidentally removed.
         */

        const beforeRounds =
            playerRounds.filter(
                r =>
                    this.getRoundKey(r) !==
                    this.getRoundKey(round)
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


        rounds.forEach(
            round => {

                /*
                 * Counting rounds receive:
                 *
                 * counting mike
                 *
                 * or
                 *
                 * counting johnny
                 *
                 * so CSS can assign the correct
                 * colour to each player's rows.
                 */

                let rowClass;


                if (round.counting) {

                    rowClass =
                        "counting " +
                        String(
                            round.player
                        )
                        .toLowerCase();

                }
                else {

                    rowClass =
                        "non-counting " +
                        String(
                            round.player
                        )
                        .toLowerCase();

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
