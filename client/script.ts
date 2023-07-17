//import axios, {AxiosError, AxiosResponse} from "axios;
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



let modalFensterUser: bootstrap.Modal;
let modalFensterUserLogin: bootstrap.Modal;
let modalFensterWarenkorb: bootstrap.Modal;

let shoppingCart:Object[] = [];

document.addEventListener("DOMContentLoaded", () => {
    checkLogin();
    try {
        getCart().then(r => {});
    } catch (e) {
        console.log(e)
    }

    try {
        modalFensterUser = new bootstrap.Modal(document.getElementById("ModalUser"));
        modalFensterUserLogin = new bootstrap.Modal(document.getElementById("ModalUserLogin"));
        modalFensterWarenkorb = new bootstrap.Modal(document.getElementById("ModalWarenkorb"));
    } catch (e) {
        console.log(e)
    }
    const registrieren = document.querySelector("#registrieren") as HTMLElement;
    const signupform = document.querySelector("#signupform");
    const loginform = document.querySelector("#loginform");
    const abmelden = document.querySelector("#abmelden");
    const deleteUser = document.querySelector("#nutzerlöschenbutton") as HTMLElement;
    const deletecheck = document.querySelector("#userdeletecheck") as HTMLElement;
    const editButtonUser = (document.querySelector("#editIconUser") as HTMLElement);
    const saveEdit = document.querySelector("#saveEdit") as HTMLButtonElement;
    const cancelEdit = document.querySelector("#cancelEditButton") as HTMLButtonElement;
    const zurKasseBtn = document.querySelector("#zurKasse") as HTMLElement;
    let warenkorb = document.querySelector("#warenkorb");
    try {
        warenkorb.addEventListener("click", () => {
            warenkorbRender();
        });
    } catch (e) {
        console.log(e)
    }

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
        loginform.addEventListener("click", () =>{
            modalFensterUser.hide();
            modalFensterUserLogin.show();
        });
    }
    if (warenkorb){
        warenkorb.addEventListener("click", ()=>{
            modalFensterWarenkorb.show();
        })
    }

    if (deleteUser){
        deleteUser.addEventListener("click", () => {
           deleteUser.style.display = "none";
           deletecheck.style.display = "block";
        });
    }

    try {
        getUser();
        getProduct();
        getProduct2();
    } catch (e) {
        console.log(e)
    }

    //Alle Listener für die Bestellseite
    try {
        lieferUndRechnungsAdresseRendern();
        //enable input
        document.getElementById("editLieferadresseBtn").addEventListener("click", () => {
            toggleEditLieferadresse(false)
        });
        document.getElementById("lieferAdBtnCancel").addEventListener("click", () => {
            toggleEditLieferadresse(true);
            lieferUndRechnungsAdresseRendern();
        });
        document.getElementById("postLieferadresseForm").addEventListener("submit", updateLieferAdresse);
        document.getElementById("checkRechnungsadresse").addEventListener("change", toggleRechnungsadresse);
        document.getElementById("bestellungAbschliessen").addEventListener("click", createBestellung);
      //  document.getElementById("bestellungAbschliessen").addEventListener("click", toggleDanke);


    } catch (e) {
        console.log(e)
    }


    try {
        zurKasseBtn.addEventListener("click", () => {
            window.location.href = "bestellabschluss.html"
        })
    } catch (e) {
        console.log(e)
    }

    try {
        document.getElementById("warenkorb").addEventListener("click", () => {
            getCart();
        });

        getUser();
        getProduct();
    } catch (e) {
        console.log(e)
    }

    document.getElementById("modalForm").addEventListener("submit", addUser);
    document.getElementById("modalFormlogin").addEventListener("submit", signIn);
    abmelden.addEventListener("click", signOff);
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
    })



    // Nur auf Profilseite oder ganz UNTEN!
    deletecheck.addEventListener("click", delUser);
});

function addUser(event: Event): void {
    event.preventDefault();
    const form: HTMLFormElement = event.target as HTMLFormElement;

    const anredeErr = document.querySelector("#anredeErr") as HTMLElement;
    const vornameErr = document.querySelector("#vornameErr")as HTMLElement;
    const nachnameErr = document.querySelector("#nachnameErr")as HTMLElement;
    const emailErr = document.querySelector("#emailErr")as HTMLElement;
    const telefonnummerErr = document.querySelector("#telefonnummerErr")as HTMLElement;
    const strasseErr = document.querySelector("#strasseErr")as HTMLElement;
    const hausnummerErr = document.querySelector("#hausnummerErr")as HTMLElement;
    const postleitzahlErr = document.querySelector("#postleitzahlErr")as HTMLElement;
    const ortErr = document.querySelector("#ortErr")as HTMLElement;
    const passwortErr = document.querySelector("#passwortErr")as HTMLElement;
    const passwortCheckErr = document.querySelector("#passwortCheckErr")as HTMLElement;

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
            modalFensterUser.hide();
            //reset der Form zum Eintragen
            form.reset();
            document.getElementById("registrierenError").innerText = "";
        }).catch((reason: AxiosError) => {
            getErrorMessage(reason.response.data);
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
        document.getElementById("registrierenError").innerText = "Passwörter stimmen nicht überein.";
    }
}

function getErrorMessage(data){
    const firstSpace = data.indexOf(" ");
    const firstword = data.substring(0,firstSpace);
    const caselower = firstword.toLowerCase();
    (document.getElementById(`${caselower}Err`).innerText= data);

    const toastLiveExample = document.getElementById('liveToast');
    const toast = new bootstrap.Toast(toastLiveExample)
    toast.show();
}

function erfolgreich(){
    document.getElementById("angelegt").innerText= "Nutzer erfolgreich geändert!";
    const toastLiveExample = document.getElementById('erfolgreich');
    const toast = new bootstrap.Toast(toastLiveExample);
    toast.show();
}


function delUser(event: Event): void {
    event.preventDefault();
    axios.delete(`/deleteUser`).then((res: AxiosResponse) => {

        signOff();
        window.location.href = "/startseite.html";
    }).catch((reason: AxiosError) => {

    });
}

function editUser(event: Event): void {
    event.preventDefault();
    const form: HTMLFormElement = event.target as HTMLFormElement;

    const toastLiveExample = document.getElementById('liveToast');
    const toast = new bootstrap.Toast(toastLiveExample);
    toast.show();

    const anredeErr = document.querySelector("#anredeErr") as HTMLElement;
    const vornameErr = document.querySelector("#vornameErr")as HTMLElement;
    const nachnameErr = document.querySelector("#nachnameErr")as HTMLElement;
    const emailErr = document.querySelector("#emailErr")as HTMLElement;
    const telefonnummerErr = document.querySelector("#telefonnummerErr")as HTMLElement;
    const strasseErr = document.querySelector("#strasseErr")as HTMLElement;
    const hausnummerErr = document.querySelector("#hausnummerErr")as HTMLElement;
    const postleitzahlErr = document.querySelector("#postleitzahlErr")as HTMLElement;
    const ortErr = document.querySelector("#ortErr")as HTMLElement;
    const editCheck = document.querySelector("#angelegt")as HTMLElement;


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

    const anrede: String = (document.getElementById("anredeNeu") as HTMLInputElement).value;
    const vorname: String = (document.getElementById("displayvornameEdit") as HTMLInputElement).value;
    const nachname: String = (document.getElementById("displaynachnameEdit") as HTMLInputElement).value;
    const postleitzahl: String = (document.getElementById("displayPLZEdit") as HTMLInputElement).value;
    const email: String = (document.getElementById("displayemailEdit") as HTMLInputElement).value;
    const ort: String = (document.getElementById("displayortEdit") as HTMLInputElement).value;
    const strasse: String = (document.getElementById("displaystrasseEdit") as HTMLInputElement).value;
    const hnr: String = (document.getElementById("displayhausnummerEdit") as HTMLInputElement).value;
    const telefonnummer: String = (document.getElementById("displaytelefonnummerEdit") as HTMLInputElement).value;
    const checkbox = document.querySelector("#checkNewsletterNeu") as HTMLInputElement;
    const UserEditForm = document.querySelector("#editUser") as HTMLElement;
    const UserProfilForm = document.querySelector("#profilUser") as HTMLElement;

    if (vorname === ""){
        vornameErr.innerText = "Dieses Feld darf nicht leer sein!";
    }
    if (nachname === ""){
        nachnameErr.innerText = "Dieses Feld darf nicht leer sein!";
    }
    if (postleitzahl === ""){
        postleitzahlErr.innerText = "Dieses Feld darf nicht leer sein!";
    }
    if (ort === ""){
        ortErr.innerText = "Dieses Feld darf nicht leer sein!";
    }
    if (strasse === ""){
        strasseErr.innerText = "Dieses Feld darf nicht leer sein!";
    }if (hnr === ""){
        hausnummerErr.innerText = "Dieses Feld darf nicht leer sein!";
    }
    if (telefonnummer === ""){
        telefonnummerErr.innerText = "Dieses Feld darf nicht leer sein!";
    }

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
            erfolgreich();
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
            erfolgreich();
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

function signIn(event: Event): void {
    event.preventDefault();
    const form: HTMLFormElement = event.target as HTMLFormElement;

    const email: string = (document.getElementById("emaillogin") as HTMLInputElement).value;
    const passwort: string = (document.getElementById("passwortlogin") as HTMLInputElement).value;
    const logout = (document.querySelector("#abmelden")as HTMLElement);
    const profil= (document.querySelector("#profilseite") as HTMLElement);
    const registrieren= (document.querySelector("#registrieren") as HTMLElement);

    axios.post("/signin", {
        email: email,
        passwort: passwort
    }).then((res: AxiosResponse) => {

        modalFensterUserLogin.hide();
        logout.style.display = "inline-block";
        profil.style.display = "inline-block";
        registrieren.style.display = "none";
        form.reset();
        document.getElementById("loginError").innerText = "";
        checkLogin();
    }).catch((reason: AxiosError) => {
        if (reason.response.status == 400){
            document.getElementById("loginError").innerText = "Email oder Passwort ist falsch."
        }
        checkLogin();
    });
    checkLogin();
}

function signOff(): void {
    axios.post("/signout").then((res: AxiosResponse) => {
        checkLogin();
        window.location.href = "/startseite.html";
    }).catch((reason: AxiosError) => {
    });
    checkLogin();

}

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
    try {
        const response = await fetch("/login",
            {
                method:"GET"
            });
        const data = await response.json();

        if(response.status == 200) {
            const rolle = data.rolle;

            abmelden.classList.remove("d-none");
            registrieren.style.display="none";
            profil.style.display="inline-block";
        } else {
            abmelden.classList.add("d-none");

        }
    } catch (e) {
        console.log(e)
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
function getProduct2(){
    axios.get("/product",{

    }).then((res:AxiosResponse) => {
        console.log("Hier Produkt");
        const productData = res.data;
        if (productData.Bestand === ""){
            document.getElementById("bestandErr").innerHTML = "Produkt nicht mehr Verfügbar!";
        }
        console.log(productData);
        startseiteRender(productData);
        renderGamesVerteiler(productData);
        console.log(res);
    });
    checkLogin();
}


function renderGamesVerteiler(productData){
    const spiele = document.querySelector("#spieleAuflistung") as HTMLDivElement;
    let p;
    const JsonContent = productData;
    for (p = 0; p < JsonContent.length; p++) {
        const productID = JsonContent[p].ID;
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
                                    <i class="fas fa-circle availability"></i>
                                    <h5 class="card-title font40 cardfont" data-product-id="${JsonContent[p].Produktname}">${JsonContent[p].Produktname}<br/><span data-product-id="${JsonContent[p].Preis}">${JsonContent[p].Preis}€</span>
                                    </h5>
                                </div>
                                </a>
                                <button type="button" class="btn btn-primary bbuttoncard"><i
                                        class="fas fa-shopping-bag bicon bag" data-product-id="${JsonContent[p].ID}" data-productName="${JsonContent[p].Produktname}" onclick="putCart('${JsonContent[p].Produktname.trim()}', 1, 'add')"></i></button>
                            </div>
                        </div>
                </div>
    `
    }
}


function startseiteRender(productData) {
    checkLogin();
    console.log("StartseiteRender");
    console.log(productData);
    const startseiteRender = document.querySelector("#startseiteRender") as HTMLDivElement;
    const JsonContent = productData;
    console.log(JsonContent);

    let htmlContent = "";

    for (let i = 0; i < JsonContent.length - 2; i++) {
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
              <i class="fas fa-circle availability"></i>
              <h5 class="card-title font40 cardfont">${JsonContent[i].Produktname}<br/>${JsonContent[i].Preis}</h5>
            </div>
            <button type="button" class="btn btn-primary bbuttoncard">
              <i class="fas fa-shopping-bag bicon bag" id="${JsonContent[i].ID}"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    }
    checkLogin();
    startseiteRender.innerHTML = htmlContent;
}




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
              <div class="col">
                <img src="${produkt.bilder}" id="imageProdukt" alt="${produkt.name}" class="placeholdermerkliste img-fluid imgHöhe">
              </div>
            </div>
          </div>
          <div class="col-8 mb-3">
            <div class="row imgHöhe">
              <div class="col-10 mb-4">
                <span class="bree20G">${produkt.produktName}</span>
              </div>
              <div class="col-2 mb-4">
                <i class="fas fa-solid fa-trash" type="button" data-trash="${produkt.produktName}"></i>
              </div>
              <div class="col-10 mb-4">
                <span>${produkt.kurzbeschreibung}</span>
              </div>
              <div class="col-2 mb-4"></div>
              <div class="col-6">
                <label for="menge">Menge: </label>
                <input type="number" name="menge" min="1" max="${produkt.bestand}" value="${produkt.produktMenge}" data-index="${i}">
                <span id="bestandErr"></span>
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
        input.addEventListener("input", updatePrice);
    });

    const deleteButtons = document.querySelectorAll(".fa-trash");
    deleteButtons.forEach((button) => {
        button.addEventListener("click", deleteItemFromWarenkorb);
    });
}

function updatePrice(event) {
    const input = event.target;
    const quantity = parseInt(input.value);
    const index = input.dataset.index;
    const produkt = shoppingCart[index];
    const subtotal = produkt.preis * quantity;
    const priceElement = document.getElementById(`preis${index}`);
    priceElement.innerHTML = `<span>${subtotal.toFixed(2)} €</span>`;

    // Speichern der Preisänderung mit putCart
    putCart(produkt.produktName, quantity, "change");

    calculateTotalPrice();
}

function calculateTotalPrice() {
    let endpreis = 0;

    const priceElements = document.querySelectorAll("[id^='preis']");
    priceElements.forEach((element) => {
        const subtotalText = element.textContent;
        const subtotal = parseFloat(subtotalText);
        endpreis += subtotal;
    });

    const endpreisElement = document.getElementById("summe");
    if (endpreisElement) {
        endpreisElement.innerHTML = `${endpreis.toFixed(2)} €`;
    }
}

async function deleteItemFromWarenkorb(event: Event): Promise<void> {
    const target: HTMLElement = event.target as HTMLElement;
        deleteProductFromCart(target.dataset.trash)
        await getCart();
        warenkorbRender();
}



async function getCart(){
    await axios.get("/cart",{

    }).then((res:AxiosResponse) => {
        shoppingCart = res.data;
    });
    checkLogin();
}

function putCart(produktName,menge, method)  {

    axios.put("/cart", {
        produktName: produktName,
        produktMenge: menge,
        method: method
    }).then(async () => {
        await getCart();
    });
}

function deleteProductFromCart(productName) {
    axios
        .delete(`/cart/${productName}`)
        .then(() => {})
        .catch((error) => {
            // Fehler beim Löschen des Produkts
            console.error("Fehler beim Löschen des Produkts aus dem Warenkorb", error);
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
        console.log("GetBestellung!!!!!!!");
        console.log(res);
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
        } else {

        }
    } catch (e) {
        console.log(e)
    }

}

// Attempt
async function updateRechnungsadresse() {
    const anredeElement = document.getElementById('displayRechnungAnrede') as HTMLSelectElement;
    const vornameElement = document.getElementById('displayRechnungVorname') as HTMLInputElement;
    const nachnameElement = document.getElementById('displayRechnungNachname') as HTMLInputElement;
    const plzElement = document.getElementById('displayRechnungPLZ') as HTMLInputElement;
    const ortElement = document.getElementById('displayRechnungOrt') as HTMLInputElement;
    const strasseElement = document.getElementById('displayRechnungStraße') as HTMLInputElement;
    const hnrElement = document.getElementById('displayRechnungHnr') as HTMLInputElement;
    try {
        const response = await fetch("/rechnungsadresse",
            {
                method: "PUT",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    anrede: anredeElement.value,
                    vorname: vornameElement.value,
                    nachname: nachnameElement.value,
                    postleitzahl: plzElement.value,
                    ort: ortElement.value,
                    strasse: strasseElement.value,
                    hnr: hnrElement.value
                })
            });

        if (response.status == 400) {
            alert(response.body)
        }
    } catch (e) {
        console.log(e)
    }
    checkLogin();

}


function toggleEditLieferadresse(toggle: boolean) {
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
    } else {
        button.classList.remove("d-none");
        button2.classList.remove("d-none");
        anredeElement.classList.remove("d-none");
        anredeDisplayElement.classList.add("d-none");
    }
}


async function updateLieferAdresse(e: Event) {
    e.preventDefault();
    const anredeElement = document.getElementById('editLieferAnrede') as HTMLSelectElement;
    const vornameElement = document.getElementById('displayLieferVorname') as HTMLInputElement;
    const nachnameElement = document.getElementById('displayLieferNachname') as HTMLInputElement;
    const plzElement = document.getElementById('displayLieferPLZ') as HTMLInputElement;
    const ortElement = document.getElementById('displayLieferOrt') as HTMLInputElement;
    const strasseElement = document.getElementById('displayLieferStraße') as HTMLInputElement;
    const hnrElement = document.getElementById('displayLieferHnr') as HTMLInputElement;

    try {
        const response = await fetch("/lieferadresse",
            {
                method: "PUT",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    anrede: anredeElement.value,
                    vorname: vornameElement.value,
                    nachname: nachnameElement.value,
                    postleitzahl: plzElement.value,
                    ort: ortElement.value,
                    strasse: strasseElement.value,
                    hnr: hnrElement.value
                })
            });
        if (response.status == 400) {
            alert(response.body)
        } else {
            toggleEditLieferadresse(true);

        }

    } catch (e) {
        console.log(e)
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


const zahlungsMethodePayPal = document.getElementById('zahlungsMethodePayPal') as HTMLInputElement;
const zahlungsMethodeSofort = document.getElementById('zahlungsMethodeSofort') as HTMLInputElement;

// Event-Listener für das Absenden des Formulars
document.addEventListener('submit', (event) => {
    event.preventDefault();

    let selectedValue: string | null = null;

    // Überprüfen, welche Zahlungsmethode ausgewählt wurde
    if (zahlungsMethodePayPal.checked) {
        selectedValue = zahlungsMethodePayPal.value;
    } else if (zahlungsMethodeSofort.checked) {
        selectedValue = zahlungsMethodeSofort.value;
    }

    if (selectedValue) {
        // Zahlungsmethode an den Server senden
        fetch('/savePaymentMethod', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ paymentMethod: selectedValue })
        })
            .then(response => {
                if (response.ok) {
                    console.log('Zahlungsmethode erfolgreich gespeichert.');
                } else {
                    console.log('Fehler beim Speichern der Zahlungsmethode.');
                }
            })
            .catch(error => {
                console.error('Fehler:', error);
            });
    } else {
        console.log('Keine Zahlungsmethode ausgewählt.');
    }
});



async function createBestellung() {
//TODO Updates der adressen auslagern. nur die eigenen funktionen nutzen!!!!!!

    const checkboxRechnung = document.getElementById("checkRechnungsadresse") as HTMLInputElement;
    if (checkboxRechnung.checked) {
        try {
            await updateRechnungsadresse()

        } catch (e) {
            console.log(e)
        }
    }

    try {
        const response = await fetch("/bestellung", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({})
        });
        const data = await response.json();

    } catch (e) {
        console.log(e)
    }
    /*
        const dankeContainer = document.getElementById('dankeContainer');
        const bestellungContainer = document.getElementById('bestellungContainer');


        dankeContainer.style.display = 'block';
        bestellungContainer.style.display = 'none';
        document.getElementById("dankeContainer").classList.remove("d-none");
    */
}