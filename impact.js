/* ==========================================
   Golf Tracker v3
   Round Impact Analyzer
   ========================================== */

"use strict";


window.Impact = {


    players: {},

    rounds: [],



    /* ================================
       Initialize
    ================================= */


    initialize(players, rounds) {


        this.players = players || {};

        this.rounds = rounds || [];


    },





    /* ================================
       Analyze Player
    ================================= */


    analyzePlayer(player) {


        if(
            !player ||
            !player.rounds ||
            player.rounds.length < 2
        ) {

            return null;

        }



        const rounds =

            player.rounds;



        const latest =

            rounds[
                rounds.length - 1
            ];



        const previousRounds =

            rounds.slice(
                0,
                rounds.length - 1
            );



        const previousHandicap =

            WHS.calculateHandicapIndex(
                previousRounds
            );



        const currentHandicap =

            WHS.calculateHandicapIndex(
                rounds
            );



        if(
            previousHandicap === null ||
            currentHandicap === null
        ) {

            return null;

        }



        const countingBefore =

            WHS.identifyCountingRounds(
                previousRounds
            );



        const countingAfter =

            WHS.identifyCountingRounds(
                rounds
            );



        const removed =

            this.findRemovedRound(
                countingBefore,
                countingAfter
            );



        return {


            player:

                player.name,


            previousHandicap,


            currentHandicap,


            change:

                currentHandicap -
                previousHandicap,


            latest,


            removed



        };


    },





    /* ================================
       Find Replaced Round
    ================================= */


    findRemovedRound(
        before,
        after
    ) {


        const afterDates =

            after.map(
                r =>
                r.date
            );



        return (

            before.find(

                round =>

                !afterDates.includes(
                    round.date
                )

            )

            ||

            null

        );


    },





    /* ================================
       Render
    ================================= */


    render(players) {


        const container =

            document.getElementById(
                "impactResults"
            );



        if(!container) {

            return;

        }



        let html = `

        <div class="card">

        <h2>
            Latest Round Impact
        </h2>

        `;



        Object.values(players)
        .forEach(player => {


            const result =

                this.analyzePlayer(
                    player
                );



            if(!result) {

                return;

            }



            const direction =

                result.change < 0

                ? "↓ Improved"

                : result.change > 0

                ? "↑ Increased"

                : "No Change";



            html += `


            <hr>


            <h3>
                ${result.player}
            </h3>


            <p>

                Previous Handicap:

                <strong>
                ${Utils.formatHandicap(
                    result.previousHandicap
                )}
                </strong>

            </p>


            <p>

                Current Handicap:

                <strong>
                ${Utils.formatHandicap(
                    result.currentHandicap
                )}
                </strong>

            </p>



            <p>

                Result:

                <strong>
                ${direction}
                </strong>

            </p>



            <p>

                Latest Round:

                <br>

                Score:
                ${result.latest.score}

                <br>

                Differential:
                ${Utils.formatDifferential(
                    result.latest.differential
                )}

            </p>



            ${
                result.removed

                ?

                `

                <p>

                Replaced Counting Round:

                <br>

                Score:
                ${result.removed.score}

                <br>

                Differential:
                ${Utils.formatDifferential(
                    result.removed.differential
                )}

                </p>

                `

                :

                ""

            }


            `;


        });



        html += `

        </div>

        `;



        container.innerHTML = html;


    }


};