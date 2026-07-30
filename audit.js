/* ==========================================
   Golf Tracker v3
   WHS Audit Panel
   ========================================== */

"use strict";


window.Audit = {


    render(playerName) {


        const player =
            GolfTracker.players[playerName];


        if (!player) {

            console.error(
                "Audit player not found:",
                playerName
            );

            return;

        }



        const container =
            document.getElementById(
                "auditPanel"
            );



        if (!container) {

            console.warn(
                "Audit panel container missing."
            );

            return;

        }



        const rounds =
            player.rounds || [];



        const counting =
            rounds.filter(
                r => r.counting
            );



        const nonCounting =
            rounds.filter(
                r => !r.counting
            );



        container.innerHTML = `

        <div class="audit-card">


            <h2>
                ${playerName} WHS Audit
            </h2>


            <div class="audit-summary">


                <div>
                    <strong>Handicap Index</strong>
                    <br>
                    ${player.handicap?.toFixed(1) ?? "-"}
                </div>


                <div>
                    <strong>Total Rounds</strong>
                    <br>
                    ${rounds.length}
                </div>


                <div>
                    <strong>Counting Rounds</strong>
                    <br>
                    ${counting.length}
                </div>


            </div>



            <p class="audit-explanation">

            Your Handicap Index is calculated using
            your lowest ${WHS.getCountingRoundNumber(rounds.length)}
            score differentials from your scoring record.

            </p>



            <h3>
                Counting Rounds
            </h3>


            ${this.renderTable(counting,true)}



            <h3>
                Non-Counting Rounds
            </h3>


            ${this.renderTable(nonCounting,false)}



        </div>

        `;


    },





    renderTable(rounds,isCounting) {


        if (!rounds.length) {

            return "<p>No rounds available.</p>";

        }



        const sorted =
            [...rounds]
            .sort(
                (a,b)=>
                new Date(b.date)
                -
                new Date(a.date)
            );



        let html = `


        <table class="audit-table">


        <thead>

        <tr>

        <th>Date</th>
        <th>Course</th>
        <th>Score</th>
        <th>Differential</th>
        <th>Status</th>

        </tr>

        </thead>


        <tbody>

        `;



        sorted.forEach(round => {


            html += `


            <tr>


            <td>
            ${round.date}
            </td>


            <td>
            ${round.course}
            </td>


            <td>
            ${round.score}
            </td>


            <td>
            ${
                round.differential !== undefined
                ?
                round.differential.toFixed(1)
                :
                "-"
            }
            </td>


            <td>

            ${
                isCounting
                ?
                "COUNTING"
                :
                "NOT COUNTING"
            }

            </td>


            </tr>


            `;


        });



        html += `

        </tbody>

        </table>

        `;



        return html;


    }


};