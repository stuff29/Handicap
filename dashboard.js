/* ==========================================
   Golf Tracker v3
   Dashboard Module
   Deliverable 33
========================================== */

"use strict";


window.Dashboard = {


render(players){


    this.renderPlayer(
        players.Mike,
        "mikeHandicap",
        "mikeSummary"
    );


    this.renderPlayer(
        players.Johnny,
        "johnnyHandicap",
        "johnnySummary"
    );


    this.renderStats(
        players
    );


    if(typeof Impact !== "undefined"){

        Impact.render(
            players
        );

    }


},







renderPlayer(
    player,
    handicapID,
    summaryID
){


    if(!player){

        return;

    }



    const handicap =

        WHS.calculateHandicapIndex(
            player.rounds
        );



    const history =

        Charts.getStatistics(
            player
        );



    const lastRound =

        player.rounds[
            player.rounds.length - 1
        ];



    const target =

        GolfConfig.TARGETS[player.name];



    const strokesNeeded =

        handicap !== null && target

        ?

        Math.max(
            0,
            handicap - target
        )

        :

        null;



    let status = "On Track";



    if(strokesNeeded > 0){

        status =
            strokesNeeded.toFixed(1)
            +
            " strokes to goal";

    }

    else if(strokesNeeded === 0){

        status =
            "Goal Reached";

    }





    const handicapElement =

        document.getElementById(
            handicapID
        );



    if(handicapElement){

        handicapElement.innerHTML =

            handicap !== null

            ?

            handicap.toFixed(1)

            :

            "--";

    }






    const summaryElement =

        document.getElementById(
            summaryID
        );



    if(summaryElement){


        summaryElement.innerHTML = `



        <p>
        Target Handicap:
        <strong>
        ${
            target !== undefined
            ?
            target.toFixed(1)
            :
            "--"
        }
        </strong>
        </p>




        <p>
        Status:
        <strong>
        ${status}
        </strong>
        </p>




        <p>
        Season Low:
        <strong>
        ${
            history
            ?
            history.low.toFixed(1)
            :
            "--"
        }
        </strong>
        </p>




        <p>
        Improvement:
        <strong>
        ${
            history
            ?
            history.improvement.toFixed(1)
            :
            "--"
        }
        </strong>
        strokes
        </p>




        <p>
        Last Round:
        <strong>
        ${
            lastRound
            ?
            lastRound.score
            :
            "--"
        }
        </strong>
        </p>




        <p>
        Differential:
        <strong>
        ${
            lastRound
            ?
            WHS.calculateDifferential(
                lastRound
            ).toFixed(1)
            :
            "--"
        }
        </strong>
        </p>



        `;


    }


},







renderStats(players){


    const container =

        document.getElementById(
            "dashboardStats"
        );



    if(!container){

        return;

    }



    container.innerHTML = `



    <h2>
    Handicap Summary
    </h2>



    <p>
    Players tracked:
    <strong>
    ${
        Object.keys(players).length
    }
    </strong>
    </p>



    <p>
    Total rounds:
    <strong>
    ${
        GolfTracker.rounds.length
    }
    </strong>
    </p>



    `;



}



};
