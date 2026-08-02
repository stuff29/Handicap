/* ==========================================
   Golf Tracker v3
   Interactive Handicap Trend Charts
   Deliverable 30
   ========================================== */

"use strict";


window.Charts = {


    canvas: null,

    context: null,


    currentPlayer: null,



    initialize() {


        this.canvas =

            document.getElementById(
                "handicapChart"
            );


        if(!this.canvas) {

            console.warn(
                "Handicap chart canvas missing."
            );

            return;

        }


        this.context =

            this.canvas.getContext(
                "2d"
            );


    },





    renderPlayer(playerName) {


        if(
            !window.GolfTracker ||
            !GolfTracker.players[playerName]
        ) {

            return;

        }


        this.currentPlayer =

            GolfTracker.players[playerName];


        this.render(
            this.currentPlayer
        );


    },





    calculateHistory(player) {


        const rounds =

            player.rounds || [];


        const history = [];



        for(
            let i = 0;
            i < rounds.length;
            i++
        ) {


            const current =

                rounds.slice(
                    0,
                    i + 1
                );



            const handicap =

                WHS.calculateHandicapIndex(
                    current
                );



            if(

                handicap !== null &&

                Number.isFinite(
                    handicap
                )

            ) {


                history.push({

                    date:
                        rounds[i].date,


                    value:
                        Number(
                            handicap.toFixed(1)
                        )

                });


            }


        }



        return history;


    },





    getStatistics(player) {


        const history =

            this.calculateHistory(
                player
            );



        if(!history.length) {

            return null;

        }



        const values =

            history.map(
                item =>
                item.value
            );



        return {


            current:

                values[
                    values.length - 1
                ],



            starting:

                values[0],



            low:

                Math.min(
                    ...values
                ),



            improvement:

                Number(

                    (

                        values[0] -
                        values[
                            values.length - 1
                        ]

                    )

                    .toFixed(1)

                )


        };


    },





    render(player) {


        if(

            !this.canvas ||
            !this.context ||
            !player

        ) {

            return;

        }



        const history =

            this.calculateHistory(
                player
            );



        this.clear();



        if(
            history.length < 2
        ) {

            return;

        }



        this.drawChart(
            history,
            player
        );


    },





    clear() {


        this.context.clearRect(

            0,
            0,

            this.canvas.width,
            this.canvas.height

        );


    },





    drawChart(history, player) {


        const ctx =
            this.context;


        const padding = 50;


        const width =

            this.canvas.width -
            padding * 2;


        const height =

            this.canvas.height -
            padding * 2;



        const values =

            history.map(
                item =>
                item.value
            );



        const max =

            Math.max(
                ...values,
                player.targetHandicap || 0
            ) + 1;



        const min =

            Math.min(
                ...values,
                player.targetHandicap || 0
            ) - 1;



        this.drawAxis();



        this.drawTargetLine(

            player,

            min,

            max,

            padding,

            height

        );



        ctx.beginPath();



        history.forEach(

            (item,index)=>{


                const x =

                    padding +

                    (

                        index /
                        (
                            history.length - 1
                        )

                    )

                    *

                    width;



                const y =

                    padding +

                    (

                        (

                            max -
                            item.value

                        )

                        /

                        (

                            max -
                            min

                        )

                    )

                    *

                    height;



                if(index === 0) {


                    ctx.moveTo(
                        x,
                        y
                    );


                }

                else {


                    ctx.lineTo(
                        x,
                        y
                    );


                }


            }

        );



        ctx.stroke();


    },





    drawAxis() {


        const ctx =
            this.context;


        ctx.beginPath();


        ctx.moveTo(
            50,
            50
        );


        ctx.lineTo(
            50,
            this.canvas.height - 50
        );


        ctx.lineTo(
            this.canvas.width - 50,
            this.canvas.height - 50
        );


        ctx.stroke();


    },





    drawTargetLine(
        player,
        min,
        max,
        padding,
        height
    ) {


        if(
            !player ||
            player.targetHandicap === undefined
        ) {

            return;

        }



        const ctx =
            this.context;



        const y =

            padding +

            (

                (

                    max -
                    player.targetHandicap

                )

                /

                (

                    max -
                    min

                )

            )

            *

            height;



        ctx.beginPath();


        ctx.moveTo(
            padding,
            y
        );


        ctx.lineTo(

            this.canvas.width - padding,

            y

        );


        ctx.stroke();


    }


};
