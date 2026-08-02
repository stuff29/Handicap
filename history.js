/* ==========================================
   Golf Tracker v3
   Enhanced Round History Module
   Deliverable 33
   ========================================== */

"use strict";


window.History = {


    currentFilter: "All",



    render(rounds){


        const container =
            document.getElementById(
                "historyTable"
            );


        if(!container){

            return;

        }


        if(
            !rounds ||
            rounds.length === 0
        ){

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





    analyzeRounds(rounds){


        return rounds.map(
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
                            rounds
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





    isCountingRound(
        round,
        rounds
    ){


        const playerRounds =

            rounds.filter(

                r =>
                r.player === round.player

            );



        const differentials =

            playerRounds

            .map(

                r => ({

                    round:r,

                    differential:
                    WHS.calculateDifferential(r)

                })

            )

            .filter(

                x =>
                x.differential !== null

            )

            .sort(

                (a,b)=>

                a.differential -
                b.differential

            );



        const best =

            differentials.slice(
                0,
                Math.min(
                    8,
                    differentials.length
                )
            );



        return best.some(

            x =>
            x.round.date === round.date

        );


    },





    getImpact(
        round,
        rounds
    ){


        const playerRounds =

            rounds.filter(

                r =>
                r.player === round.player

            );



        const before =

            WHS.calculateHandicapIndex(

                playerRounds.filter(

                    r =>
                    r.date !== round.date

                )

            );



        const after =

            WHS.calculateHandicapIndex(

                playerRounds

            );



        if(
            before === null ||
            after === null
        ){

            return "Not enough rounds";

        }



        if(after < before){

            return (

                "Improved " +

                before.toFixed(1) +

                " → " +

                after.toFixed(1)

            );

        }



        if(after > before){

            return (

                "Increased " +

                before.toFixed(1) +

                " → " +

                after.toFixed(1)

            );

        }



        return "No change";


    },





    buildTable(rounds){



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


                html += `


<tr class="${
    
    round.counting

    ? "counting " + round.player.toLowerCase()

    : "non-counting " + round.player.toLowerCase()

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





    filterByPlayer(
        rounds,
        player
    ){


        if(
            !player ||
            player === "All"
        ){

            return rounds;

        }



        return rounds.filter(

            round =>
            round.player === player

        );


    },





    getCountingRounds(rounds){


        return rounds.filter(

            round =>
            round.counting

        );


    },





    getNonCountingRounds(rounds){


        return rounds.filter(

            round =>
            !round.counting

        );


    }


};
