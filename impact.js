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


        if(!player) {

            return null;

        }



        const rounds =

            player.rounds || [];



        if(rounds.length === 0) {

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



        let result = "No Change";

        let reason =

            "Latest round did not replace a counting round. Your Best 8 of 20 remained unchanged.";



        if(
            currentHandicap < previousHandicap
        ) {


            result =

                "Improved by " +

                (
                    previousHandicap -
                    currentHandicap
                )
                .toFixed(1);



            reason =

                removed

                ?

                "Latest round replaced a higher differential."

                :

                "Latest round improved your counting scores.";


        }



        else if(

            currentHandicap >
            previousHandicap

        ) {


            result =

                "Increased by " +

                (
                    currentHandicap -
                    previousHandicap
                )
                .toFixed(1);



            reason =

                removed

                ?

                "A previous strong counting round was replaced by a higher differential."

                :

                "Counting round averages increased.";

        }




        return {


            player:

                player.name,


            previousHandicap:

                previousHandicap,


            currentHandicap:

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
       Find Removed Round
    ================================= */


    findRemovedRound(
        before,
        after
    ) {


        if(
            !before ||
            !after
        ) {

            return null;

        }



        const beforeDates =

            before.map(
                r =>
                r.date
            );



        const afterDates =

            after.map(
                r =>
                r.date
            );



        const removed =

            beforeDates.filter(

                date =>
                !afterDates.includes(date)

            );



        if(
            removed.length === 0
        ) {

            return null;

        }



        return before.find(

            round =>
            round.date === removed[0]

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



            if(!impact) {

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

                ${impact.previousHandicap
                    ?
                    impact.previousHandicap.toFixed(1)
                    :
                    "--"}

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

                Score:
                ${impact.latest.score}

                <br>

                Differential:
                ${impact.latest.differential?.toFixed(1)
                    || "--"}

            </p>



            `;



        });



        html += `

        </div>

        `;



        container.innerHTML = html;


    }



};
