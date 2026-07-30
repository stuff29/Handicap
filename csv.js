/* ==========================================
   Golf Tracker v3
   CSV Data Loader
   ========================================== */

"use strict";


window.CSV = {


    async loadCSV() {


        if(
            !GolfConfig.CSV_URL ||
            GolfConfig.CSV_URL.includes(
                "PASTE"
            )
        ){

            throw new Error(
                "No Google Sheet CSV URL configured."
            );

        }



        const response =
            await fetch(
                GolfConfig.CSV_URL
            );



        if(!response.ok){

            throw new Error(
                "Unable to load CSV file."
            );

        }



        return await response.text();


    },





    parseRounds(csvText){


        if(!csvText){

            return [];

        }



        /*
          Detect delimiter

          Google Sheets may return:
          comma CSV
          or tab separated CSV
        */


        const delimiter =

            csvText.includes("\t")

            ? "\t"

            : ",";




        const lines =

            csvText

            .trim()

            .split(/\r?\n/);



        if(lines.length < 2){

            return [];

        }



        const headers =

            this.parseLine(
                lines[0],
                delimiter
            )

            .map(header =>

                header.trim()

            );



        const rounds = [];



        for(
            let i = 1;
            i < lines.length;
            i++
        ){


            if(
                !lines[i].trim()
            ){

                continue;

            }



            const values =

                this.parseLine(
                    lines[i],
                    delimiter
                );



            const row = {};



            headers.forEach(
                (header,index)=>{


                    row[header] =

                        values[index]
                        ?
                        values[index].trim()
                        :
                        "";



                }

            );



            if(
                row.Player &&
                row.Score
            ){


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





    parseLine(
        line,
        delimiter
    ){


        const result = [];

        let current = "";

        let insideQuotes = false;



        for(
            let i=0;
            i<line.length;
            i++
        ){


            const char =
                line[i];



            if(char === '"'){


                insideQuotes =
                    !insideQuotes;


            }

            else if(

                char === delimiter &&

                !insideQuotes

            ){


                result.push(
                    current
                );


                current = "";


            }

            else {


                current += char;


            }


        }



        result.push(
            current
        );



        return result;


    }


};
