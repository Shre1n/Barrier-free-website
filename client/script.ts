//import axios, {AxiosError, AxiosResponse} from "axios;
let modalFensterUser: bootstrap.Modal;
let modalFensterUserLogin: bootstrap.Modal;
document.addEventListener("DOMContentLoaded", () => {
    modalFensterUser = new bootstrap.Modal(document.getElementById("ModalUser"));
    modalFensterUserLogin = new bootstrap.Modal(document.getElementById("ModalUserLogin"));
    const registrieren = document.querySelector("#registrieren");
    const signupform = document.querySelector("#signupform");
    const loginform = document.querySelector("#loginform");
    if (registrieren){
        registrieren.addEventListener("click", () =>{
            modalFensterUserLogin.show();
        });
    }
    if (signupform) {
        signupform.addEventListener("click", () => {
            modalFensterUserLogin.hide();
            modalFensterUser.show();
        });
    }
    if (loginform) {
            loginform.addEventListener("click", () => {
                modalFensterUser.hide();
                modalFensterUserLogin.show();
            })
        }
    console.log(document.getElementById("modalForm"));
    document.getElementById("modalForm").addEventListener("submit", addUser);
});

function addUser(event: Event): void {
    event.preventDefault();
    const form: HTMLFormElement = event.target as HTMLFormElement;

    //Attribute von User
    const anrede: String = (document.getElementById("anrede") as HTMLInputElement).value;
    const vorname: String = (document.getElementById("vorname") as HTMLInputElement).value;
    const nachname: String = (document.getElementById("nachname") as HTMLInputElement).value;
    const email: String = (document.getElementById("email") as HTMLInputElement).value;
    const telefonnummer: String = (document.getElementById("telefonnummer") as HTMLInputElement).value;
    const postleitzahl: String = (document.getElementById("postleitzahl") as HTMLInputElement).value;
    const ort: String = (document.getElementById("ort") as HTMLInputElement).value;
    const strasse: String = (document.getElementById("strasse") as HTMLInputElement).value;
    const hnr: String = (document.getElementById("hausnummer") as HTMLInputElement).value;
    const passwort: String = (document.getElementById("passwort") as HTMLInputElement).value;

    //const passwordcheck: String = (document.getElementById("passwortcheck") as HTMLInputElement).value;

/*
    if (passwort == passwordcheck) {
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
            telefonnummer: telefonnummer
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
    } else if (passwort != passwordcheck) {
        document.getElementById("registrierenError").innerText = "Password stimmt nicht überein";
    }
    */
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
        telefonnummer: telefonnummer
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
}

