/* ==========================================
   Golf Tracker v3
   Mobile Experience Module
   ========================================== */

"use strict";


window.Mobile = {


    isMobile: false,



    /* ================================
       Initialize
    ================================= */


    initialize() {


        this.detectDevice();


        this.setupResponsiveTables();


        this.setupCollapsibleSections();


        this.setupTouchControls();


        this.applyMobileClass();


    },





    /* ================================
       Device Detection
    ================================= */


    detectDevice() {


        this.isMobile =

            window.innerWidth <= 768;



        return this.isMobile;


    },





    /* ================================
       Add Body Classes
    ================================= */


    applyMobileClass() {


        if(this.isMobile) {


            document.body.classList.add(
                "mobile-device"
            );


        }

        else {


            document.body.classList.remove(
                "mobile-device"
            );


        }


    },





    /* ================================
       Responsive Tables
    ================================= */


    setupResponsiveTables() {


        const tables =

            document.querySelectorAll(
                "table"
            );



        tables.forEach(table => {


            if(
                table.parentElement.classList.contains(
                    "table-wrapper"
                )
            ) {


                return;


            }



            const wrapper =

                document.createElement(
                    "div"
                );



            wrapper.className =
                "table-wrapper";



            table.parentNode.insertBefore(

                wrapper,

                table

            );



            wrapper.appendChild(
                table
            );


        });


    },





    /* ================================
       Collapsible Sections
    ================================= */


    setupCollapsibleSections() {


        const headers =

            document.querySelectorAll(
                "[data-collapse]"
            );



        headers.forEach(header => {


            header.addEventListener(
                "click",
                () => {


                    const targetId =

                        header.dataset.collapse;



                    const target =

                        document.getElementById(
                            targetId
                        );



                    if(!target) {

                        return;

                    }



                    target.classList.toggle(
                        "collapsed"
                    );


                }
            );


        });


    },





    /* ================================
       Touch Improvements
    ================================= */


    setupTouchControls() {


        const buttons =

            document.querySelectorAll(
                "button"
            );



        buttons.forEach(button => {


            button.style.touchAction =
                "manipulation";


        });



    },





    /* ================================
       Window Resize Handling
    ================================= */


    watchResize() {


        window.addEventListener(

            "resize",

            () => {


                const wasMobile =
                    this.isMobile;



                this.detectDevice();



                if(
                    wasMobile !==
                    this.isMobile
                ) {


                    this.applyMobileClass();


                }


            }

        );


    }

};





document.addEventListener(

    "DOMContentLoaded",

    () => {


        Mobile.initialize();


        Mobile.watchResize();


    }

);