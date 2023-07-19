//import axios, {AxiosError, AxiosResponse} from "axios;

//Definierung der Struktur "Bestellung"
interface Bestellung {
    lieferadresse: {
        anrede: string;
        vorname: string;
        nachname: string;
        postleitzahl: string;
        ort: string;
        strasse: string;
        hnr: string;
    };
    rechnungsadresse: {
        anrede: string;
        vorname: string;
        nachname: string;
        postleitzahl: string;
        ort: string;
        strasse: string;
        hnr: string;
    };
}

interface WarenkorbProdukt{
    produktName: string;
    kurzbeschreibung: string;
    preis:number;
    bilder:string;
    bestand: number;
    produktMenge: number;
}


//Modalfenster von Bootstrap
let modalFensterUser: bootstrap.Modal;
let modalFensterUserLogin: bootstrap.Modal;
let modalFensterWarenkorb: bootstrap.Modal;

let shoppingCart:WarenkorbProdukt[] = [];

document.addEventListener("DOMContentLoaded",  () => {
    //checkt ob der Nutzer eingeloggt ist
    checkLogin();

    modalFensterUser = new bootstrap.Modal(document.getElementById("ModalUser"));
    modalFensterUserLogin = new bootstrap.Modal(document.getElementById("ModalUserLogin"));
    modalFensterWarenkorb= new bootstrap.Modal(document.getElementById("ModalWarenkorb"));
    const registrieren = document.querySelector("#registrieren") as HTMLElement;
    const signupform = document.querySelector("#signupform");
    const loginform = document.querySelector("#loginform");
    const abmelden = document.querySelector("#abmelden");
    const deleteUser = document.querySelector("#nutzerlöschenbutton") as HTMLElement;
    const deletecheck = document.querySelector("#userdeletecheck") as HTMLElement;
    const editButtonUser = (document.querySelector("#editIconUser") as HTMLElement);
    const saveEdit = document.querySelector("#saveEdit") as HTMLButtonElement;
    const cancelEdit = document.querySelector("#cancelEditButton") as HTMLButtonElement;
    const zurKasseBtn = document.getElementById("zurKasse") as HTMLButtonElement;
    let warenkorb = document.querySelector("#warenkorb");

    //Wenn auf Warenkorb geklickt wird, wird das READ ausgeführt
    warenkorb.addEventListener("click", () => {
        warenkorbRender();

    });

    if (registrieren) {
        registrieren.addEventListener("click", () => {
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
        });
    }
    if (warenkorb) {
        warenkorb.addEventListener("click", () => {
            modalFensterWarenkorb.show();
        })
    }

    if (deleteUser) {
        deleteUser.addEventListener("click", () => {
            deleteUser.style.display = "none";
            deletecheck.style.display = "block";
        });
    }

    getUser();
    //dient zum Rendern der Verteilerseite
    getProduct();
    //dient zum Rendern der Startseite
    getProduct2();
    //Alle Listener für die Bestellseite
    try {
        lieferUndRechnungsAdresseRendern();
        //enable input
        document.getElementById("editLieferadresseBtn").addEventListener("click", () => {
           const hideden = document.querySelector("#bestellungAbschliessen") as HTMLButtonElement;

            toggleEditLieferadresse(false);
            hideden.style.display="none";

        });

        document.getElementById("lieferAdBtn").addEventListener("click", () => {
            const hideden = document.querySelector("#bestellungAbschliessen") as HTMLButtonElement;
            toggleEditLieferadresse(true);
            lieferUndRechnungsAdresseRendern();
            hideden.style.display="block";
        });


        document.getElementById("lieferAdBtnCancel").addEventListener("click", () => {
            const hideden = document.querySelector("#bestellungAbschliessen") as HTMLButtonElement;
            toggleEditLieferadresse(true);
            lieferUndRechnungsAdresseRendern();
            hideden.style.display="block";
        });
        document.getElementById("postLieferadresseForm").addEventListener("submit", updateLieferAdresse);
        document.getElementById("checkRechnungsadresse").addEventListener("change", toggleRechnungsadresse);
        document.getElementById("bestellungAbschliessen").addEventListener("click", createBestellung);

        //  document.getElementById("bestellungAbschliessen").addEventListener("click", toggleDanke);


    } catch (e) {

    }


    try {
        zurKasseBtn.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = "bestellabschluss.html"


        })
    } catch (e) {

    }

    document.getElementById("modalForm").addEventListener("submit", addUser);
    document.getElementById("modalFormlogin").addEventListener("submit", signIn);
    abmelden.addEventListener("click", signOff);

    try{
        saveEdit.addEventListener("click", (event:Event) => {
            editUser(event);
        });
        cancelEdit.addEventListener("click", hideEditUser);
        editButtonUser.addEventListener("click", (event: Event) => {
            const UserEditForm = document.querySelector("#editUser") as HTMLElement;
            const UserProfilForm = document.querySelector("#profilUser") as HTMLElement;
            getUser();
            UserEditForm.style.display = "block";
            UserProfilForm.style.display = "none";
        });
        // Nur auf Profilseite oder ganz UNTEN!
        deletecheck.addEventListener("click", delUser);
    } catch (e) {

    }





});

window.addEventListener('DOMContentLoaded', () => {
    const previousPageLink = document.getElementById('previousPageLink') as HTMLAnchorElement;
    const currentPageLink = document.getElementById('currentPageLink') as HTMLAnchorElement;

    const referrer = document.referrer;
    const currentURL = window.location.href;

    if (referrer) {
        previousPageLink.textContent = getPreviousPageName(referrer);
        previousPageLink.href = referrer;
    } else {
        previousPageLink.style.display = 'none'; // Verstecke den Link, wenn keine vorherige Seite vorhanden ist
    }

    const currentPageName = getCurrentPageName(currentURL);
    currentPageLink.textContent = currentPageName;

    // Überprüfung, ob vorherige Seite und aktuelle Seite gleich sind
    if (previousPageLink.textContent === currentPageName) {
        previousPageLink.style.display = 'none'; // Verstecke den Link, um Duplikate zu vermeiden
    }
});

function getPreviousPageName(url: string): string {
    const parser = document.createElement('a');
    parser.href = url;
    const pathname = parser.pathname; // Pfadname der vorherigen Seite inklusive .html
    const pageName = pathname.split('/').pop(); // Letztes Element des Pfadnamens (inklusive .html)

    if (pageName) {
        return pageName.replace('.html', ''); // Entferne das .html aus dem Namen
    }

    return ''; // Rückgabe eines leeren Strings, wenn kein Seitenname vorhanden ist
}

function getCurrentPageName(url: string): string {
    const parser = document.createElement('a');
    parser.href = url;
    const pathname = parser.pathname; // Pfadname der aktuellen Seite inklusive .html
    const pageName = pathname.split('/').pop(); // Letztes Element des Pfadnamens (inklusive .html)

    if (pageName) {
        return pageName.replace('.html', ''); // Entferne das .html aus dem Namen
    }

    return ''; // Rückgabe eines leeren Strings, wenn kein Seitenname vorhanden ist
}
//CREATE USER
function addUser(event: Event): void {
    event.preventDefault();
    const form: HTMLFormElement = event.target as HTMLFormElement;
    //liest die Inputfelder aus
    const anredeErr = document.querySelector("#anredeErr") as HTMLElement;
    const vornameErr = document.querySelector("#vornameErr") as HTMLElement;
    const nachnameErr = document.querySelector("#nachnameErr") as HTMLElement;
    const emailErr = document.querySelector("#emailErr") as HTMLElement;
    const telefonnummerErr = document.querySelector("#telefonnummerErr") as HTMLElement;
    const strasseErr = document.querySelector("#strasseErr") as HTMLElement;
    const hausnummerErr = document.querySelector("#hausnummerErr") as HTMLElement;
    const postleitzahlErr = document.querySelector("#postleitzahlErr") as HTMLElement;
    const ortErr = document.querySelector("#ortErr") as HTMLElement;
    const passwortErr = document.querySelector("#passwortErr") as HTMLElement;
    const passwortCheckErr = document.querySelector("#passwortCheckErr") as HTMLElement;

    anredeErr.innerText = "";
    vornameErr.innerText = "";
    nachnameErr.innerText = "";
    emailErr.innerText = "";
    telefonnummerErr.innerText = "";
    strasseErr.innerText = "";
    hausnummerErr.innerText = "";
    postleitzahlErr.innerText = "";
    ortErr.innerText = "";
    passwortErr.innerText = "";
    passwortCheckErr.innerText = "";


    //Attribute von User
    const anrede: String = (document.getElementById("anrede") as HTMLInputElement).value.trim();
    const vorname: String = (document.getElementById("vorname") as HTMLInputElement).value.trim();
    const nachname: String = (document.getElementById("nachname") as HTMLInputElement).value.trim();
    const email: String = (document.getElementById("email") as HTMLInputElement).value.trim();
    const passwort: String = (document.getElementById("passwort") as HTMLInputElement).value.trim();
    const postleitzahl: String = (document.getElementById("postleitzahl") as HTMLInputElement).value.trim();
    const ort: String = (document.getElementById("ort") as HTMLInputElement).value.trim();
    const strasse: String = (document.getElementById("strasse") as HTMLInputElement).value.trim();
    const hnr: String = (document.getElementById("hausnummer") as HTMLInputElement).value.trim();
    const telefonnummer: String = (document.getElementById("telefonnummer") as HTMLInputElement).value.trim();
    const passwortcheck: String = (document.querySelector("#passwortcheck") as HTMLInputElement).value.trim();
    const checkbox = document.querySelector("#checkNewsletter") as HTMLInputElement;

    //Checked ob die Passwörter gleich sind und die Checkbox des Newsltter gecheckt ist
    if (checkbox.checked && passwort === passwortcheck) {
        //routen aufruf welcher an den Server uebermittelt wird
        //Axios dient als Middleware
        //POST METHODE
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
            erfolgreichRegister();
            modalFensterUser.hide();
            //reset der Form zum Eintragen
            form.reset();
            document.getElementById("registrierenError").innerText = "";
        }).catch((reason: AxiosError) => {
            getErrorMessage(reason.response.data);
            if (reason.response.status == 400) {
                document.getElementById("registrierenError").innerText = "Diese Email ist bereits vergeben.";
            }

        });
        //Passwort ist gleich aber Checkbox ist nicht checked
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
            erfolgreichRegister();
            //reset der Form zum Eintragen
            form.reset();
            modalFensterUser.hide();
            document.getElementById("registrierenError").innerText = "";
        }).catch((reason: AxiosError) => {
            getErrorMessage(reason.response.data);
            if (reason.response.status == 400) {
                document.getElementById("registrierenError").innerText = "Diese Email ist bereits vergeben.";
            }
            //Error Ausgabe in Console

        });
    } else {
        //Passwörter stimmen nicht überein
        document.getElementById('passwortErr').innerText = "Passwörter stimmen nicht überein";
        const toastLiveExample = document.getElementById('liveToast');
        const toast = new bootstrap.Toast(toastLiveExample)
        toast.show();
        document.getElementById("registrierenError").innerText = "Passwörter stimmen nicht überein.";
    }
}

//Definierung der Toasts
function getErrorMessage(data){
    const firstSpace = data.indexOf(" ");
    const firstword = data.substring(0, firstSpace);
    const caselower = firstword.toLowerCase();
    (document.getElementById(`${caselower}Err`).innerText = data);


    const toastLiveExample = document.getElementById('liveToast');
    const toast = new bootstrap.Toast(toastLiveExample)
    toast.show();


    (document.getElementById(`${caselower}`) as HTMLInputElement).value = "";
}

function erfolgreichChange(){
    document.getElementById("angelegt").innerText= "Nutzer erfolgreich geändert!";
    const toastLiveExample = document.getElementById('erfolgreich');
    const toast = new bootstrap.Toast(toastLiveExample);
    toast.show();
}

function erfolgreichWarenkorbStart(){
    document.getElementById("warenkorbErfolgreichStart").innerText= "Produkt dem Warenkorb hinzugefügt! Bitte beachten Sie, dass Sie angemeldet sein müssen um auf Ihren Warenkorb zuzugreifen!";
    const toastLiveExample = document.getElementById('warenkorbErfolgStart');
    const toast = new bootstrap.Toast(toastLiveExample);
    toast.show();
}



function erfolgreichRegister(){

    document.getElementById("erfolgreich").innerText= "Sie sind jetzt registriert!";
    const toastLiveExample = document.getElementById('registerErfolg');
    const toast = new bootstrap.Toast(toastLiveExample);
    toast.show();
}

function erfolgreichEingeloggt() {
    document.getElementById("loginErfolgreich").innerText= "Sie sind jetzt Angemeldet!";
    const toastLiveExample = document.getElementById('loginErfolg');
    const toast = new bootstrap.Toast(toastLiveExample);
    toast.show();
}


function warenkorbErfolgreich() {
    document.getElementById("warenkorbErfolgreich").innerText= "Produkt dem Warenkorb hinzugefügt! Bitte beachten Sie, dass Sie angemeldet sein müssen um auf Ihren Warenkorb zuzugreifen!";
    const toastLiveExample = document.getElementById('warenkorbErfolg');
    const toast = new bootstrap.Toast(toastLiveExample);
    toast.show();
}

function BestellungErr() {
    document.getElementById("bestellungErrMessage").innerText= "Der Warenkorb muss min. 1 Produkt enthalten!";
    const toastLiveExample = document.getElementById('BestellungErr');
    const toast = new bootstrap.Toast(toastLiveExample);
    toast.show();
}
function BestellungCheckErr() {
    document.getElementById("bestellungErrCheckMessage").innerText= "Bitte bestätigen Sie die Datenschutzbestimmung und die AGBs";
    const toastLiveExample = document.getElementById('BestellungErrCheck');
    const toast = new bootstrap.Toast(toastLiveExample);
    toast.show();
}

function lieferCheckErr() {
    document.getElementById("lieferErrMessage").innerText= "Felder dürfen nicht leer sein!";
    const toastLiveExample = document.getElementById('lieferErr');
    const toast = new bootstrap.Toast(toastLiveExample);
    toast.show();
}



//DELETE USER
function delUser(event: Event): void {
    event.preventDefault();
    axios.delete(`/deleteUser`).then((res: AxiosResponse) => {
        //Der Nutzer wird abgemeldet und auf die Startseite geworfen
        signOff();
        window.location.href = "/startseite.html";
    }).catch((reason: AxiosError) => {

    });
}
//UPDATE USER
function editUser(event: Event): void {
    event.preventDefault();
    const form: HTMLFormElement = event.target as HTMLFormElement;

    const toastLiveExample = document.getElementById('liveToast');
    const toast = new bootstrap.Toast(toastLiveExample);
    toast.show();

    const anredeErr = document.querySelector("#anredeErr") as HTMLElement;
    const vornameErr = document.querySelector("#vornameErr") as HTMLElement;
    const nachnameErr = document.querySelector("#nachnameErr") as HTMLElement;
    const emailErr = document.querySelector("#emailErr") as HTMLElement;
    const telefonnummerErr = document.querySelector("#telefonnummerErr") as HTMLElement;
    const strasseErr = document.querySelector("#strasseErr") as HTMLElement;
    const hausnummerErr = document.querySelector("#hausnummerErr") as HTMLElement;
    const postleitzahlErr = document.querySelector("#postleitzahlErr") as HTMLElement;
    const ortErr = document.querySelector("#ortErr") as HTMLElement;
    const editCheck = document.querySelector("#angelegt") as HTMLElement;


    anredeErr.innerText = "";
    vornameErr.innerText = "";
    nachnameErr.innerText = "";
    emailErr.innerText = "";
    telefonnummerErr.innerText = "";
    strasseErr.innerText = "";
    hausnummerErr.innerText = "";
    postleitzahlErr.innerText = "";
    ortErr.innerText = "";
    editCheck.innerText = "";

    //Auslesen der Inputfelder
    const anrede: String = (document.getElementById("anredeNeu") as HTMLInputElement).value.trim();
    const vorname: String = (document.getElementById("displayvornameEdit") as HTMLInputElement).value.trim();
    const nachname: String = (document.getElementById("displaynachnameEdit") as HTMLInputElement).value.trim();
    const postleitzahl: String = (document.getElementById("displayPLZEdit") as HTMLInputElement).value.trim();
    const email: String = (document.getElementById("displayemailEdit") as HTMLInputElement).value.trim();
    const ort: String = (document.getElementById("displayortEdit") as HTMLInputElement).value.trim();
    const strasse: String = (document.getElementById("displaystrasseEdit") as HTMLInputElement).value.trim();
    const hnr: String = (document.getElementById("displayhausnummerEdit") as HTMLInputElement).value.trim();
    const telefonnummer: String = (document.getElementById("displaytelefonnummerEdit") as HTMLInputElement).value.trim();
    const checkbox = document.querySelector("#checkNewsletterNeu") as HTMLInputElement;
    const UserEditForm = document.querySelector("#editUser") as HTMLElement;
    const UserProfilForm = document.querySelector("#profilUser") as HTMLElement;

    if (vorname === "") {
        vornameErr.innerText = "Dieses Feld darf nicht leer sein!";
    }
    if (nachname === "") {
        nachnameErr.innerText = "Dieses Feld darf nicht leer sein!";
    }
    if (postleitzahl === "") {
        postleitzahlErr.innerText = "Dieses Feld darf nicht leer sein!";
    }
    if (ort === "") {
        ortErr.innerText = "Dieses Feld darf nicht leer sein!";
    }
    if (strasse === "") {
        strasseErr.innerText = "Dieses Feld darf nicht leer sein!";
    }
    if (hnr === "") {
        hausnummerErr.innerText = "Dieses Feld darf nicht leer sein!";
    }
    if (telefonnummer === "") {
        telefonnummerErr.innerText = "Dieses Feld darf nicht leer sein!";
    }
    //Überprüfung ob die Newsletter Checkbox gechecked ist
    if (checkbox.checked) {
        axios.put("/user", {
            anrede: anrede,
            vorname: vorname,
            nachname: nachname,
            postleitzahl: postleitzahl,
            email: email,
            ort: ort,
            strasse: strasse,
            hnr: hnr,
            telefonnummer: telefonnummer,
            newsletter: "Ja"
        }).then((res: AxiosResponse) => {
            getUser();
            erfolgreichChange();
            hideEditUser();
            form.reset();
        }).catch((reason: AxiosError) => {
            getErrorMessage(reason.response.data);
            if (reason.response.status == 500) {
                document.getElementById("updateError").innerText = "Eingabe nicht akzeptiert!"
            }
        });
    } else {
        axios.put("/user", {
            anrede: anrede,
            vorname: vorname,
            nachname: nachname,
            postleitzahl: postleitzahl,
            email: email,
            ort: ort,
            strasse: strasse,
            hnr: hnr,
            telefonnummer: telefonnummer,
            newsletter: "Nein"
        }).then((res: AxiosResponse) => {
            getUser();
            erfolgreichChange();
            hideEditUser();
            form.reset();
        }).catch((reason: AxiosError) => {
            getErrorMessage(reason.response.data);
            if (reason.response.status == 500) {
                document.getElementById("updateError").innerText = "Eingabe nicht akzeptiert!"
            }
        });
    }
}

/**
 *
 * Methode zum Abmelden des Users
 * Meldet den jetzigen User ab und setzt die Session des Users auf null
 *
 */
//ANMELDEN
function signIn(event: Event): void {
    event.preventDefault();
    const form: HTMLFormElement = event.target as HTMLFormElement;

    const email: string = (document.getElementById("emaillogin") as HTMLInputElement).value.trim();
    const passwort: string = (document.getElementById("passwortlogin") as HTMLInputElement).value.trim();
    const logout = (document.querySelector("#abmelden") as HTMLElement);
    const profil = (document.querySelector("#profilseite") as HTMLElement);
    const registrieren = (document.querySelector("#registrieren") as HTMLElement);
    const warenkorb = (document.querySelector("#warenkorbiconheader") as HTMLElement);


    axios.post("/signin", {
        email: email,
        passwort: passwort
    }).then((res: AxiosResponse) => {
        erfolgreichEingeloggt();
        modalFensterUserLogin.hide();
        //Buttons werden angezeigt
        logout.style.display = "inline-block";
        warenkorb.style.display="inline-block";
        profil.style.display = "inline-block";
        registrieren.style.display = "none";

        form.reset();
        document.getElementById("loginError").innerText = "";
        checkLogin();
    }).catch((reason: AxiosError) => {
        if (reason.response.status == 400){
            document.getElementById("loginError").innerText = "Passwort oder Email ist falsch."
        }
        checkLogin();
    });
    checkLogin();
}
//AUSLOGGEN
function signOff(): void {
    axios.post("/signout").then((res: AxiosResponse) => {
        checkLogin();
        window.location.href = "/startseite.html";
    }).catch((reason: AxiosError) => {
    });
    checkLogin();

}
//READ USER
function getUser(){

    axios.get("/user",{

    }).then((res:AxiosResponse) => {

        const userData = res.data;

        if (userData.rollenid === 3) {
            renderUserProfile(userData);
            renderUserEdit(userData);
        }

    });
    checkLogin();

}

function renderUserProfile(userData) {
    const anredeElement = document.getElementById('displayanrede');
    const vornameElement = document.getElementById('displayvorname');
    const nachnameElement = document.getElementById('displaynachname');
    const emailElement = document.getElementById('displayemail');
    const plzElement = document.getElementById('displayPLZ');
    const ortElement = document.getElementById('displayort');
    const strasseElement = document.getElementById('displaystrasse');
    const hnrElement = document.getElementById('displayhausnummer');
    const telefonnummerElement = document.getElementById('displaytelefonnummer');
    const newsletterElement = document.getElementById("displaynewsletter");
    const nameElement = document.getElementById("nutzerName");
    //Nutzerdaten werden auf Profilseite ausgefüllt
    anredeElement.innerText = userData.anrede;
    vornameElement.innerText = userData.vorname;
    nachnameElement.innerText = userData.nachname;
    emailElement.innerText = userData.email;
    plzElement.innerText = userData.postleitzahl;
    ortElement.innerText = userData.ort;
    strasseElement.innerText = userData.strasse;
    hnrElement.innerText = userData.hnr;
    telefonnummerElement.innerText = userData.telefonnummer;
    newsletterElement.innerText = userData.newsletter;
    nameElement.innerText = `${userData.vorname} ${userData.nachname}`;
    checkLogin();

}

async function checkLogin() {
    const abmelden = document.querySelector("#abmelden");
    const registrieren = document.querySelector("#registrieren") as HTMLElement;
    const profil = document.querySelector("#profilseite") as HTMLElement;
    const warenkorb = (document.querySelector("#warenkorbiconheader") as HTMLElement);


    try {
        const response = await fetch("/login",
            {
                method:"GET"
            });
        const data = await response.json();
    //Wenn der Status 200 ist dann ist der Nutzer angemeldet
        if(response.status == 200) {
            const rolle = data.rolle;
            //Warenkorb wird aus der Datenbank übertragen
            await getCart();
            //Buttons werden angezeigt
            abmelden.classList.remove("d-none");
            warenkorb.classList.remove("d-none");
            registrieren.style.display="none";
            profil.style.display="inline-block";
        } else {
            //Buttons werden nicht angezeigt
            abmelden.classList.add("d-none");
            warenkorb.classList.add("d-none");
        }
    } catch (e) {

    }
}

function renderUserEdit(userData) {
    const vornameElementEdit = document.getElementById('displayvornameEdit') as HTMLInputElement;
    const nachnameElementEdit = document.getElementById('displaynachnameEdit') as HTMLInputElement;
    const emailElementEdit = document.getElementById('displayemailEdit') as HTMLInputElement;
    const plzElementEdit = document.getElementById('displayPLZEdit') as HTMLInputElement;
    const ortElementEdit = document.getElementById('displayortEdit') as HTMLInputElement;
    const strasseElementEdit = document.getElementById('displaystrasseEdit') as HTMLInputElement;
    const hnrElementEdit = document.getElementById('displayhausnummerEdit') as HTMLInputElement;
    const telefonnummerElementEdit = document.getElementById('displaytelefonnummerEdit') as HTMLInputElement;
    const newsletterElementEdit = document.getElementById("displaynewsletterEdit") as HTMLInputElement;
    const nameElementEdit = document.getElementById("nutzerName");

    vornameElementEdit.value = userData.vorname;
    nachnameElementEdit.value = userData.nachname;
    emailElementEdit.value = userData.email;
    plzElementEdit.value = userData.postleitzahl;
    ortElementEdit.value = userData.ort;
    strasseElementEdit.value = userData.strasse;
    hnrElementEdit.value = userData.hnr;
    telefonnummerElementEdit.value = userData.telefonnummer;
    newsletterElementEdit.value = userData.newsletter;
    nameElementEdit.innerText = `${userData.vorname} ${userData.nachname}`;
}
function hideEditUser(){
    const UserEditForm = document.querySelector("#editUser") as HTMLElement;
    const UserProfilForm = document.querySelector("#profilUser") as HTMLElement;
    const loeschen = document.querySelector("#nutzerlöschenbutton") as HTMLElement;
    const loeschenCheck = document.querySelector("#userdeletecheck") as HTMLElement;
    getUser();

    loeschen.style.display = "block";
    loeschenCheck.style.display = "none";
    UserEditForm.style.display = "none";
    UserProfilForm.style.display = "block";
}
//READ Product
function getProduct(){
    axios.get("/product",{

    }).then((res:AxiosResponse) => {
        const productData = res.data

        if (productData.Bestand === ""){
            document.getElementById("bestandErr").innerHTML = "Produkt nicht mehr Verfügbar!";
        }
        renderGamesVerteiler(productData);
    });
    checkLogin();
}
//READ Product (Es gab fehler beim Render der Startseite und Verteilerseite deswegen zwei GetProduct, die die Seiten rendern
function getProduct2(){
    axios.get("/product",{

    }).then((res:AxiosResponse) => {
        const productData = res.data;
        if (productData.Bestand === ""){
            document.getElementById("bestandErr").innerHTML = "Produkt nicht mehr Verfügbar!";
        }

        startseiteRender(productData);
        renderGamesVerteiler(productData);

    });
    checkLogin();
}
//DELETE Warenkorb nach Bestellung
function delAllCartItems() {
    fetch("/deleteAll", {
        method: "DELETE"
    }).then((res) => {
        window.location.href = "Bestellung.html";
    }).catch((e) => {

    });
}





//Render Verteilerseite
function renderGamesVerteiler(productData){
    const spiele = document.querySelector("#spieleAuflistung") as HTMLDivElement;
    let p;
    const JsonContent = productData;
    for (p = 0; p < JsonContent.length; p++) {
        const productID = JsonContent[p].ID;
        if (JsonContent[p].Bestand === 0) {
            continue; // Überspringen der Iteration, wenn der Bestand 0 ist
        }
        //Anzeige Grün, Gelb, Rot je nach Bestand
        const bestand = JsonContent[p].Bestand;
        let availabilityClass = "availability";
        if (bestand === 0) {
            availabilityClass = "unavailable";
        } else if (bestand >= 51) {
            availabilityClass = "availabilityGreen";
        } else if (bestand >= 1 && bestand <= 50) {
            availabilityClass = "availabilityYellow";
        }

        spiele.innerHTML +=`
                    <div class="col-xl-4 col-lg-6 col-md-12 cardindex">
                        <div class="card cardbp">
                            <div class="container-fluid merken">
                                <i class="far fa-bookmark bookmarks bicon"></i>
                                 <a href ="produktdetail.html" class="detailseiteaufruf" data-product-id="${productID}">
                                <img src="${JsonContent[p].Bilder}" class="card-img-top cardpicp"
                                     alt="${JsonContent[p].Produktname}">
                                     </a>
                            </div>
                            <div class="card-body">
                             <a href ="produktdetail.html" class="cardbodytext">
                                <div class="container cardword">
                                    <i class="fas fa-circle ${availabilityClass}"></i>
                                    <h5 class="card-title font40 cardfont" data-product-id="${JsonContent[p].Produktname}">${JsonContent[p].Produktname}<br/><span data-product-id="${JsonContent[p].Preis}">${JsonContent[p].Preis} €</span>
                                    </h5>
                                </div>
                                </a>
                                <button type="button" class="btn btn-primary bbuttoncard bag" data-product-id="${JsonContent[p].ID}" data-productName="${JsonContent[p].Produktname}" onclick="postCart('${JsonContent[p].Produktname.trim()}', 1, 'add')"><i
                                        class="fas fa-shopping-bag bicon" ></i></button>
                            </div>
                        </div>
                </div>
    `

        const bags = document.querySelectorAll(".bag");
        bags.forEach((button) => {
            button.addEventListener("click", warenkorbErfolgreich);
        });
    }
}

//Startseite
function startseiteRender(productData) {
    checkLogin();

    const startseiteRender = document.querySelector("#startseiteRender") as HTMLDivElement;
    const JsonContent = productData;


    let htmlContent = "";
//Nur 3 Produkte sollen angezeigt werden
    for (let i = 0; i < 3; i++) {
        if (i >= JsonContent.length) {
            break; // Schleife beenden, wenn wir das Ende von JsonContent erreicht haben
        }

        const bestand = JsonContent[i].Bestand;

        // Änderungen an der Darstellung, wenn der Bestand 0 ist
        let availabilityClass = "unavailable";
        if (bestand > 0 && bestand <= 50) {
            availabilityClass = "availabilityYellow";
        } else if (bestand >= 51) {
            availabilityClass = "availabilityGreen";
        }
        const priceText = bestand === 0 ? "Ausverkauft" : `${JsonContent[i].Preis} €`;

        htmlContent += `
      <div class="col-xl-4 col-lg-6 col-md-12 cardindex">
        <div class="card cardbp">
          <div class="container-fluid merken">
            <i class="far fa-bookmark bookmarks bicon"></i>
            <a href="produktdetail.html">
              <img src="${JsonContent[i].Bilder}" class="card-img-top cardpicp" alt="${JsonContent[i].Produktname}">
            </a>
          </div>
          <div class="card-body">
            <div class="container cardword">
              <i class="fas fa-circle ${availabilityClass}"></i>
              <h5 class="card-title font40 cardfont">${JsonContent[i].Produktname}<br/>${priceText}</h5>
            </div>
            ${bestand > 0 ? `
            <button type="button" class="btn btn-primary bbuttoncard bag" data-product-id="${JsonContent[i].ID}" data-productName="${JsonContent[i].Produktname}" onclick="postCart('${JsonContent[i].Produktname.trim()}', 1, 'add')"><i
                                        class="fas fa-shopping-bag bicon" ></i></button>
             ` : ''}
          </div>
        </div>
      </div>
    `;
//Wenn der Bestand 0 ist wird der Preis ausgetauscht und das Warenkorb Icon ist nicht mehr zusehen

    }
    checkLogin();
    startseiteRender.innerHTML = htmlContent;
    const bags = document.querySelectorAll(".bag");
    bags.forEach((button) => {
        button.addEventListener("click", erfolgreichWarenkorbStart);
    });

}

//Warenkorb
function warenkorbRender() {
    const modalFormWarenkorb = document.querySelector("#modalFormWarenkorb") as HTMLDivElement;
    let endpreis = 0; // Variable für den Gesamtpreis

    // Löscht die Inhalte des Warenkorbmodals
    modalFormWarenkorb.innerHTML = "";
    modalFormWarenkorb.innerHTML = `
    <div class="modal-body">
      <div class="row border border-dark rounded">
    `;

    for (let i = 0; i < shoppingCart.length; i++) {
        let produkt = shoppingCart[i];

        const subtotal = produkt.preis * produkt.produktMenge; // Teilsumme für das aktuelle Produkt
        endpreis += subtotal; // Teilsumme zum Gesamtpreis hinzufügen

        modalFormWarenkorb.innerHTML += `

      <div class="modal-body" data-position="${i}">
        <div class="row border border-dark rounded">
          <div class="col-4">
            <div class="row mt-3">
              <div class="col d-md-none d-lg-block d-sm-none d-md-block d-none d-sm-block">
                <img src="${produkt.bilder}" id="imageProdukt" alt="${produkt.produktName}" class="placeholdermerkliste img-fluid imgHöhe">
              </div>
            </div>
          </div>
          <div class="col-lg-8 mb-3 col-md-12">
            <div class="row imgHöhe">
              <div class="col-10 mb-4">
                <span class="bree20G">${produkt.produktName}</span>
              </div>
              <div class="col-2 mb-4 text-end">
                <i class="fas fa-solid fa-trash" type="button" data-trash="${produkt.produktName}"></i>
              </div>
              <div class="col-10 mb-4">
                <span>${produkt.kurzbeschreibung}</span>
              </div>
              <div class="col-2 mb-4"></div>
              <div class="col-6">
                <label for="menge">Menge: </label>
                <input id="mengeInput${i}" type="number" name="menge" min="1" max="${produkt.bestand}" value="${produkt.produktMenge}" data-index="${i}" onKeyDown="return false">
              </div>
              <div id="preis${i}" class="col-6 text-end">
                <span>${subtotal.toFixed(2)} €</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    }

    modalFormWarenkorb.innerHTML += `
    </div>
    </div>
    <div class="modal-footer">
      <div class="container">
        <div class="row">
          <div class="col-5"></div>
          <div class="col-7 text-end" id="summe">
          Gesamtwert: ${endpreis.toFixed(2)} €
          </div>
        </div>
        <div class="row">
          <div class="col-8"></div>
          <div class="col-4 text-end">
            <button id="zurKasse" type="submit" class="btn bbutton mt-3">
              Zur Kasse
            </button>
          </div>
        </div>
      </div>
    </div>`;


    const quantityInputs = document.querySelectorAll("input[name='menge']");
    quantityInputs.forEach((input) => {
        input.addEventListener("change", updatePrice);
    });

    const deleteButtons = document.querySelectorAll(".fa-trash");
    deleteButtons.forEach((button) => {
        button.addEventListener("click", deleteItemFromWarenkorb);
    });
    const zurKasseBtnRenderd = document.getElementById("zurKasse") as HTMLElement;
    if(shoppingCart.length !== 0) {
        zurKasseBtnRenderd.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = "bestellabschluss.html"
        })
    } else {
        zurKasseBtnRenderd.addEventListener("click", (e) => {
            e.preventDefault();
            alert("Der Warenkorb ist leer!")
        })
    }

}

function updatePrice(event) {
    const input = event.target; // Das ausgelöste Eingabeelement wird abgerufen
    const quantity = parseInt(input.value); // Die eingegebene Menge wird als Ganzzahl interpretiert
    const index = input.dataset.index; // Der Index des Elements im Warenkorb wird aus dem "data-index"-Attribut abgerufen
    const produkt = shoppingCart[index]; // Das entsprechende Produkt im Warenkorb wird anhand des Indexes abgerufen
    const subtotal = produkt.preis * quantity; // Die Zwischensumme wird berechnet
    const priceElement = document.getElementById(`preis${index}`); // Das HTML-Element, das den Preis anzeigt, wird abgerufen
    priceElement.innerHTML = `<span>${subtotal.toFixed(2)} €</span>`; // Der Inhalt des priceElements wird aktualisiert

    // Speichern der Preisänderung mit putCart
    putCart(produkt.produktName, quantity, "change"); // Die Preisänderung wird im Warenkorb gespeichert

    calculateTotalPrice(); // Der Gesamtpreis des Warenkorbs wird neu berechnet
}

function calculateTotalPrice() {
    let endpreis = 0; // Variable zur Speicherung des Gesamtpreises

    const priceElements = document.querySelectorAll("[id^='preis']");  // Alle HTML-Elemente abrufen, deren IDs mit "preis" beginnen
    priceElements.forEach((element) => { // Schleife über jedes gefundene Element
        const subtotalText = element.textContent;  // Textinhalt des Elements abrufen, der den Zwischensummenbetrag enthält
        const subtotal = parseFloat(subtotalText); // Den Zwischensummenbetrag als Gleitkommazahl interpretieren
        endpreis += subtotal; // Den Zwischensummenbetrag zum Gesamtpreis addieren
    });

    const endpreisElement = document.getElementById("summe"); // Das HTML-Element abrufen, das den Gesamtpreis anzeigen soll
    if (endpreisElement) { // Überprüfen, ob das Element gefunden wurde
        endpreisElement.innerHTML = `${endpreis.toFixed(2)} €`; // Den Gesamtpreis in das HTML-Element einfügen
    }
}

async function deleteItemFromWarenkorb(event: Event): Promise<void> {
    const target: HTMLElement = event.target as HTMLElement;
    await deleteProductFromCart(target.dataset.trash);
    await getCart();
}




async function getCart(){
    await fetch("/cart",{
        method: "GET"
    }).then(async (res)=>{
        const data = await res.json();
        shoppingCart = data.warenkorb;
        warenkorbRender();
        bestellabschlussProdukteRender();
    }).catch((e)=>{

    });


}

async function putCart(produktName,menge, method)  {
    axios.put("/cart", {
        produktName: produktName,
        produktMenge: menge,
        method: method
    }).then(async (res: AxiosResponse) => {
        if (res.response.status == 403){
            console.log("Minus");
            throw new Error("Fehler: Menge ist negativ oder überschreitet den Bestand!");
        }
        await getCart();
    });
}

async function deleteProductFromCart(productName) {
    try {
        await axios.delete(`/cart/${productName}`);
        await getCart();
    } catch (error) {
        console.error("Fehler beim Löschen des Produkts aus dem Warenkorb", error);
    }
}

function postCart(produktName,menge, method){
    axios.post("/cart", {
        produktName: produktName,
        produktMenge: menge,
        method: method
    }).then(async () => {
        await getCart();
    });
}

async function lieferUndRechnungsAdresseRendern() {
    const anredeElement = document.getElementById('editLieferAnrede') as HTMLSelectElement;
    const anredeDisplayElement = document.getElementById('displayLieferAnrede') as HTMLInputElement;
    const vornameElement = document.getElementById('displayLieferVorname') as HTMLInputElement;
    const nachnameElement = document.getElementById('displayLieferNachname') as HTMLInputElement;
    const plzElement = document.getElementById('displayLieferPLZ') as HTMLInputElement;
    const ortElement = document.getElementById('displayLieferOrt') as HTMLInputElement;
    const strasseElement = document.getElementById('displayLieferStraße') as HTMLInputElement;
    const hnrElement = document.getElementById('displayLieferHnr') as HTMLInputElement;




    try {
        const response = await fetch("/bestellung",
            {
                method: "GET"
            });
        const res: Bestellung = await response.json();

        const lieferadresse = res.lieferadresse;

        if (response.status == 200) {
            anredeElement.value = lieferadresse.anrede;
            anredeDisplayElement.value = lieferadresse.anrede;
            vornameElement.value = lieferadresse.vorname;
            nachnameElement.value = lieferadresse.nachname;
            plzElement.value = lieferadresse.postleitzahl;
            ortElement.value = lieferadresse.ort;
            strasseElement.value = lieferadresse.strasse;
            hnrElement.value = lieferadresse.hnr;

            checkLogin();
        }
    } catch (e) {

    }


}

// Attempt
async function updateRechnungsadresse() {

    const anredeErr = document.querySelector("#anredeErr") as HTMLElement;
    const vornameErr = document.querySelector("#vornameErr") as HTMLElement;
    const nachnameErr = document.querySelector("#nachnameErr") as HTMLElement;
    const strasseErr = document.querySelector("#strasseErr") as HTMLElement;
    const hausnummerErr = document.querySelector("#hausnummerErr") as HTMLElement;
    const postleitzahlErr = document.querySelector("#postleitzahlErr") as HTMLElement;
    const ortErr = document.querySelector("#ortErr") as HTMLElement;


    anredeErr.innerText = "";
    vornameErr.innerText = "";
    nachnameErr.innerText = "";
    strasseErr.innerText = "";
    hausnummerErr.innerText = "";
    postleitzahlErr.innerText = "";
    ortErr.innerText = "";

    const anredeElement = (document.getElementById('displayRechnungAnrede') as HTMLSelectElement).value.trim();
    const vornameElement = (document.getElementById('displayRechnungVorname') as HTMLInputElement).value.trim();
    const nachnameElement = (document.getElementById('displayRechnungNachname') as HTMLInputElement).value.trim();
    const plzElement = (document.getElementById('displayRechnungPLZ') as HTMLInputElement).value.trim();
    const ortElement = (document.getElementById('displayRechnungOrt') as HTMLInputElement).value.trim();
    const strasseElement = (document.getElementById('displayRechnungStraße') as HTMLInputElement).value.trim();
    const hnrElement = (document.getElementById('displayRechnungHnr') as HTMLInputElement).value.trim();

    if (vornameElement === "") {
        vornameErr.innerText = "Dieses Feld darf nicht leer sein!";
    }
    if (nachnameElement === "") {
        nachnameErr.innerText = "Dieses Feld darf nicht leer sein!";
    }
    if (plzElement === "") {
        postleitzahlErr.innerText = "Dieses Feld darf nicht leer sein!";
    }
    if (ortElement === "") {
        ortErr.innerText = "Dieses Feld darf nicht leer sein!";
    }
    if (strasseElement === "") {
        strasseErr.innerText = "Dieses Feld darf nicht leer sein!";
    }
    if (hnrElement === "") {
        hausnummerErr.innerText = "Dieses Feld darf nicht leer sein!";
    }

    try {
        const response = await fetch("/rechnungsadresse",
            {
                method: "PUT",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    anrede: anredeElement.trim(),
                    vorname: vornameElement.trim(),
                    nachname: nachnameElement.trim(),
                    postleitzahl: plzElement.trim(),
                    ort: ortElement.trim(),
                    strasse: strasseElement.trim(),
                    hnr: hnrElement.trim()
                })
            });

        if (response.status == 400 || response.status == 403) {
            const data = await response.json();
            //getErrorMessage(data);
            alert(data.message);
        }
    } catch (e) {

    }
    checkLogin();
}


function toggleEditLieferadresse(toggle: boolean) {
    const hideden = document.querySelector("#bestellungAbschliessen") as HTMLButtonElement;
    const anredeElement = document.getElementById('editLieferAnrede') as HTMLSelectElement;
    const anredeDisplayElement = document.getElementById('displayLieferAnrede') as HTMLInputElement;
    const vornameElement = document.getElementById('displayLieferVorname') as HTMLInputElement;
    const nachnameElement = document.getElementById('displayLieferNachname') as HTMLInputElement;
    const plzElement = document.getElementById('displayLieferPLZ') as HTMLInputElement;
    const ortElement = document.getElementById('displayLieferOrt') as HTMLInputElement;
    const strasseElement = document.getElementById('displayLieferStraße') as HTMLInputElement;
    const hnrElement = document.getElementById('displayLieferHnr') as HTMLInputElement;
    const button = document.getElementById('lieferAdBtn') as HTMLButtonElement;
    const button2 = document.getElementById('lieferAdBtnCancel') as HTMLButtonElement;
    vornameElement.disabled = toggle;
    nachnameElement.disabled = toggle;
    plzElement.disabled = toggle;
    ortElement.disabled = toggle;
    strasseElement.disabled = toggle;
    hnrElement.disabled = toggle;
    if (toggle) {
        button.classList.add("d-none");
        button2.classList.add("d-none");
        anredeElement.classList.add("d-none");
        anredeDisplayElement.classList.remove("d-none");
        hideden.style.display="block";
    } else {
        button.classList.remove("d-none");
        button2.classList.remove("d-none");
        anredeElement.classList.remove("d-none");
        anredeDisplayElement.classList.add("d-none");
        hideden.style.display="none";
    }
}


async function updateLieferAdresse(e: Event) {
    e.preventDefault();
    const hideden = document.querySelector("#bestellungAbschliessen") as HTMLButtonElement;

    const anredeElement = document.getElementById('editLieferAnrede') as HTMLSelectElement;
    const vornameElement = document.getElementById('displayLieferVorname') as HTMLInputElement;
    const nachnameElement = document.getElementById('displayLieferNachname') as HTMLInputElement;
    const plzElement = document.getElementById('displayLieferPLZ') as HTMLInputElement;
    const ortElement = document.getElementById('displayLieferOrt') as HTMLInputElement;
    const strasseElement = document.getElementById('displayLieferStraße') as HTMLInputElement;
    const hnrElement = document.getElementById('displayLieferHnr') as HTMLInputElement;

    const anredeErr = document.querySelector("#anredeErr") as HTMLElement;
    const vornameErr = document.querySelector("#vornameErr") as HTMLElement;
    const nachnameErr = document.querySelector("#nachnameErr") as HTMLElement;
    const strasseErr = document.querySelector("#strasseErr") as HTMLElement;
    const hausnummerErr = document.querySelector("#hausnummerErr") as HTMLElement;
    const postleitzahlErr = document.querySelector("#postleitzahlErr") as HTMLElement;
    const ortErr = document.querySelector("#ortErr") as HTMLElement;

    anredeErr.innerText = "";
    vornameErr.innerText = "";
    nachnameErr.innerText = "";
    strasseErr.innerText = "";
    hausnummerErr.innerText = "";
    postleitzahlErr.innerText = "";
    ortErr.innerText = "";

    try {
        const response = await fetch("/lieferadresse",
            {
                method: "PUT",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    anrede: anredeElement.value.trim(),
                    vorname: vornameElement.value.trim(),
                    nachname: nachnameElement.value.trim(),
                    postleitzahl: plzElement.value.trim(),
                    ort: ortElement.value.trim(),
                    strasse: strasseElement.value.trim(),
                    hnr: hnrElement.value.trim()
                })
            });
        if (response.status == 400 || response.status == 403) {
            const data = await response.json();
            getErrorMessage(data);
            hideden.style.display= "none";
        } else {
            toggleEditLieferadresse(true);
            hideden.style.display="block";
        }
    } catch (e) {

    }
    checkLogin();
    lieferUndRechnungsAdresseRendern()
}

function toggleRechnungsadresse(e: Event) {
    const rechnungsForm = document.getElementById("displayRechnungsadresse");

    //target wird als HTMLInputElement festgelegt
    const target = e.target as HTMLInputElement;

    //Überprüfen, checkbox ausgewählt ist
    if (target.checked) {
        rechnungsForm.classList.remove("d-none");
    } else {
        rechnungsForm.classList.add("d-none");
    }
}

async function createBestellung() {
    const zahlungsMethodePayPal = document.getElementById('zahlungsMethodePayPal') as HTMLInputElement;
    const zahlungsMethodeSofort = document.getElementById('zahlungsMethodeSofort') as HTMLInputElement;

    let selectedValue: string;

    // Überprüfen, welche Zahlungsmethode ausgewählt wurde
    if (zahlungsMethodePayPal.checked) {
        selectedValue = zahlungsMethodePayPal.value;
    } else if (zahlungsMethodeSofort.checked) {
        selectedValue = zahlungsMethodeSofort.value;
    }

    const checkboxRechnung = document.getElementById("checkRechnungsadresse") as HTMLInputElement;
    if (checkboxRechnung.checked) {
        try {
            await updateRechnungsadresse()

        } catch (e) {

        }
    }

    try {
        const response = await fetch("/bestellung", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                zahlungsmethode: selectedValue
            })
        });
        const data = await response.json();

        await getCart();
        if (response.status == 400) {
            alert(data.message);
        } else {
            window.location.href = "DankefürBestellung.html";
        }

    } catch (e) {

    }
}

function bestellabschlussProdukteRender() {
    const bestellabschlussProdukte = document.querySelector("#bestellabschlussProdukte") as HTMLDivElement;
    let endpreis = 0; // Variable für den Gesamtpreis

    // Löscht die Inhalte des Warenkorbmodals
    bestellabschlussProdukte.innerHTML = "";

    for (let i = 0; i < shoppingCart.length; i++) {
        let produkt = shoppingCart[i];
        const subtotal = produkt.preis * produkt.produktMenge; // Teilsumme für das aktuelle Produkt
        endpreis += subtotal; // Teilsumme zum Gesamtpreis hinzufügen

        bestellabschlussProdukte.innerHTML += `
        <div class="row border border-dark rounded mb-4"> 
          <div class="col-4">
            <div class="row">
              <div class="col">
                <img src="${produkt.bilder}" id="imageProdukt" alt="${produkt.produktName}" class="cardpicp card-img-top">
              </div>
            </div>
          </div>
          <div class="col-8 mb-3">
            <div class="row">
              <div class="col-10 mb-4">
                <span class="bree20G">${produkt.produktName}</span>
              </div>
              <div class="col-2 mb-4 text-end">
                <i class="fas fa-solid fa-trash" type="button" data-trash="${produkt.produktName}"></i>
              </div>
              <div class="col-10 mb-4">
                <span>${produkt.kurzbeschreibung}</span>
              </div>
              <div class="col-6 mb-1>
                <label for="menge">Menge: </label>
                <input onKeyDown="return false" type="number" name="menge" min="1" max="${produkt.bestand}" value="${produkt.produktMenge}" data-index="${i}">
                <span id="bestandErr"></span>
              </div>
              <div id="preis${i}" class="col-6 text-end">
                <span>${subtotal.toFixed(2)} €</span>
              </div>
            </div>
          </div>
        </div>
        `;
    }

    bestellabschlussProdukte.innerHTML += `
        <div class="align-items-end">
            <p class="text-end gesamtpreis abstandtop"> Gesamtpreis: ${endpreis.toFixed(2)} €</p>
            <div class="row">
                <div class="col text-end">
                <a id="bestellungAbschliessen" class="col-3 btn btn-primary button1 text-al font16 abstandtop abstandtopbott weiterButtonBestellabschluss">
                    Bestellung abschließen
                </a>
                </div>
            </div>
        </div>`;

    const quantityInputs = document.querySelectorAll("input[name='menge']");
    quantityInputs.forEach((input) => {
        input.addEventListener("change", updatePrice);
    });

    const deleteButtons = document.querySelectorAll(".fa-trash");
    deleteButtons.forEach((button) => {
        button.addEventListener("click", deleteItemFromWarenkorb);
    });
    // document.getElementById("bestellungAbschliessen").addEventListener("click", delAllCartItems);
    document.querySelector("#bestellungAbschliessen").addEventListener("click", function() {
        const agb = document.querySelector("#AGBcheck") as HTMLInputElement;
        const datenschutz = document.querySelector("#Datenschutzcheck") as HTMLInputElement;
        const anredeElement = (document.getElementById('editLieferAnrede') as HTMLSelectElement).value.trim();
        const vornameElement = (document.getElementById('displayLieferVorname') as HTMLInputElement).value.trim();
        const nachnameElement = (document.getElementById('displayLieferNachname') as HTMLInputElement).value.trim();
        const plzElement = (document.getElementById('displayLieferPLZ') as HTMLInputElement).value.trim();
        const ortElement = (document.getElementById('displayLieferOrt') as HTMLInputElement).value.trim();
        const strasseElement = (document.getElementById('displayLieferStraße') as HTMLInputElement).value.trim();
        const hnrElement = (document.getElementById('displayLieferHnr') as HTMLInputElement).value.trim();
        getCart();
        if (shoppingCart.length === 0) {
            BestellungErr();
        }else if (anredeElement === "" || vornameElement === "" || nachnameElement === "" || plzElement === "" || ortElement === "" || strasseElement === "" || hnrElement === ""){
            lieferCheckErr();
        } else if(agb.checked && datenschutz.checked) {
            delAllCartItems();
        } else {
            BestellungCheckErr();
        }
    });
}



