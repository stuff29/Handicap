/* ==========================================
   Golf Tracker v3
   Handicap Trend Charts
   ========================================== */

"use strict";


window.Charts = {


    canvas: null,

    context: null,


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
                Number.isFinite(handicap)
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



        if(history.length < 2) {

            return;

        }



        this.drawAxis();



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





    drawAxis() {


        const ctx =
            this.context;


        ctx.beginPath();


        ctx.moveTo(
            40,
            40
        );


        ctx.lineTo(
            40,
            this.canvas.height - 40
        );


        ctx.lineTo(
            this.canvas.width - 40,
            this.canvas.height - 40
        );


        ctx.stroke();


    },





    drawChart(history, player) {


        const ctx =
            this.context;


        const padding = 40;


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
                ...values
            ) + 1;



        const min =

            Math.min(
                ...values
            ) - 1;



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



        this.drawTargetLine(
            player
        );


    },





    drawTargetLine(player) {


        if(
            !player ||
            player.targetHandicap === undefined
        ) {

            return;

        }


        const ctx =
            this.context;


        const target =
            player.targetHandicap;



        const y =

            40 +

            (

                1 -

                (

                    (
                        target -
                        0
                    )

                )

            );



        ctx.beginPath();



        ctx.moveTo(
            40,
            y
        );


        ctx.lineTo(

            this.canvas.width - 40,

            y

        );


        ctx.stroke();


    }



};
