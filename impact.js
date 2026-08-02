/* ==========================================
   Golf Tracker v3
   Round Impact Analyzer
   WHS Best 8 Comparison Version
   ========================================== */

"use strict";


window.Impact = {


    players:{},

    rounds:[],


    initialize(players, rounds){

        this.players = players || {};
        this.rounds = rounds || [];

    },



    analyzePlayer(player){


        if(!player || !player.rounds){

            return null;

        }


        const rounds =
            player.rounds;



        if(rounds.length < 2){

            return null;

        }



        const latest =
            rounds[rounds.length - 1];



        const previous =
            rounds.slice(
                0,
                -1
            );



        const currentHandicap =
            WHS.calculateHandicapIndex(
                rounds
            );



        const previousHandicap =
            WHS.calculateHandicapIndex(
                previous
            );



        const currentCounting =
            this.getCountingDifferentials(
                rounds
            );



        const previousCounting =
            this.getCountingDifferentials(
                previous
            );



        const latestDifferential =
            WHS.calculateDifferential(
                latest
            );



        let impact =
            "No Change";


        let reason =
            "Latest round did not affect your Best 8 of 20.";



        if(
            currentHandicap <
            previousHandicap
        ){


            impact =
                "Improved by " +
                (
                    previousHandicap -
                    currentHandicap
                )
                .toFixed(1);



            const removed =
                this.findDifference(
                    previousCounting,
                    currentCounting
                );



            reason =
                removed

                ?

                `New round replaced a ${removed.toFixed(1)} differential.`

                :

                "Latest round improved your counting scores.";

        }



        else if(
            currentHandicap >
            previousHandicap
        ){


            impact =
                "Increased by " +
                (
                    currentHandicap -
                    previousHandicap
                )
                .toFixed(1);



            reason =
                "A previous counting score was replaced by a higher differential.";

        }



        else{


            if(
                currentCounting.includes(
                    latestDifferential
                )
            ){

                reason =
                "Latest round counted but did not change the Best 8 average.";

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


            latest:{


                ...latest,

                differential:
                    latestDifferential


            },


            counting:
                currentCounting,


            impact,


            reason



        };


    },




    getCountingDifferentials(rounds){


        return rounds

            .map(r=>({

                differential:
                WHS.calculateDifferential(r)

            }))

            .sort(
                (a,b)=>
                a.differential -
                b.differential
            )

            .slice(0,8)

            .map(
                r=>
                Number(
                    r.differential.toFixed(1)
                )
            );


    },




    findDifference(before, after){


        for(
            let value of before
        ){

            if(
                !after.includes(value)
            ){

                return value;

            }

        }


        return null;


    },





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

        .forEach(player=>{


            const data =
                this.analyzePlayer(
                    player
                );



            if(!data){

                return;

            }



            html += `


            <hr>


            <h3>
            ${data.player}
            </h3>


            <p>
            Previous Handicap:
            <strong>
            ${data.previousHandicap.toFixed(1)}
            </strong>
            </p>


            <p>
            Current Handicap:
            <strong>
            ${data.currentHandicap.toFixed(1)}
            </strong>
            </p>


            <p>
            Result:
            <strong>
            ${data.impact}
            </strong>
            </p>


            <p>
            Reason:
            <br>
            ${data.reason}
            </p>


            <p>
            Latest Round:
            <br>
            Score:
            ${data.latest.score}

            <br>

            Differential:
            ${data.latest.differential.toFixed(1)}

            </p>



            `;


        });



        html += `

        </div>

        `;



        container.innerHTML =
            html;


    }


};
