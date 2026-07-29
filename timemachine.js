/* ==========================================
   Golf Tracker v3
   Handicap Time Machine Module
   ========================================== */

"use strict";


window.TimeMachine = {


    rounds: [],

    currentIndex: 0,



    /* ================================
       Initialize
    ================================= */


    initialize(rounds) {


        if(!rounds) {

            return;

        }



        this.rounds =

            Utils.sortByDateAscending(
                rounds
            );



        this.currentIndex =

            StorageManager.getTimeIndex();



        if(
            this.currentIndex >=
            this.rounds.length
        ) {

            this.currentIndex =
                this.rounds.length - 1;

        }



        this.attachEvents();


        this.render();


    },





    /* ================================
       Events
    ================================= */


    attachEvents() {


        const previous =

            document.getElementById(
                "previousRound"
            );



        const next =

            document.getElementById(
                "nextRound"
            );



        if(previous) {


            previous.onclick = () => {


                this.previous();


            };


        }



        if(next) {


            next.onclick = () => {


                this.next();


            };


        }


    },





    /* ================================
       Navigation
    ================================= */


    previous() {


        if(
            this.currentIndex > 0
        ) {


            this.currentIndex--;

            this.save();

            this.render();


        }


    },





    next() {


        if(
            this.currentIndex <
            this.rounds.length - 1
        ) {


            this.currentIndex++;

            this.save();

            this.render();


        }


    },





    save() {


        if(
            typeof StorageManager !==
            "undefined"
        ) {


            StorageManager.saveTimeIndex(
                this.currentIndex
            );


        }


    },





    /* ================================
       Historical Calculation
    ================================= */


    calculateHistory(index) {


        const historicalRounds =

            this.rounds.slice(
                0,
                index + 1
            );



        const players = {};



        Utils.getPlayers(
            historicalRounds
        )
        .forEach(player => {


            const playerRounds =

                historicalRounds.filter(

                    round =>
                    round.player === player

                );



            players[player] = {


                handicap:

                    WHS.calculatePlayerHandicap(

                        playerRounds,

                        player

                    ),


                rounds:

                    this.markCountingRounds(
                        playerRounds
                    )


            };


        });



        return players;


    },





    /* ================================
       Counting Round Marker
    ================================= */


    markCountingRounds(rounds) {


        if(
            rounds.length === 0
        ) {

            return [];

        }



        const analyzed =

            rounds.map(
                round => {


                    return {


                        ...round,


                        differential:

                            WHS.calculateDifferential(
                                round
                            )


                    };


                }
            );



        const sorted =

            [...analyzed]

            .sort(
                (a,b)=>

                a.differential -
                b.differential

            );



        const count =

            WHS.getCountingRoundNumber(
                analyzed.length
            );



        const counting =

            sorted.slice(
                0,
                count
            );



        return analyzed.map(
            round => {


                return {


                    ...round,


                    counting:

                        counting.includes(
                            round
                        )


                };


            }
        );


    },





    /* ================================
       Render
    ================================= */


    render() {


        const container =

            document.getElementById(
                "timeMachineResults"
            );



        const label =

            document.getElementById(
                "timeRoundLabel"
            );



        if(
            !container ||
            this.rounds.length === 0
        ) {


            return;

        }



        const round =

            this.rounds[
                this.currentIndex
            ];



        if(label) {


            label.textContent =

                `Round ${
                    this.currentIndex + 1
                } of ${
                    this.rounds.length
                }`;

        }



        const history =

            this.calculateHistory(
                this.currentIndex
            );



        let html = `



        <div class="card">


            <h3>

                After Round

                ${this.currentIndex + 1}

            </h3>



            <p>

                Date:

                ${Utils.formatDate(
                    round.date
                )}

            </p>



            <p>

                Course:

                ${Utils.escapeHTML(
                    round.course
                )}

            </p>



            <p>

                Score:

                ${round.score}

            </p>



        </div>



        `;



        Object.keys(history)

        .forEach(player => {


            const data =
                history[player];



            html += `


            <div class="card">


                <h3>
                    ${player}
                </h3>


                <p>

                    Handicap:

                    <strong>

                    ${Utils.formatHandicap(
                        data.handicap
                    )}

                    </strong>

                </p>


                <p>

                    Counting Rounds:

                    ${
                        data.rounds.filter(
                            r =>
                            r.counting
                        ).length
                    }

                </p>



            </div>


            `;



        });



        container.innerHTML = html;


    }



};