//import axios, {AxiosError, AxiosResponse} from "axios;

let modalFensterUser: bootstrap.Modal;
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("registrieren").addEventListener("submit", (event: Event) => addUser(event));

    modalFensterUser = new bootstrap.Modal(document.getElementById("ModalUser"));

    document.getElementById("registrieren").addEventListener("click",()=>{
       modalFensterUser.show();
       document.getElementById("modalForm").addEventListener("submit", (event:Event) => addUser(event));
    });
});

function addUser(event: Event): void {
    event.preventDefault();
    const form: HTMLFormElement = event.target as HTMLFormElement;

    //Attribute von User
    const anrede: String = (document.getElementById("anrede") as HTMLInputElement).value;
    const vorname: String = (document.getElementById("vorname") as HTMLInputElement).value;
    const nachname: String = (document.getElementById("nachname") as HTMLInputElement).value;
    const email: String = (document.getElementById("email") as HTMLInputElement).value;
    const password: String = (document.getElementById("password") as HTMLInputElement).value;
    const postleitzahl: String = (document.getElementById("PLZ") as HTMLInputElement).value;
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
        password: password,
        postleitzahl:postleitzahl,
        ort:ort,
        strasse:strasse,
        hnr: hnr,
        telefonnummer:telefonnummer

    }).then((res: AxiosResponse) => {
        console.log(res);
        //reset der Form zum Eintragen
        form.reset();
        document.getElementById("signUpError").innerText = "";
    }).catch((reason: AxiosError) => {
        if (reason.response.status == 500) {
            document.getElementById("signUpError").innerText = "Dieser Nutzer existiert bereits.";
        }
        //Error Ausgabe in Console
        console.log(reason);
    });
}

