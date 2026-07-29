/* ==========================================
   Golf Tracker v3
   Handicap Analysis Module
   ========================================== */

"use strict";


window.Analysis = {


    /* ================================
       Render Analysis
    ================================= */


    render(players, rounds) {


        const container =

            document.getElementById(
                "analysisContainer"
            );



        if(!container) {

            return;

        }



        if(!players) {


            container.innerHTML = `

                <div class="card">

                    No player data available.

                </div>

            `;


            return;


        }



        let html = "";



        Object.values(players)

            .forEach(player => {


                html +=

                    this.buildPlayerAnalysis(
                        player
                    );


            });



        container.innerHTML = html;


    },





    /* ================================
       Build Player Analysis
    ================================= */


    buildPlayerAnalysis(player) {


        const rounds =
            player.rounds || [];



        const counting =

            rounds.filter(

                round =>
                round.counting

            );



        const nonCounting =

            rounds.filter(

                round =>
                !round.counting

            );



        const bestRounds =

            this.getBestRounds(
                rounds
            );



        const droppedRounds =

            this.getDroppedRounds(
                rounds
            );



        return `


        <div class="card">


            <h3>
                ${player.name}
            </h3>



            <p>

                Current Handicap:

                <strong>
                    ${Utils.formatHandicap(
                        player.handicap
                    )}
                </strong>

            </p>



            <p>

                Target Handicap:

                <strong>
                    ${Utils.formatHandicap(
                        player.targetHandicap
                    )}
                </strong>

            </p>



            <p>

                ${this.handicapStatus(
                    player
                )}

            </p>



            <hr>



            <h4>
                Counting Rounds
            </h4>


            ${this.roundList(
                counting
            )}



            <h4>
                Non-Counting Rounds
            </h4>


            ${this.roundList(
                nonCounting
            )}



            <h4>
                Best Differentials
            </h4>


            ${this.roundList(
                bestRounds
            )}



            <h4>
                Dropped From Calculation
            </h4>


            ${this.roundList(
                droppedRounds
            )}



        </div>


        `;


    },





    /* ================================
       Best Differentials
    ================================= */


    getBestRounds(rounds) {


        return [...rounds]

            .filter(

                round =>
                round.differential !== null

            )

            .sort(

                (a,b)=>

                a.differential -
                b.differential

            )

            .slice(
                0,
                8
            );


    },





    /* ================================
       Dropped Rounds
    ================================= */


    getDroppedRounds(rounds) {


        const best =

            this.getBestRounds(
                rounds
            );



        return rounds.filter(

            round =>
            !best.includes(
                round
            )

        );


    },





    /* ================================
       Round List Builder
    ================================= */


    roundList(rounds) {


        if(
            !rounds ||
            rounds.length === 0
        ) {


            return `

                <p>
                    None
                </p>

            `;


        }



        let html = "<ul>";



        rounds.forEach(round => {



            html += `


            <li>

                ${Utils.formatDate(
                    round.date
                )}

                -

                Score:

                ${round.score}

                -

                Differential:

                ${Utils.formatDifferential(
                    round.differential
                )}


            </li>


            `;


        });



        html += "</ul>";



        return html;


    },





    /* ================================
       Handicap Status
    ================================= */


    handicapStatus(player) {


        if(
            player.handicap === null
        ) {


            return (

                "Not enough rounds " +
                "to calculate handicap."

            );


        }



        if(
            player.targetHandicap === null
        ) {


            return (

                "No target handicap set."

            );


        }



        const difference =

            player.handicap -
            player.targetHandicap;



        if(difference <= 0) {


            return (

                "Target handicap achieved."

            );


        }



        return (

            "Needs " +

            Utils.formatHandicap(
                difference
            )

            +

            " strokes improvement."

        );


    },





    /* ================================
       Change Explanation
    ================================= */


    explainRoundImpact(
        oldRounds,
        newRounds
    ) {


        const oldHandicap =

            WHS.calculateHandicapIndex(
                oldRounds
            );



        const newHandicap =

            WHS.calculateHandicapIndex(
                newRounds
            );



        return Handicap.explainChange(

            oldHandicap,

            newHandicap

        );


    }


};