/* ==========================================
   Golf Tracker v3
   Round Impact Analyzer
   Deliverable 34B
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


        const rounds =
            player.rounds || [];



        if(rounds.length === 0){

            return null;

        }



        const latest =
            rounds[
                rounds.length - 1
            ];



        const currentHandicap =
            WHS.calculateHandicapIndex(
                rounds
            );



        const previousRounds =
            rounds.slice(
                0,
                -1
            );



        const previousHandicap =
            WHS.calculateHandicapIndex(
                previousRounds
            );



        const removed =

            this.findRemovedRound(
                previousRounds,
                rounds
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

                "Latest round replaced a higher differential in your Best 8 of 20.";


            }

            else{


                reason =

                "Latest round improved your counting scores.";


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

                "Latest round replaced a lower differential in your Best 8 of 20.";


            }

            else{


                reason =

                "Counting round averages increased.";


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
       Find Removed Counting Round
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
       Counting Round Helper
    ================================= */


    getCountingRounds(rounds){


        if(
            !rounds ||
            rounds.length === 0
        ){

            return [];

        }



        return WHS.identifyCountingRounds(

            [...rounds]

        );


    },





    /* ================================
       Unique Round Identifier
    ================================= */


    roundKey(round){


        return [

            round.player,

            round.date,

            round.score,

            round.differential

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
            ${player.name}
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

                "--"

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

                ${
                    impact.removed.differential

                    ?

                    impact.removed.differential.toFixed(1)

                    :

                    "--"

                }

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



        container.innerHTML =
            html;


    }


};
