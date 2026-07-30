/* ==========================================
   Golf Tracker v3
   CSV Data Loader
   ========================================== */

"use strict";


window.CSV = {


    async loadCSV() {


        if (
            !GolfConfig.CSV_URL ||
            GolfConfig.CSV_URL.includes("PASTE")
        ) {

            throw new Error(
                "No Google Sheet CSV URL configured."
            );

        }


        const response = await fetch(
            GolfConfig.CSV_URL
        );


        if (!response.ok) {

            throw new Error(
                "Unable to load CSV file."
            );

        }


        return await response.text();

    },





    parseRounds(csvText) {


        if (!csvText) {

            return [];

        }



        /*
          Normalize line endings
        */

        csvText = csvText
            .replace(/\r\n/g, "\n")
            .replace(/\r/g, "\n");



        const rows =
            this.parseCSV(csvText);



        if (rows.length < 2) {

            return [];

        }



        let headers =
            rows[0].map(
                h =>
                h
                .replace(/^\uFEFF/, "")
                .trim()
            );



        console.log(
            "Headers detected:",
            headers
        );



        const rounds = [];



        for (
            let i = 1;
            i < rows.length;
            i++
        ) {


            const row = {};



            headers.forEach(
                (header,index)=>{


                    row[header] =
                        rows[i][index]
                        ?
                        rows[i][index].trim()
                        :
                        "";


                }
            );



            if (
                row.Player &&
                row.Score
            ) {


                rounds.push({

                    player:
                        row.Player,


                    score:
                        Number(row.Score),


                    date:
                        row.Date,


                    course:
                        row.Course,


                    slope:
                        Number(row.Slope),


                    rating:
                        Number(row.Rating),


                    tee:
                        row.Tee


                });


            }


        }



        console.log(
            "CSV rounds loaded:",
            rounds.length
        );



        return rounds;


    },





    /*
      Full CSV parser
    */

    parseCSV(text) {


        const rows = [];

        let row = [];

        let value = "";

        let quotes = false;



        for (
            let i = 0;
            i < text.length;
            i++
        ) {


            const char =
                text[i];



            const next =
                text[i + 1];



            if (
                char === '"'
            ) {


                if (
                    quotes &&
                    next === '"'
                ) {


                    value += '"';

                    i++;

                }

                else {


                    quotes =
                        !quotes;


                }


            }

            else if (
                char === "," &&
                !quotes
            ) {


                row.push(
                    value
                );


                value = "";


            }

            else if (
                char === "\n" &&
                !quotes
            ) {


                row.push(
                    value
                );


                rows.push(
                    row
                );


                row = [];

                value = "";


            }

            else {


                value += char;


            }


        }



        if (
            value.length ||
            row.length
        ) {


            row.push(
                value
            );


            rows.push(
                row
            );


        }



        return rows;


    }


};
