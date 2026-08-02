/* ==========================================
   Golf Tracker v3
   WHS 5 Round Handicap Projection Solver
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
            rounds || [];


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
       Render Player Result
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
       Build Result Card
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



        const projection =
            this.calculateProjection(
                player,
                target
            );



        if(!projection){

            return `

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
        ${projection.current.toFixed(1)}
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
        Over Next 5 Rounds:

        <br>

        <strong style="font-size:1.4em">

        ${projection.requiredDifferential.toFixed(1)}

        </strong>

        </p>



        <p>
        Estimated Average Score:

        <br>

        <strong style="font-size:1.5em">

        ${projection.averageScore}

        </strong>

        </p>



        <p>

        <small>

        Projection assumes your next 5 rounds
        replace some existing counting scores.
        Actual WHS movement depends on which
        rounds drop out of your Best 8.

        </small>

        </p>


        `;


    },





    /* ================================
       WHS Projection Engine
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
            current <= target
        ){


            return {

                current,

                requiredDifferential:
                    0,

                averageScore:
                    "Already achieved"

            };


        }



        /*
          Binary search for average
          differential needed over 5 rounds
        */


        let low = 0;

        let high = 40;

        let answer = high;



        for(
            let i=0;
            i<40;
            i++
        ){


            const mid =
                (
                    low +
                    high
                ) / 2;



            const simulated =
                this.simulateFutureRounds(
                    rounds,
                    mid
                );



            const handicap =
                WHS.calculateHandicapIndex(
                    simulated
                );



            if(
                handicap <= target
            ){

                answer = mid;

                high = mid;

            }

            else{

                low = mid;

            }


        }



        return {


            current,


            requiredDifferential:
                answer,



            averageScore:

                this.convertDifferentialToScore(
                    answer,
                    rounds
                )


        };


    },





    /* ================================
       Simulate Five Future Rounds
    ================================= */


    simulateFutureRounds(
        rounds,
        differential
    ){


        const simulated =
            rounds.map(
                r => ({...r})
            );



        const template =
            rounds[
                rounds.length-1
            ];



        for(
            let i=0;
            i<5;
            i++
        ){


            simulated.push({


                ...template,


                date:
                "Future",


                score:
                this.convertDifferentialToScore(
                    differential,
                    rounds
                ),


                differential


            });


        }



        return simulated;


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
                rounds.length-1
            ];



        if(!latest){

            return "--";

        }



        return Math.round(

            (
                differential *
                (
                    113 /
                    latest.slope
                )
            )

            +

            latest.rating

        );


    },





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
