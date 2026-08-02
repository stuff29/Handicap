/* ==========================================
   Golf Tracker v3
   Round Impact Analyzer
   Deliverable 34C
   Raw Round Comparison Engine
   ========================================== */

"use strict";


window.Impact = {


    players:{},

    rounds:[],


    /* ================================
       Initialize
    ================================= */

    initialize(players, rounds){

        this.players = players || {};

        this.rounds = rounds || [];

    },





    /* ================================
       Analyze Player
    ================================= */

    analyzePlayer(player){


        if(!player){

            return null;

        }



        const allRounds =

            this.rounds.filter(

                round =>

                round.player === player.name

            );



        if(allRounds.length === 0){

            return null;

        }



        const latest =

            allRounds[
                allRounds.length - 1
            ];



        const previousRounds =

            allRounds.slice(
                0,
                -1
            );



        const currentHandicap =

            WHS.calculateHandicapIndex(

                allRounds

            );



        const previousHandicap =

            WHS.calculateHandicapIndex(

                previousRounds

            );



        const removed =

            this.findRemovedRound(

                previousRounds,

                allRounds

            );



        let result =
            "No Change";



        let reason =

            "Latest round did not change your Best 8 of 20.";




        if(
            currentHandicap < previousHandicap
        ){


            result =

                "Improved by " +

                (
                    previousHandicap -
                    currentHandicap
                )
                .toFixed(1);



            if(removed){


                reason =

                "Your latest round entered your Best 8 of 20 and replaced a higher differential.";


            }

            else{


                reason =

                "Your latest round improved your counting scores.";


            }


        }




        else if(
            currentHandicap > previousHandicap
        ){


            result =

                "Increased by " +

                (
                    currentHandicap -
                    previousHandicap
                )
                .toFixed(1);



            if(removed){


                reason =

                "Your latest round replaced a stronger counting round.";


            }

            else{


                reason =

                "Your counting average increased.";


            }


        }





        return {


            player:

                player.name,


            previousHandicap,


            currentHandicap,


            change:

                currentHandicap -
                previousHandicap,


            latest,


            removed,


            result,


            reason


        };


    },





    /* ================================
       Find Replaced Counting Round
    ================================= */


    findRemovedRound(before, after){



        const beforeCounting =

            this.getCountingRounds(

                before

            );



        const afterCounting =

            this.getCountingRounds(

                after

            );



        const afterKeys =

            afterCounting.map(

                round =>

                this.roundKey(round)

            );



        return (

            beforeCounting.find(

                round =>

                !afterKeys.includes(

                    this.roundKey(round)

                )

            )

            ||

            null

        );


    },





    /* ================================
       Get WHS Counting Rounds
    ================================= */


    getCountingRounds(rounds){


        const prepared =

            rounds.map(

                round => ({


                    ...round,


                    differential:

                    WHS.calculateDifferential(

                        round

                    )


                })

            );



        return WHS.identifyCountingRounds(

            prepared

        );


    },





    /* ================================
       Unique Round Key
    ================================= */


    roundKey(round){


        return [

            round.player,

            round.date,

            round.score,

            Number(
                round.differential
            ).toFixed(1)


        ].join("|");


    },





    /* ================================
       Render
    ================================= */


    render(players){


        const container =

            document.getElementById(

                "impactResults"

            );



        if(!container){

            console.warn(

                "Impact results container missing."

            );

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



            const impact =

                this.analyzePlayer(

                    player

                );



            if(!impact){

                return;

            }



            html += `


            <hr>


            <h3>
            ${impact.player}
            </h3>



            <p>

            Previous Handicap:

            <strong>

            ${
                impact.previousHandicap !== null

                ?

                impact.previousHandicap.toFixed(1)

                :

                "--"

            }

            </strong>

            </p>



            <p>

            Current Handicap:

            <strong>

            ${impact.currentHandicap.toFixed(1)}

            </strong>

            </p>



            <p>

            Result:

            <strong>

            ${impact.result}

            </strong>

            </p>



            <p>

            Reason:

            <br>

            ${impact.reason}

            </p>



            <p>

            Latest Round:

            <br>

            Date:

            ${impact.latest.date}

            <br>

            Score:

            ${impact.latest.score}

            <br>

            Differential:

            ${
                impact.latest.differential

                ?

                impact.latest.differential.toFixed(1)

                :

                WHS.calculateDifferential(
                    impact.latest
                ).toFixed(1)

            }


            </p>



            ${
                impact.removed

                ?

                `

                <p>

                <strong>
                Replaced Round:
                </strong>

                <br><br>

                Date:
                ${impact.removed.date}

                <br>

                Score:
                ${impact.removed.score}

                <br>

                Differential:
                ${impact.removed.differential.toFixed(1)}

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
