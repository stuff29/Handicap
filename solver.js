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


            this.renderSingle(
                player,
                target
            );


        };


    },





    /* ================================
       Dashboard Solver
    ================================= */

    renderGoals() {


        const container =
            document.getElementById(
                "solverResults"
            );


        if(!container) {

            return;

        }


        let html = `


        <div class="card">


            <h2>
                Handicap Goal Solver
            </h2>


        `;



        html += this.buildGoalCard(
            "Mike",
            10
        );


        html += this.buildGoalCard(
            "Johnny",
            15
        );



        html += `

        </div>

        `;



        container.innerHTML = html;


    },





    buildGoalCard(
        playerName,
        target
    ) {


        const player =
            this.players[playerName];



        if(!player) {

            return "";

        }



        const analysis =
            this.calculateRequiredDifferential(
                player,
                target
            );



        if(!analysis) {


            return `


            <hr>

            <h3>
                ${playerName}
            </h3>


            <p>
                Unable to calculate projection.
            </p>


            `;


        }



        return `


        <hr>


        <h3>
            ${playerName}
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

            Average score needed over
            next 5 rounds:

            <br>

            <strong style="font-size:1.5em">

                ${analysis.estimatedScore}

            </strong>

        </p>



        `;


    },





    /* ================================
       Single Player Solver
    ================================= */

    renderSingle(
        player,
        target
    ) {


        const container =
            document.getElementById(
                "solverResults"
            );


        if(!container) {

            return;

        }


        container.innerHTML =
            this.buildGoalCard(
                player,
                target
            );


    },





    /* ================================
       Backwards Compatible Solve
    ================================= */

    solve(
        playerName,
        target
    ) {


        this.renderSingle(
            playerName,
            target
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



        return {


            current,


            requiredDifferential:
                requiredAverage,


            estimatedScore:

                this.convertDifferentialToScore(
                    requiredAverage,
                    rounds
                ),


            improvement


        };


    },





    /* ================================
       Differential -> Score
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

            differential *

            (
                latest.slope /
                113
            )

            +

            latest.rating

        );


    },





    /* ================================
       Average
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
