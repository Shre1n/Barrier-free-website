//import axios, {AxiosError, AxiosResponse} from "axios;

// Funktion Asynch geschaltet damit getUser geht
let modalFensterUser: bootstrap.Modal;
document.addEventListener("DOMContentLoaded", async () => {
    modalFensterUser = new bootstrap.Modal(document.getElementById("ModalUser"));
    const registrieren = document.querySelector("#registrieren");
    if (registrieren) {
        registrieren.addEventListener("click", () => {
            modalFensterUser.show();
        });
    }
    console.log(document.getElementById("modalForm"));
    document.getElementById("modalForm").addEventListener("submit", addUser);
    //getUser liest Nutzerdaten, fügt diese bei Profilseite ein
    await getUser();
    displayProfile();
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

    //routen aufruf welcher an den Server uebermittelt wird
    //Axios dient als Middleware
    axios.post("/user", {
        //JSON Body
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

async function getUser(){
    const response = await fetch("/user", {
      method: "get"
    });
    const data = await response.json();
    renderUserProfile(data);
}

function renderUserProfile(data: any){
    const anredeElement = document.getElementById('displayanrede');
    const vornameElement = document.getElementById('displayvorname');
    const nachnameElement = document.getElementById('displaynachname');
    const emailElement = document.getElementById('displayemail');
    const passwortElement = document.getElementById('displaypasswort');
    const plzElement = document.getElementById('displayPLZ');
    const ortElement = document.getElementById('displayort');
    const strasseElement = document.getElementById('displaystrasse');
    const hnrElement = document.getElementById('displayhausnummer');
    const telefonnummerElement = document.getElementById('displaytelefonnummer');
    const newsletterElement =  document.getElementById("displaynewsletter");
    anredeElement.innerText = data.anrede;
    vornameElement.innerText = data.vorname;
    nachnameElement.innerText = data.nachname;
    emailElement.innerText = data.email;
    passwortElement.innerText = data.passwort;
    plzElement.innerText = data.postleitzahl;
    ortElement.innerText = data.ort;
    strasseElement.innerText = data.straße;
    hnrElement.innerText = data.hnr;
    telefonnummerElement.innerText = data.telefonnummer;
    newsletterElement.innerText = data.newsletter;
}


async function displayProfile() {
 const DisplayUser = document.getElementById('nutzerProfil')
 const DisplayCeo = document.getElementById('ceoProfil')
 const DisplayAdmin = document.getElementById('adminProfil')

    try {
        const res: Response = await fetch("/user" , {method: "GET"});
        const json = await res.json();
        if (json.rollenid === "1"){
            DisplayCeo.hidden = true;
            DisplayAdmin.hidden = false;
            DisplayUser.hidden = true;
        }
        else if (json.rollenid === "2"){
            DisplayCeo.hidden = false;
            DisplayAdmin.hidden = true;
            DisplayUser.hidden = true;
        }
        else if (json.rollenid === "3"){
            DisplayCeo.hidden = true;
            DisplayAdmin.hidden = true;
            DisplayUser.hidden = false;
        }
    }
    catch (err) {
        console.log(err.message ? err.message : "Es ist ein Fehler aufgetreten")
    }
}



