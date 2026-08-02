/* ==========================================
   Golf Tracker v3
   UI Management Module
   ========================================== */

"use strict";


window.UI = {


    /* ================================
       Initialization
    ================================= */


    initialize() {


        this.setupNavigation();

        this.setupMobileMenu();

        this.hideLoading();


    },





    /* ================================
       Loading State
    ================================= */


    showLoading(message = "Loading...") {


        const element =

            document.getElementById(
                "loadingMessage"
            );



        if(element) {


            element.textContent =
                message;


            element.style.display =
                "block";


        }


    },





    hideLoading() {


        const element =

            document.getElementById(
                "loadingMessage"
            );



        if(element) {


            element.style.display =
                "none";


        }


    },





    /* ================================
       Error Handling
    ================================= */


    showError(message) {


        const container =

            document.getElementById(
                "errorMessage"
            );



        if(!container) {


            console.error(
                message
            );


            return;


        }



        container.innerHTML = `


            <div class="card error">


                <strong>
                    Error
                </strong>


                <p>
                    ${Utils.escapeHTML(
                        message
                    )}
                </p>


            </div>


        `;



        container.style.display =
            "block";


    },





    clearError() {


        const container =

            document.getElementById(
                "errorMessage"
            );



        if(container) {


            container.innerHTML =
                "";


            container.style.display =
                "none";


        }


    },





    /* ================================
       Empty States
    ================================= */


    showEmpty(
        elementId,
        message
    ) {


        const element =

            document.getElementById(
                elementId
            );



        if(!element) {

            return;

        }



        element.innerHTML = `


            <div class="card">


                ${Utils.escapeHTML(
                    message
                )}


            </div>


        `;


    },





    /* ================================
       Navigation
    ================================= */


    setupNavigation() {


        const buttons =

            document.querySelectorAll(
                "[data-section]"
            );



        buttons.forEach(button => {


            button.addEventListener(
                "click",
                () => {


                    this.showSection(

                        button.dataset.section

                    );


                }
            );


        });


    },





    showSection(sectionId){


    const sections =
        document.querySelectorAll(
            ".app-section"
        );


    sections.forEach(section=>{


        if(section.id === sectionId){


            section.style.display = "block";

            section.classList.add(
                "active"
            );


        }

        else{


            section.style.display = "none";

            section.classList.remove(
                "active"
            );


        }


    });



    const buttons =
        document.querySelectorAll(
            ".nav-btn"
        );


    buttons.forEach(button=>{


        if(
            button.dataset.section === sectionId
        ){

            button.classList.add(
                "active"
            );

        }

        else{

            button.classList.remove(
                "active"
            );

        }


    });



    if(
        typeof StorageManager !== "undefined"
    ){

        StorageManager.saveCurrentPage(
            sectionId
        );

    }


}





    /* ================================
       Mobile Menu
    ================================= */


    setupMobileMenu() {


        const button =

            document.getElementById(
                "mobileMenuButton"
            );



        const menu =

            document.getElementById(
                "navigation"
            );



        if(
            !button ||
            !menu
        ) {


            return;


        }



        button.onclick = () => {


            menu.classList.toggle(
                "open"
            );


        };


    },





    /* ================================
       Toast Messages
    ================================= */


    toast(message) {


        let toast =

            document.getElementById(
                "toast"
            );



        if(!toast) {


            toast =
                document.createElement(
                    "div"
                );


            toast.id =
                "toast";


            document.body.appendChild(
                toast
            );


        }



        toast.textContent =
            message;



        toast.classList.add(
            "show"
        );



        setTimeout(
            () => {


                toast.classList.remove(
                    "show"
                );


            },

            2500

        );


    },





    /* ================================
       Modal Support
    ================================= */


    openModal(content) {


        let modal =

            document.getElementById(
                "modal"
            );



        if(!modal) {


            modal =
                document.createElement(
                    "div"
                );


            modal.id =
                "modal";


            document.body.appendChild(
                modal
            );


        }



        modal.innerHTML = `


            <div class="modal-content">


                ${content}


                <button
                    id="closeModal">

                    Close

                </button>


            </div>


        `;



        modal.style.display =
            "block";



        document.getElementById(
            "closeModal"
        ).onclick = () => {


            this.closeModal();


        };


    },





    closeModal() {


        const modal =

            document.getElementById(
                "modal"
            );



        if(modal) {


            modal.style.display =
                "none";


        }


    }

};
