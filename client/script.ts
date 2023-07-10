//import axios, {AxiosError, AxiosResponse} from "axios;


let modalFensterUser: bootstrap.Modal;
document.addEventListener("DOMContentLoaded", () => {
    modalFensterUser = new bootstrap.Modal(document.getElementById("ModalUser"));
    const registrieren = document.querySelector("#registrieren");
    if (registrieren){
        registrieren.addEventListener("click", () =>{
            modalFensterUser.show();
        });
    }
    console.log(document.getElementById("modalForm"));
    document.getElementById("modalForm").addEventListener("submit", addUser);
});

function addUser(event: Event): void {
    console.log("ADDUSER");
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

    //routen aufruf welcher an den Server uebermittelt wird
    axios.post("/user", {
        anrede:anrede,
        vorname: vorname,
        nachname: nachname,
        email: email,
        passwort: passwort,
        postleitzahl:postleitzahl,
        ort:ort,
        strasse:strasse,
        hnr: hnr,
        telefonnummer:telefonnummer
    }).then((res: AxiosResponse) => {
        console.log(res);
        //reset der Form zum Eintragen
        form.reset();
        document.getElementById("registrierenError").innerText = "HDJEHUEWHUHWU";
        modalFensterUser.hide();
    }).catch((reason: AxiosError) => {
        if (reason.response.status == 400) {
            document.getElementById("registrierenError").innerText = "Diese Email ist bereits vergeben.";
        }
        //Error Ausgabe in Console
        console.log(reason);
    });
}

