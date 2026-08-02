/* ==========================================
   Golf Tracker v3
   Dashboard Module
   Deliverable 32
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


    if(
        typeof Impact !== "undefined"
    ){

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


    if(!player)
        return;



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



    document.getElementById(
        handicapID
    ).innerHTML =


        handicap !== null

        ?

        handicap.toFixed(1)

        :

        "--";





    document.getElementById(
        summaryID
    ).innerHTML = `


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
        WHS.calculateDifferential(lastRound)
        :
        "--"
    }
    </strong>
    </p>


    `;


},







renderStats(players){


    const container =

        document.getElementById(
            "dashboardStats"
        );


    if(!container)
        return;



    container.innerHTML = `


    <h2>
    Handicap Summary
    </h2>


    <p>
    Players tracked:
    ${
        Object.keys(players).length
    }
    </p>


    <p>
    Total rounds:
    ${
        GolfTracker.rounds.length
    }
    </p>



    `;



}



};
