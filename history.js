/* ==========================================
   Golf Tracker v3
   Round History Module
   ========================================== */

"use strict";


window.History = {


    currentFilter: "All",



    /* ================================
       Render History Table
    ================================= */


    render(rounds) {


        const container =

            document.getElementById(
                "historyTable"
            );



        if(!container) {

            return;

        }



        if(
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
       Add WHS Data
    ================================= */


    analyzeRounds(rounds) {


        const result =

            [];



        rounds.forEach(round => {



            result.push({


                ...round,


                differential:

                    WHS.calculateDifferential(
                        round
                    )


            });



        });



        return result;


    },





    /* ================================
       Build HTML Table
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

            <th>Rating</th>

            <th>Slope</th>

            <th>Differential</th>

            <th>Status</th>


        </tr>

        </thead>


        <tbody>


        `;



        rounds.forEach(round => {



            const status =

                round.counting
                ? "Counting"
                : "Non-counting";



            html += `


            <tr class="${

                round.counting

                ? "counting"

                : "non-counting"

            }">


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

                    ${round.rating}

                </td>


                <td>

                    ${round.slope}

                </td>


                <td>

                    ${Utils.formatDifferential(
                        round.differential
                    )}

                </td>


                <td>

                    ${status}

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





    /* ================================
       Filters (Future UI Support)
    ================================= */


    filterByPlayer(
        rounds,
        player
    ) {


        if(
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
       Get Non Counting Rounds
    ================================= */


    getNonCountingRounds(rounds) {


        return rounds.filter(

            round =>
            !round.counting

        );


    }



};