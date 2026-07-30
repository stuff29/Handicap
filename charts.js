/* ==========================================
   Golf Tracker v3
   Trend Charts Module
   ========================================== */

"use strict";


window.Charts = {


    canvas: null,

    context: null,



    /* ================================
       Render Charts
    ================================= */


    render(players) {


        this.canvas =
            document.getElementById(
                "trendChart"
            );



        if(!this.canvas) {

            return;

        }



        this.context =
            this.canvas.getContext(
                "2d"
            );



        this.clear();



        if(!players) {

            return;

        }



        this.drawTitle(
            "Handicap Trend"
        );



        const datasets =
            this.buildDatasets(
                players
            );



        this.drawChart(
            datasets
        );


    },





    /* ================================
       Build Data Sets
    ================================= */


    buildDatasets(players) {


        const datasets = [];



        Object.values(players)

        .forEach(player => {


            const history =

                this.calculateHistory(
                    player
                );



            datasets.push({

                name:
                    player.name,


                values:
                    history


            });


        });



        return datasets;


    },





    /* ================================
       Calculate Handicap History
    ================================= */


    calculateHistory(player) {


        const rounds =
            player.rounds || [];



        const history = [];



        for(
            let i = 0;
            i < rounds.length;
            i++
        ){


            const current =

                rounds.slice(
                    0,
                    i + 1
                );



            history.push({

                date:
                    current[i].date,


                value:

                    WHS.calculateHandicapIndex(
                        current
                    )


            });


        }



return history.filter(

    item =>

    item.value !== null &&
    !Number.isNaN(item.value)

);


    },





    /* ================================
       Canvas Helpers
    ================================= */


    clear() {


        this.context.clearRect(

            0,

            0,

            this.canvas.width,

            this.canvas.height

        );


    },





    drawTitle(title) {


        this.context.font =
            "24px Arial";



        this.context.fillText(

            title,

            40,

            40

        );


    },





    /* ================================
       Draw Chart
    ================================= */


    drawChart(datasets) {


        if(
            datasets.length === 0
        ){

            return;

        }



        const ctx =
            this.context;



        const width =
            this.canvas.width;



        const height =
            this.canvas.height;



        const padding = 70;



        let values = [];



        datasets.forEach(dataset => {


            dataset.values.forEach(point => {


                values.push(
                    point.value
                );


            });


        });



        if(values.length === 0) {

            return;

        }



        const max =
            Math.max(
                ...values
            );



        const min =
            Math.min(
                ...values
            );



        const range =
            max - min || 1;



        ctx.beginPath();



        datasets.forEach(
            dataset => {


                dataset.values.forEach(
                    (point,index)=>{


                        const x =

                            padding +

                            (

                                index /

                                Math.max(

                                    dataset.values.length - 1,

                                    1

                                )

                            )

                            *

                            (

                                width -
                                padding * 2

                            );



                        const y =

                            height -
                            padding -

                            (

                                (

                                    point.value -
                                    min

                                )

                                /

                                range

                            )

                            *

                            (

                                height -
                                padding * 2

                            );



                        if(index === 0){

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



                        ctx.fillText(

                            point.value.toFixed(1),

                            x,

                            y - 10

                        );


                    }


                );


            }


        );



        ctx.stroke();



        this.drawAxis(
            min,
            max
        );


    },





    /* ================================
       Axis
    ================================= */


    drawAxis(min,max) {


        const ctx =
            this.context;



        const height =
            this.canvas.height;



        ctx.font =
            "14px Arial";



        ctx.fillText(

            max.toFixed(1),

            20,

            80

        );



        ctx.fillText(

            min.toFixed(1),

            20,

            height - 70

        );


    }



};
