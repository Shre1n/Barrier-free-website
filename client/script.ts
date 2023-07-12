//import axios, {AxiosError, AxiosResponse} from "axios;


let modalFensterUser: bootstrap.Modal;
let modalFensterUserLogin: bootstrap.Modal;
let modalNutzerlöschen: bootstrap.Modal;
let currentUser: Map<string, string> = new Map<string, string>();

document.addEventListener("DOMContentLoaded", () => {
    modalFensterUser = new bootstrap.Modal(document.getElementById("ModalUser"));
    modalFensterUserLogin = new bootstrap.Modal(document.getElementById("ModalUserLogin"));
    const registrieren = document.querySelector("#registrieren");
    const signupform = document.querySelector("#signupform");
    const loginform = document.querySelector("#loginform");
    if (registrieren) {
        registrieren.addEventListener("click", () => {
            modalFensterUserLogin.show();
        });
    }
    if (signupform) {
        signupform.addEventListener("click", () => {
            modalFensterUserLogin.hide();

            if (loginform) {
                loginform.addEventListener("click", () => {
                    modalFensterUser.hide();
                    modalFensterUserLogin.show();
                })
            }
            console.log(document.getElementById("modalForm"));
            document.getElementById("modalForm").addEventListener("submit", addUser);

        });

        document.addEventListener("DOMContentLoaded", () => {
            modalNutzerlöschen = new bootstrap.Modal(document.getElementById("ModalNutzerlöschen"));
            const loeschen = document.querySelector("#nutzerlöschenbutton");
            const abbrechen = document.querySelector("#nutzerlöschenabbrechen");
            if (loeschen) {
                loeschen.addEventListener("click", () => {
                    modalNutzerlöschen.show();
                });
            }
            if (abbrechen) {
                abbrechen.addEventListener("click", () => {
                    modalNutzerlöschen.hide();
                });
            }
            console.log(document.getElementById("ModalNutzerlöschen"));
            document.getElementById("ModalNutzerlöschen").addEventListener("submit", delUser);

        });

        function addUser(event: Event): void {
            event.preventDefault();
            const form: HTMLFormElement = event.target as HTMLFormElement;

            //Attribute von User
            const anrede: String = (document.getElementById("anrede") as HTMLInputElement).value;
            const vorname: String = (document.getElementById("vorname") as HTMLInputElement).value;
            const nachname: String = (document.getElementById("nachname") as HTMLInputElement).value;
            const email: String = (document.getElementById("email") as HTMLInputElement).value;
            const passwort: String = (document.getElementById("passwort") as HTMLInputElement).value;
            const postleitzahl: String = (document.getElementById("postleitzahl") as HTMLInputElement).value;
            const ort: String = (document.getElementById("ort") as HTMLInputElement).value;
            const strasse: String = (document.getElementById("strasse") as HTMLInputElement).value;
            const hnr: String = (document.getElementById("hausnummer") as HTMLInputElement).value;
            const telefonnummer: String = (document.getElementById("telefonnummer") as HTMLInputElement).value;
            const passwortcheck: String = (document.querySelector("#passwortcheck") as HTMLInputElement).value;
            const checkbox = document.querySelector("#checkNewsletter") as HTMLInputElement;
            if (checkbox.checked && passwort === passwortcheck) {
                //routen aufruf welcher an den Server uebermittelt wird
                //Axios dient als Middleware
                axios.post("/user", {
                    //JSON Body
                    anrede: anrede,
                    vorname: vorname,
                    nachname: nachname,
                    email: email,
                    passwort: passwort,
                    postleitzahl: postleitzahl,
                    ort: ort,
                    strasse: strasse,
                    hnr: hnr,
                    telefonnummer: telefonnummer,
                    newsletter: "Ja"
                }).then((res: AxiosResponse) => {
                    console.log(res);
                    //reset der Form zum Eintragen
                    form.reset();
                    document.getElementById("registrierenError").innerText = "";
                    modalFensterUser.hide();
                }).catch((reason: AxiosError) => {
                    if (reason.response.status == 400) {
                        document.getElementById("registrierenError").innerText = "Diese Email ist bereits vergeben.";
                    }
                    //Error Ausgabe in Console
                    console.log(reason);
                });
            } else if (passwort === passwortcheck) {
//routen aufruf welcher an den Server uebermittelt wird
                //Axios dient als Middleware
                axios.post("/user", {
                    //JSON Body
                    anrede: anrede,
                    vorname: vorname,
                    nachname: nachname,
                    email: email,
                    passwort: passwort,
                    postleitzahl: postleitzahl,
                    ort: ort,
                    strasse: strasse,
                    hnr: hnr,
                    telefonnummer: telefonnummer,
                    newsletter: "Nein"
                }).then((res: AxiosResponse) => {
                    console.log(res);
                    //reset der Form zum Eintragen
                    form.reset();
                    document.getElementById("registrierenError").innerText = "";
                    modalFensterUser.hide();
                }).catch((reason: AxiosError) => {
                    if (reason.response.status == 400) {
                        document.getElementById("registrierenError").innerText = "Diese Email ist bereits vergeben.";
                    }
                    //Error Ausgabe in Console
                    console.log(reason);
                });
            } else {
                document.getElementById("registrierenError").innerText = "Passwörter stimmen nicht überein.";
            }
        }

        function delUser(): void {
            event.preventDefault();
            axios.delete(`/deleteUser`).then((res: AxiosResponse) => {
                console.log(res);
                signOff();
            }).catch((reason: AxiosError) => {
                console.log(reason);
            });
        }

        /**
         *
         * Methode zum Abmelden des Users
         * Meldet den jetzigen User ab und setzt die Session des Users auf null
         *
         */

        function signOff(): void {
            axios.get("/signout").then((res: AxiosResponse) => {
                console.log(res);
            }).catch((reason: AxiosError) => {
                console.log(reason);
            });
        }
    }
});

