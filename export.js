/* ==========================================
   Golf Tracker v3
   Data Export Module
   ========================================== */

"use strict";


window.ExportManager = {



    /* ================================
       Export Round History
    ================================= */


    exportRounds(rounds) {


        if(
            !rounds ||
            rounds.length === 0
        ) {


            UI.toast(
                "No rounds available to export."
            );


            return;


        }



        const headers = [


            "Player",

            "Date",

            "Course",

            "Score",

            "Rating",

            "Slope",

            "Tee",

            "Differential",

            "Counting"


        ];



        const rows = [

            headers

        ];



        rounds.forEach(round => {



            rows.push([


                round.player,


                round.date,


                round.course,


                round.score,


                round.rating,


                round.slope,


                round.tee,


                WHS.calculateDifferential(
                    round
                ),


                round.counting
                ? "Yes"
                : "No"



            ]);



        });



        this.downloadCSV(

            rows,

            "golf_tracker_round_history.csv"

        );


    },





    /* ================================
       Export Handicap Summary
    ================================= */


    exportSummary(players) {


        if(!players) {


            return;


        }



        const rows = [


            [

                "Player",

                "Current Handicap",

                "Target Handicap",

                "Rounds",

                "Average Score",

                "Average Differential"

            ]


        ];



        Object.values(players)

        .forEach(player => {



            rows.push([


                player.name,


                player.handicap,


                player.targetHandicap,


                player.totalRounds,


                player.averageScore,


                player.averageDifferential



            ]);



        });



        this.downloadCSV(

            rows,

            "golf_tracker_handicap_summary.csv"

        );


    },





    /* ================================
       Export Detailed Analysis
    ================================= */


    exportAnalysis(players) {


        if(!players) {


            return;


        }



        const rows = [


            [

                "Player",

                "Date",

                "Score",

                "Differential",

                "Counting Round"

            ]


        ];



        Object.values(players)

        .forEach(player => {



            player.rounds.forEach(
                round => {


                    rows.push([


                        player.name,


                        round.date,


                        round.score,


                        round.differential,


                        round.counting
                        ? "Yes"
                        : "No"



                    ]);



                }
            );



        });



        this.downloadCSV(

            rows,

            "golf_tracker_analysis.csv"

        );


    },





    /* ================================
       CSV Builder
    ================================= */


    downloadCSV(
        rows,
        filename
    ) {


        const csv =

            rows.map(row =>


                row.map(value =>


                    this.escapeCSV(
                        value
                    )


                )
                .join(",")


            )
            .join("\n");



        const blob =

            new Blob(

                [csv],

                {
                    type:
                    "text/csv;charset=utf-8;"
                }

            );



        const url =

            URL.createObjectURL(
                blob
            );



        const link =

            document.createElement(
                "a"
            );



        link.href =
            url;



        link.download =
            filename;



        document.body.appendChild(
            link
        );



        link.click();



        document.body.removeChild(
            link
        );



        URL.revokeObjectURL(
            url
        );



        UI.toast(
            "Export complete."
        );


    },





    /* ================================
       CSV Escaping
    ================================= */


    escapeCSV(value) {


        if(
            value === null ||
            value === undefined
        ) {


            return "";


        }



        const text =
            String(value);



        if(
            text.includes(",") ||
            text.includes('"') ||
            text.includes("\n")
        ) {


            return (

                '"' +

                text.replace(
                    /"/g,
                    '""'
                )

                +

                '"'

            );


        }



        return text;


    }





};