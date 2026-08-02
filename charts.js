/* ==========================================
   Golf Tracker v3
   Interactive Handicap Trend Charts
   Deliverable 31
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
        <strong>Current Handicap:</strong>
        ${stats.current.toFixed(1)}
        </p>


        <p>
        <strong>Target Handicap:</strong>
        ${player.targetHandicap?.toFixed(1) ?? "--"}
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



        if(history.length<2){

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


        const ctx=this.context;


        const padding=50;


        const width =
            this.canvas.width -
            padding*2;


        const height =
            this.canvas.height -
            padding*2;



        const values =
            history.map(
                x=>x.value
            );



        const max =
            Math.max(
                ...values,
                player.targetHandicap
            ) + 1;



        const min =
            Math.min(
                ...values,
                player.targetHandicap
            ) - 1;



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
                            history.length-1
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



                if(index===0){

                    ctx.moveTo(
                        x,y
                    );

                }
                else{

                    ctx.lineTo(
                        x,y
                    );

                }


            }
        );


        ctx.stroke();


    },





    drawTargetLine(
        player,
        min,
        max,
        padding,
        height
    ){


        if(
            !player.targetHandicap
        ){

            return;

        }



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



        const ctx=this.context;


        ctx.beginPath();


        ctx.moveTo(
            padding,
            y
        );


        ctx.lineTo(

            this.canvas.width-padding,

            y

        );


        ctx.stroke();


    }


};
