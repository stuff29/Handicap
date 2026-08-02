/* ==========================================
   Golf Tracker v3
   Interactive Handicap Trend Charts
   Deliverable 37
   ========================================== */

"use strict";


window.Charts = {


    canvas:null,

    context:null,

    currentPlayer:null,


    initialize(){


        this.canvas =
            document.getElementById(
                "handicapChart"
            );


        if(!this.canvas){

            console.warn(
                "Handicap chart canvas missing."
            );

            return;

        }


        this.context =
            this.canvas.getContext(
                "2d"
            );


        const selector =
            document.getElementById(
                "chartPlayer"
            );


        if(selector){


            selector.addEventListener(
                "change",
                ()=>{

                    this.renderPlayer(
                        selector.value
                    );

                }
            );


        }



        if(
            typeof GolfTracker !== "undefined" &&
            GolfTracker.players
        ){

            const firstPlayer =
                Object.keys(
                    GolfTracker.players
                )[0];


            if(firstPlayer){

                this.renderPlayer(
                    firstPlayer
                );

            }

        }


    },




    renderPlayer(playerName){


        if(
            !GolfTracker.players[playerName]
        ){

            return;

        }


        const player =
            GolfTracker.players[playerName];


        this.currentPlayer =
            player;


        this.updateStats(
            player
        );


        this.render(
            player
        );


    },




    updateStats(player){


        const container =
            document.getElementById(
                "chartStats"
            );


        if(!container){

            return;

        }


        const stats =
            this.getStatistics(
                player
            );


        if(!stats){

            container.innerHTML =
                "No chart data available.";

            return;

        }



        container.innerHTML = `


        <p>
        <strong>Player:</strong>
        ${player.name}
        </p>


        <p>
        <strong>Current Handicap:</strong>
        ${stats.current.toFixed(1)}
        </p>


        <p>
        <strong>Target Handicap:</strong>
        ${
            player.targetHandicap !== undefined
            ?
            player.targetHandicap.toFixed(1)
            :
            "--"
        }
        </p>


        <p>
        <strong>Season Low:</strong>
        ${stats.low.toFixed(1)}
        </p>


        <p>
        <strong>Season Improvement:</strong>
        ${stats.improvement.toFixed(1)}
        strokes
        </p>


        `;


    },




    getStatistics(player){


        const history =
            this.calculateHistory(
                player
            );


        if(!history.length){

            return null;

        }


        const values =
            history.map(
                x=>x.value
            );


        return {


            current:
                values[
                    values.length-1
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
                            values.length-1
                        ]
                    )
                    .toFixed(1)
                )


        };


    },




    calculateHistory(player){


        const rounds =
            player.rounds || [];


        const history=[];


        for(
            let i=0;
            i<rounds.length;
            i++
        ){


            const current =
                rounds.slice(
                    0,
                    i+1
                );


            const handicap =
                WHS.calculateHandicapIndex(
                    current
                );


            if(
                handicap !== null &&
                Number.isFinite(handicap)
            ){


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


/* ==========================================
   Chart Rendering Engine
========================================== */


    render(player){


        if(
            !this.canvas ||
            !this.context ||
            !player
        ){

            return;

        }



        const history =
            this.calculateHistory(
                player
            );


        this.clear();



        if(history.length < 2){

            return;

        }



        this.drawChart(
            history,
            player
        );


    },





    clear(){


        this.context.clearRect(

            0,
            0,

            this.canvas.width,
            this.canvas.height

        );


    },





    drawChart(history,player){


        const ctx =
            this.context;



        const padding = {

            top:70,

            right:40,

            bottom:70,

            left:70

        };



        const width =
            this.canvas.width -
            padding.left -
            padding.right;



        const height =
            this.canvas.height -
            padding.top -
            padding.bottom;



        const values =
            history.map(
                x=>x.value
            );



        const max =
            Math.ceil(
                Math.max(
                    ...values,
                    player.targetHandicap
                )
            ) + 1;



        const min =
            Math.floor(
                Math.min(
                    ...values,
                    player.targetHandicap
                )
            ) - 1;



        this.drawTitle(
            player
        );



        this.drawGrid(

            min,

            max,

            padding,

            height

        );



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


                const point =
                    this.getPoint(

                        item.value,

                        index,

                        history.length,

                        min,

                        max,

                        padding,

                        width,

                        height

                    );



                if(index===0){

                    ctx.moveTo(
                        point.x,
                        point.y
                    );

                }
                else{

                    ctx.lineTo(
                        point.x,
                        point.y
                    );

                }


            }

        );



        ctx.stroke();



        this.drawPoints(

            history,

            min,

            max,

            padding,

            width,

            height

        );



        this.drawAxesLabels(

            history,

            min,

            max,

            padding,

            width,

            height

        );


    },





    getPoint(

        value,

        index,

        length,

        min,

        max,

        padding,

        width,

        height

    ){


        return {


            x:

                padding.left +

                (
                    index /
                    (
                        length-1
                    )
                )

                *

                width,



            y:

                padding.top +

                (

                    (
                        max -
                        value
                    )

                    /

                    (
                        max -
                        min
                    )

                )

                *

                height


        };


    },





    drawTitle(player){


        const ctx =
            this.context;


        ctx.font =
            "22px Arial";


        ctx.fillText(

            player.name +
            " Handicap Trend",

            70,

            35

        );


    },





    drawGrid(

        min,

        max,

        padding,

        height

    ){


        const ctx =
            this.context;



        ctx.font =
            "12px Arial";



        for(
            let value=min;
            value<=max;
            value++
        ){


            const y =

                padding.top +

                (

                    (
                        max-value
                    )

                    /

                    (
                        max-min
                    )

                )

                *

                height;



            ctx.beginPath();


            ctx.moveTo(

                padding.left,

                y

            );


            ctx.lineTo(

                this.canvas.width-padding.right,

                y

            );


            ctx.stroke();



            ctx.fillText(

                value.toFixed(0),

                25,

                y+4

            );


        }


    },





    drawTargetLine(

        player,

        min,

        max,

        padding,

        height

    ){


        if(
            player.targetHandicap === undefined
        ){

            return;

        }



        const y =

            padding.top +

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



        const ctx =
            this.context;



        ctx.beginPath();



        ctx.moveTo(

            padding.left,

            y

        );



        ctx.lineTo(

            this.canvas.width-padding.right,

            y

        );



        ctx.stroke();



        ctx.fillText(

            "Target " +
            player.targetHandicap.toFixed(1),

            this.canvas.width-130,

            y-5

        );


    },





    drawPoints(

        history,

        min,

        max,

        padding,

        width,

        height

    ){


        const ctx =
            this.context;



        history.forEach(

            (item,index)=>{


                const point =
                    this.getPoint(

                        item.value,

                        index,

                        history.length,

                        min,

                        max,

                        padding,

                        width,

                        height

                    );



                ctx.beginPath();



                ctx.arc(

                    point.x,

                    point.y,

                    4,

                    0,

                    Math.PI*2

                );



                ctx.fill();



            }

        );


    },





    drawAxesLabels(

        history,

        min,

        max,

        padding,

        width,

        height

    ){


        const ctx =
            this.context;



        ctx.font =
            "11px Arial";



        const first =
            history[0].date;



        const last =
            history[
                history.length-1
            ].date;



        ctx.fillText(

            first,

            padding.left,

            this.canvas.height-25

        );



        ctx.fillText(

            last,

            this.canvas.width-100,

            this.canvas.height-25

        );


    }



};
