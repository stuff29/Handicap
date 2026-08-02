/* ==========================================
   Golf Tracker v3
   WHS 5 Round Handicap Goal Solver
   Corrected Projection Engine
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
       UI Events
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
       Render
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

        <strong style="font-size:1.4em">

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
        Projection assumes your next five
        rounds replace existing rounds in
        your WHS record.
        </small>
        </p>


        `;


    },





    /* ================================
       Projection
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

                requiredDifferential:0,

                averageScore:
                "Target reached"

            };

        }



        let best =
            null;



        /*
          Test possible 5-round averages.

          Lower differential = better.
          We find the highest number
          that still reaches target.
        */


        for(
            let diff = 25;
            diff >= 5;
            diff -= .1
        ){


            const simulated =
                this.simulateFiveRounds(
                    rounds,
                    diff
                );



            const handicap =
                WHS.calculateHandicapIndex(
                    simulated
                );



            if(
                handicap <= target
            ){

                best =
                Number(
                    diff.toFixed(1)
                );

                break;

            }


        }



        if(!best){

            best = 5;

        }



        return {


            current,


            requiredDifferential:
            best,



            averageScore:
            this.convertDifferentialToScore(
                best,
                rounds
            )


        };


    },





    /* ================================
       Simulate Future Five Rounds
    ================================= */


    simulateFiveRounds(
        rounds,
        differential
    ){


        let simulated =
            rounds.map(
                r=>({...r})
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
                "Future-" + i,


                differential,


                score:
                this.convertDifferentialToScore(
                    differential,
                    rounds
                )


            });



            /*
              WHS uses the most recent
              20 rounds.
            */


            if(
                simulated.length > 20
            ){

                simulated.shift();

            }


        }



        return simulated;


    },





    /* ================================
       Differential Conversion
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

            latest.rating +

            (
                differential *
                latest.slope /
                113
            )

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
