```text
/* ==========================================
   Golf Tracker v3
   Enhanced Round History Module
   ========================================== */

"use strict";


window.History = {


    currentFilter: "All",


    /* ================================
       Render
    ================================= */

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


    /* ================================
       Analyze Rounds
    ================================= */

    analyzeRounds(rounds) {

        const whsRounds =
            WHS.identifyCountingRounds(
                rounds
            );


        return rounds.map(
            (round, index) => {

                const whsRound =
                    whsRounds.find(
                        item =>
                            item._sourceIndex === index
                    );


                return {

                    ...round,

                    differential:
                        WHS.calculateDifferential(
                            round
                        ),

                    counting:
                        whsRound
                            ? whsRound.counting
                            : false,

                    impact:
                        this.getImpact(
                            round,
                            rounds
                        )

                };

            }
        );

    },


    /* ================================
       Counting Round
    ================================= */

    isCountingRound(
        round,
        rounds
    ) {

        const whsRounds =
            WHS.identifyCountingRounds(
                rounds
            );


        const index =
            rounds.indexOf(
                round
            );


        const result =
            whsRounds.find(
                item =>
                    item._sourceIndex === index
            );


        return result
            ? result.counting
            : false;

    },


    /* ================================
       Round Impact
    ================================= */

    getImpact(
        round,
        rounds
    ) {

        const playerRounds =
            rounds.filter(
                r =>
                    r.player === round.player
            );


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


    /* ================================
       Build Table
    ================================= */

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

                const player =
                    String(
                        round.player || ""
                    ).toLowerCase();


                const rowClass =
                    round.counting

                        ? "counting " + player

                        : "non-counting " + player;


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


    /* ================================
       Filter By Player
    ================================= */

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


    /* ================================
       Get Counting Rounds
    ================================= */

    getCountingRounds(rounds) {

        return rounds.filter(
            round =>
                round.counting
        );

    },


    /* ================================
       Get Non-Counting Rounds
    ================================= */

    getNonCountingRounds(rounds) {

        return rounds.filter(
            round =>
                !round.counting
        );

    }

};
```
