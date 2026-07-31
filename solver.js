/* ==========================================
   Golf Tracker v3
   Handicap Target Solver
   ========================================== */

"use strict";


window.Solver = {


    players: {},

    rounds: [],



    /* ================================
       Initialize Solver
    ================================= */


    initialize(players, rounds) {


        this.players = players || {};

        this.rounds = rounds || [];


        this.attachEvents();


    },





    /* ================================
       Attach UI Events
    ================================= */


    attachEvents() {


        const button =

            document.getElementById(
                "runSolver"
            );



        if(!button) {

            return;

        }



        button.onclick = () => {


            const player =

                document.getElementById(
                    "solverPlayer"
                ).value;



            const target =

                Number(
                    document.getElementById(
                        "targetHandicap"
                    ).value
                );



            this.solve(
                player,
                target
            );


        };


    },





    /* ================================
       Main Solver
    ================================= */


    solve(playerName, target) {


        const player =

            this.players[playerName];



        const container =

            document.getElementById(
                "solverResults"
            );



        if(!container || !player) {

            return;

        }



        if(
            player.handicap === null
        ) {


            container.innerHTML = `

                <div class="card">

                    Not enough rounds available
                    to calculate a projection.

                </div>

            `;


            return;


        }



        const gap =

            player.handicap -
            target;



        if(gap <= 0) {


            container.innerHTML = `

                <div class="card">

                    <h3>
                        Target Achieved
                    </h3>


                    <p>
                        ${player.name}
                        is already at or below
                        the target handicap.
                    </p>

                </div>

            `;


            return;


        }



        const analysis =

            this.calculateRequiredDifferential(
                player,
                target
            );



        container.innerHTML =

            this.buildResult(
                player,
                target,
                analysis
            );


    },





    /* ================================
       Calculate Needed Differential
    ================================= */


    calculateRequiredDifferential(
        player,
        target
    ) {


        const rounds =

            player.rounds || [];



        const differentials =

            rounds

            .map(
                round =>
                round.differential
            )

            .filter(
                value =>
                value !== null
            );



        if(
            differentials.length < 3
        ) {

            return null;

        }



        const current =

            WHS.calculateHandicapIndex(
                rounds
            );



        const improvement =

            current -
            target;



        const requiredAverage =

            Math.max(

                0,

                Utils.round(

                    this.average(
                        differentials
                    )
                    -
                    improvement,

                    1

                )

            );



        const scoreEstimate =

            this.convertDifferentialToScore(
                requiredAverage,
                rounds
            );



        return {


            current,


            requiredDifferential:

                requiredAverage,


            estimatedScore:

                scoreEstimate,


            improvement


        };


    },





    /* ================================
       Differential -> Score Estimate
    ================================= */


    convertDifferentialToScore(
        differential,
        rounds
    ) {


        const latest =

            rounds[
                rounds.length - 1
            ];



        if(!latest) {

            return null;

        }



        return Math.round(

            (

                differential *

                (
                    latest.slope /
                    113
                )

            )

            +

            latest.rating

        );


    },





    /* ================================
       Result Display
    ================================= */


    buildResult(
        player,
        target,
        analysis
    ) {


        if(!analysis) {


            return `

            <div class="card">

                Unable to calculate projection.

            </div>

            `;


        }



        return `


        <div class="card">


            <h3>

                ${player.name}
                Handicap Goal

            </h3>



            <p>

                Current Handicap:

                <strong>

                ${Utils.formatHandicap(
                    analysis.current
                )}

                </strong>

            </p>



            <p>

                Target Handicap:

                <strong>

                ${target.toFixed(1)}

                </strong>

            </p>



            <p>

                Improvement Required:

                <strong>

                ${Utils.formatHandicap(
                    analysis.improvement
                )}

                strokes

                </strong>

            </p>



            <p>

                Required Average Differential:

                <strong>

                ${Utils.formatDifferential(
                    analysis.requiredDifferential
                )}

                </strong>

            </p>



            <hr>



            <p>

                Based on your recent performance:

            </p>



            <p>

                Average score needed over your
                next 5 rounds:

                <br>

                <strong style="font-size:1.5em">

                    ${analysis.estimatedScore}

                </strong>

            </p>



            <p>

                This projection assumes future
                rounds replace weaker counting
                rounds in the Best 8 of 20.

            </p>



        </div>


        `;


    },





    /* ================================
       Average Helper
    ================================= */


    average(values) {


        if(
            !values ||
            values.length === 0
        ) {

            return 0;

        }



        return (

            values.reduce(
                (sum,value)=>
                sum + value,
                0
            )

            /

            values.length

        );


    }





};
