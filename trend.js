/* ==========================================
   Golf Tracker v3
   Handicap Trend + Time Machine Module
   ========================================== */

"use strict";


window.Trend = {


    buildHistory(playerName) {


        const player =
            GolfTracker.players[playerName];


        if (!player) {

            console.error(
                "Trend player not found:",
                playerName
            );

            return [];

        }



        const rounds =
            [...player.rounds]
            .sort(
                (a,b)=>
                new Date(a.date)
                -
                new Date(b.date)
            );



        const history = [];



        for (
            let i = 1;
            i <= rounds.length;
            i++
        ) {


            const completedRounds =
                rounds.slice(
                    0,
                    i
                );



            const handicap =
                WHS.calculateHandicapIndex(
                    completedRounds
                );



            history.push({

                date:
                    completedRounds[i-1].date,


                rounds:
                    i,


                handicap:
                    handicap,


                score:
                    completedRounds[i-1].score,


                course:
                    completedRounds[i-1].course


            });


        }



        return history;


    },





    latest(playerName) {


        const history =
            this.buildHistory(
                playerName
            );


        if (!history.length) {

            return null;

        }


        return history[
            history.length - 1
        ];


    },





    lowest(playerName) {


        const history =
            this.buildHistory(
                playerName
            );


        if (!history.length) {

            return null;

        }


        return history.reduce(
            (lowest,current)=>
                current.handicap <
                lowest.handicap
                ?
                current
                :
                lowest
        );


    },





    highest(playerName) {


        const history =
            this.buildHistory(
                playerName
            );


        if (!history.length) {

            return null;

        }


        return history.reduce(
            (highest,current)=>
                current.handicap >
                highest.handicap
                ?
                current
                :
                highest
        );


    },





    render(playerName) {


        const container =
            document.getElementById(
                "trendPanel"
            );



        if (!container) {

            console.warn(
                "Trend panel container missing."
            );

            return;

        }



        const history =
            this.buildHistory(
                playerName
            );



        if (!history.length) {

            container.innerHTML =
                "<p>No trend data available.</p>";

            return;

        }



        const latest =
            this.latest(playerName);



        const lowest =
            this.lowest(playerName);



        container.innerHTML = `


        <div class="trend-card">


        <h2>
        ${playerName} Handicap Trend
        </h2>


        <div class="trend-summary">


        <div>
        Current:
        <strong>
        ${latest.handicap.toFixed(1)}
        </strong>
        </div>


        <div>
        Lowest:
        <strong>
        ${lowest.handicap.toFixed(1)}
        </strong>
        </div>


        </div>



        <table class="trend-table">


        <thead>

        <tr>

        <th>Date</th>
        <th>Rounds</th>
        <th>Score</th>
        <th>Handicap</th>

        </tr>

        </thead>



        <tbody>


        ${
            history.map(point => `

            <tr>

            <td>
            ${point.date}
            </td>


            <td>
            ${point.rounds}
            </td>


            <td>
            ${point.score}
            </td>


            <td>
            ${point.handicap.toFixed(1)}
            </td>


            </tr>

            `).join("")
        }


        </tbody>


        </table>


        </div>


        `;


    }


};