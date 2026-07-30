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
                        0



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



        player.averageDifferential =

            rounds

            .filter(
                r =>
                r.differential !== null
            )

            .reduce(

                (total,r)=>

                    total + r.differential,

                0

            )

            /

            rounds.length;



        player.handicap =

            WHS.calculateHandicapIndex(
                rounds
            );


    }

};
