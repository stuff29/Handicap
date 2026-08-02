/* ==========================================
   Golf Tracker v3
   Handicap Management Module
   ========================================== */

"use strict";


window.Handicap = {


    initializePlayers(rounds) {


        const players = {};



        rounds.forEach(round => {


            if(!players[round.player]) {


                players[round.player] = {


                    name:
                        round.player,


                    rounds: [],


                    handicap:
                        null,


                    totalRounds:
                        0,


                    averageScore:
                        0,


                    averageDifferential:
                        0,


                    targetHandicap:

                        round.player === "Mike"

                            ? 10

                            : round.player === "Johnny"

                                ? 15

                                : null



                };


            }



            players[round.player]
                .rounds
                .push(round);


        });



        Object.keys(players)
        .forEach(name => {


            this.calculatePlayer(
                players[name]
            );


        });



        return players;


    },







    calculatePlayer(player) {


        const rounds =
            player.rounds;



        player.totalRounds =
            rounds.length;



        if(rounds.length === 0) {

            return;

        }



        const scores =
            rounds.map(
                r =>
                Number(r.score)
            );



        player.averageScore =

            scores.reduce(
                (a,b)=>a+b,
                0
            )
            /
            scores.length;



        rounds.forEach(round => {


            round.differential =

                WHS.calculateDifferential(
                    round
                );


        });



        player.rounds =

            WHS.identifyCountingRounds(
                player.rounds
            );



        const validDifferentials =

            rounds.filter(

                r =>
                r.differential !== null

            );



        player.averageDifferential =

            validDifferentials.length

                ?


                validDifferentials.reduce(

                    (total,r)=>

                        total + r.differential,

                    0

                )

                /

                validDifferentials.length


                :

                0;





        player.handicap =

            WHS.calculateHandicapIndex(
                rounds
            );


    }

};
