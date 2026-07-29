/* ==========================================
   Golf Tracker v3
   Google Sheet CSV Loader
   ========================================== */

"use strict";


window.CSV = {


    /* ================================
       Load CSV Data
    ================================= */


    async loadCSV() {


        let url =
            GolfConfig.CSV_URL;



        if(
            (!url || url.trim() === "") &&
            typeof StorageManager !== "undefined"
        ){

            url =
                StorageManager.getCSVURL();

        }



        if(!url || url.trim() === "") {


            throw new Error(
                "No Google Sheet CSV URL configured."
            );


        }



        const response =
            await fetch(url);



        if(!response.ok) {


            throw new Error(
                "Unable to load CSV file."
            );


        }



        return await response.text();



    },





    /* ================================
       CSV Parser
    ================================= */


    parseCSV(text) {


        const rows = [];

        let row = [];

        let value = "";

        let insideQuotes = false;



        for(let i = 0; i < text.length; i++){


            const char =
                text[i];


            const next =
                text[i + 1];



            if(char === '"' && insideQuotes && next === '"'){


                value += '"';

                i++;

                continue;


            }



            if(char === '"'){


                insideQuotes =
                    !insideQuotes;


                continue;


            }



            if(char === "," && !insideQuotes){


                row.push(value.trim());

                value = "";

                continue;


            }



            if(
                (char === "\n" || char === "\r") &&
                !insideQuotes
            ){


                if(value.length > 0 || row.length > 0){


                    row.push(
                        value.trim()
                    );


                    rows.push(row);


                }


                row = [];

                value = "";


                continue;


            }



            value += char;


        }



        if(value.length > 0 || row.length > 0){


            row.push(
                value.trim()
            );


            rows.push(row);


        }



        return rows;


    },






    /* ================================
       Convert CSV To Objects
    ================================= */


    parseRounds(text){


        const rows =
            this.parseCSV(text);



        if(rows.length < 2){


            return [];


        }



        const headers =
            rows[0].map(
                header =>
                    header
                    .trim()
                    .toLowerCase()
            );



        const rounds = [];



        for(let i = 1; i < rows.length; i++){



            const row =
                rows[i];



            if(row.length === 0){

                continue;

            }



            const round = {};



            headers.forEach(
                (header,index)=>{


                    round[header] =
                        row[index] ?? "";


                }
            );




            const cleaned = {


                player:
                    this.cleanPlayer(
                        round.player
                    ),


                score:
                    Number(
                        round.score
                    ),


                date:
                    round.date,


                course:
                    round.course || "",


                slope:
                    Number(
                        round.slope
                    ),


                rating:
                    Number(
                        round.rating
                    ),


                tee:
                    round.tee || ""



            };



            if(
                cleaned.player &&
                !isNaN(cleaned.score)
            ){

                rounds.push(cleaned);

            }



        }



        return rounds;



    },





    /* ================================
       Player Cleanup
    ================================= */


    cleanPlayer(player){


        if(!player){

            return "";

        }



        const name =
            player
            .trim()
            .toLowerCase();



        if(name === "mike"){

            return "Mike";

        }



        if(name === "johnny"){

            return "Johnny";

        }



        return (
            player
            .trim()
        );


    }





};