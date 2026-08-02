/* ==========================================
   Golf Tracker v3
   Handicap Target Solver
   5 Round Average Projection
   ========================================== */

"use strict";


window.Solver = {


    players:{},

    rounds:[],



    /* ================================
       Initialize
    ================================= */


    initialize(players, rounds){


        this.players =
            players || {};


        this.rounds =
            rounds || {};


        this.attachEvents();


    },





    /* ================================
       Attach Events
    ================================= */


    attachEvents(){


        const button =
            document.getElementById(
                "runSolver"
            );


        if(!button){

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
       Dashboard Goals
    ================================= */


    renderGoals(){


        const container =
            document.getElementById(
                "solverResults"
            );


        if(!container){

            return;

        }



        container.innerHTML = `

            <div class="card">

                <h2>
                    Handicap Goal Solver
                </h2>


                ${this.buildGoalCard(
                    "Mike",
                    10
                )}


                ${this.buildGoalCard(
                    "Johnny",
                    15
                )}

            </div>

        `;


    },





    /* ================================
       Build Goal Card
    ================================= */


    buildGoalCard(
        playerName,
        target
    ){


        const player =
            this.players[playerName];



        if(!player){

            return "";

        }



        const result =
            this.calculateProjection(
                player,
                target
            );



        if(!result){

            return `

            <hr>

            <h3>
                ${playerName}
            </h3>

            <p>
                Not enough rounds available.
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
            ${result.current.toFixed(1)}
            </strong>
        </p>



        <p>
            Target Handicap:
            <strong>
            ${target.toFixed(1)}
            </strong>
        </p>



        <p>
            Required Average Differential
            (next 5 rounds):
            <br>

            <strong>
            ${result.requiredDifferential.toFixed(1)}
            </strong>

        </p>



        <p>
            Approximate Average Score:
            <br>

            <strong style="font-size:1.5em">

            ${result.averageScore}

            </strong>

        </p>



        <p>
            <small>
            Actual handicap movement depends on
            which existing counting rounds are replaced.
            </small>
        </p>


        `;


    },





    /* ================================
       Single Player Solver
    ================================= */


    renderSingle(
        playerName,
        target
    ){


        const container =
            document.getElementById(
                "solverResults"
            );


        if(!container){

            return;

        }



        container.innerHTML = `

        <div class="card">

        ${this.buildGoalCard(
            playerName,
            target
        )}

        </div>

        `;


    },





    /* ================================
       Projection Calculation
    ================================= */


    calculateProjection(
        player,
        target
    ){


        const rounds =
            player.rounds || [];



        if(rounds.length < 5){

            return null;

        }



        const current =
            WHS.calculateHandicapIndex(
                rounds
            );



        if(
            current === null ||
            current <= target
        ){

            return {

                current,

                requiredDifferential:
                    target,

                averageScore:
                    "--"

            };

        }



        /*
          Estimate required differential.

          WHS handicap is based on best
          8 of 20, so we use the current
          counting differential average and
          project the improvement required.
        */


        const differentials =
            rounds

            .map(
                round =>
                WHS.calculateDifferential(
                    round
                )
            )

            .filter(
                x =>
                Number.isFinite(x)
            );



        differentials.sort(
            (a,b)=>a-b
        );



        const counting =
            differentials.slice(
                0,
                Math.min(
                    8,
                    differentials.length
                )
            );



        const currentAverage =
            this.average(
                counting
            );



        const requiredDifferential =
            Math.max(

                target,

                Number(
                    (
                    currentAverage -
                    (
                        current -
                        target
                    )
                    )

                    .toFixed(1)
                )

            );



        return {


            current,


            requiredDifferential,



            averageScore:

                this.convertDifferentialToScore(
                    requiredDifferential,
                    rounds
                )


        };


    },





    /* ================================
       Differential To Score
    ================================= */


    convertDifferentialToScore(
        differential,
        rounds
    ){


        const latest =
            rounds[
                rounds.length - 1
            ];



        if(!latest){

            return "--";

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


    average(values){


        if(
            !values ||
            values.length === 0
        ){

            return 0;

        }



        return (

            values.reduce(
                (
                    total,
                    value
                ) =>
                total + value,
                0
            )

            /

            values.length

        );


    },





    /* ================================
       Backwards Compatibility
    ================================= */


    solve(
        player,
        target
    ){


        this.renderSingle(
            player,
            target
        );


    }


};
