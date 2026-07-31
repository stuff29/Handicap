/* ==========================================
   Golf Tracker v3
   Dashboard Renderer
   ========================================== */

"use strict";


window.Dashboard = {


    /* ================================
       Render Dashboard
    ================================= */


    render(players) {


        if(!players) {

            return;

        }



        this.renderPlayer(
            "Mike",
            players.Mike
        );



        this.renderPlayer(
            "Johnny",
            players.Johnny
        );



        this.renderSummary(
            players
        );


        this.renderSolver();



    },





    /* ================================
       Player Cards
    ================================= */


    renderPlayer(
        name,
        player
    ) {


        if(!player) {

            return;

        }



        const handicapElement =

            document.getElementById(
                name.toLowerCase() +
                "Handicap"
            );



        const summaryElement =

            document.getElementById(
                name.toLowerCase() +
                "Summary"
            );



        if(handicapElement) {


            handicapElement.textContent =

                Utils.formatHandicap(
                    player.handicap
                );


        }



        if(summaryElement) {


            summaryElement.innerHTML = `

                <p>
                    <strong>Target:</strong>
                    ${Utils.formatHandicap(
                        player.targetHandicap
                    )}
                </p>


                <p>
                    <strong>Rounds:</strong>
                    ${player.totalRounds}
                </p>


                <p>
                    <strong>Average Score:</strong>
                    ${player.averageScore ?? "--"}
                </p>


                <p>
                    <strong>Average Differential:</strong>
                    ${Utils.formatDifferential(
                        player.averageDifferential
                    )}
                </p>

            `;


        }


    },





    /* ================================
       Solver Integration
    ================================= */


    renderSolver() {


        if(!window.Solver) {


            console.warn(
                "Solver module unavailable."
            );


            return;

        }



        Solver.solve(
            "Mike",
            10
        );


    },





    /* ================================
       Dashboard Statistics
    ================================= */


    renderSummary(players) {


        const container =

            document.getElementById(
                "dashboardStats"
            );



        if(!container) {

            return;

        }



        let html = "";



        Object.values(players)
            .forEach(player => {


                html += `


                <div class="card">


                    <h3>
                        ${player.name}
                    </h3>


                    <p>
                        Lowest Handicap:
                        ${this.lowestDifferential(
                            player
                        )}
                    </p>


                    <p>
                        Counting Rounds:
                        ${this.countingRounds(
                            player
                        )}
                    </p>


                    <p>
                        Last Round:
                        ${this.lastScore(
                            player
                        )}
                    </p>


                </div>


                `;


            });



        container.innerHTML = html;


    },





    /* ================================
       Helper Statistics
    ================================= */


    lowestDifferential(player) {


        if(
            !player.rounds ||
            !player.rounds.length
        ){

            return "--";

        }



        const values =

            player.rounds

            .map(
                round =>
                round.differential
            )

            .filter(
                value =>
                value !== null
            );



        if(!values.length) {

            return "--";

        }



        return Utils.formatDifferential(

            Math.min(
                ...values
            )

        );


    },





    countingRounds(player) {


        if(
            !player.rounds
        ){

            return 0;

        }



        return player.rounds.filter(

            round =>
            round.counting

        ).length;


    },





    lastScore(player) {


        if(
            !player.rounds ||
            !player.rounds.length
        ){

            return "--";

        }



        const last =

            player.rounds[
                player.rounds.length - 1
            ];



        return last.score ?? "--";


    }



};
