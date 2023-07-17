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
document.addEventListener("DOMContentLoaded", () => {
    checkLogin();
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
    // attempt   const weiterButtonBestellung = (document.querySelector("#weiterButtonBestellung") as HTMLElement);
    const saveEdit = document.querySelector("#saveEdit") as HTMLButtonElement;
    const cancelEdit = document.querySelector("#cancelEditButton") as HTMLButtonElement;
    const zurKasseBtn = document.querySelector("#zurKasse") as HTMLElement;
    let warenkorb = document.querySelector("#warenkorb");

    if (registrieren) {
        registrieren.addEventListener("click", () => {
            modalFensterUserLogin.show();
            console.log(document.getElementById("modalForm"));
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
    saveEdit.addEventListener("click", editUser);
    cancelEdit.addEventListener("click", hideEditUser);

    editButtonUser.addEventListener("click", (event: Event) => {
        const UserEditForm = document.querySelector("#editUser") as HTMLElement;
        const UserProfilForm = document.querySelector("#profilUser") as HTMLElement;
        getUser();
        console.log("Wird jetzt angezeigt")
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
            console.log(res);
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
            modalFensterUser.hide();
            console.log(res);
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
    } else {
        document.getElementById("registrierenError").innerText = "Passwörter stimmen nicht überein.";
    }
}

function getErrorMessage(data) {
    const firstSpace = data.indexOf(" ");
    const firstword = data.substring(0, firstSpace);
    const caselower = firstword.toLowerCase();
    (document.getElementById(`${caselower}Err`).innerText = data);
}


function delUser(event: Event): void {
    event.preventDefault();
    console.log("Möchte Löschen")
    axios.delete(`/deleteUser`).then((res: AxiosResponse) => {
        console.log(res);
        signOff();
        window.location.href = "/startseite.html";
    }).catch((reason: AxiosError) => {
        console.log(reason);
    });
}

function editUser(event: Event): void {
    event.preventDefault();
    const form: HTMLFormElement = event.target as HTMLFormElement;

    const anredeErr = document.querySelector("#anredeErr") as HTMLElement;
    const vornameErr = document.querySelector("#vornameErr") as HTMLElement;
    const nachnameErr = document.querySelector("#nachnameErr") as HTMLElement;
    const emailErr = document.querySelector("#emailErr") as HTMLElement;
    const telefonnummerErr = document.querySelector("#telefonnummerErr") as HTMLElement;
    const strasseErr = document.querySelector("#strasseErr") as HTMLElement;
    const hausnummerErr = document.querySelector("#hausnummerErr") as HTMLElement;
    const postleitzahlErr = document.querySelector("#postleitzahlErr") as HTMLElement;
    const ortErr = document.querySelector("#ortErr") as HTMLElement;


    anredeErr.innerText = "";
    vornameErr.innerText = "";
    nachnameErr.innerText = "";
    emailErr.innerText = "";
    telefonnummerErr.innerText = "";
    strasseErr.innerText = "";
    hausnummerErr.innerText = "";
    postleitzahlErr.innerText = "";
    ortErr.innerText = "";

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
            hideEditUser();
            console.log(res);
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
            console.log(res);
            getUser();
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
    const logout = (document.querySelector("#abmelden") as HTMLElement);
    const profil = (document.querySelector("#profilseite") as HTMLElement);
    const registrieren = (document.querySelector("#registrieren") as HTMLElement);

    console.log("dhewhui");
    axios.post("/signin", {
        email: email,
        passwort: passwort
    }).then((res: AxiosResponse) => {
        console.log(res);
        console.log(email + " " + passwort + " ist angemeldet.");
        modalFensterUserLogin.hide();
        logout.style.display = "inline-block";
        profil.style.display = "inline-block";
        registrieren.style.display = "none";
        form.reset();
        document.getElementById("loginError").innerText = "";
        checkLogin();
    }).catch((reason: AxiosError) => {
        if (reason.response.status == 400) {
            document.getElementById("loginError").innerText = "Passwort oder Email ist falsch."
        }
        checkLogin();
    });
    checkLogin();
}

function signOff(): void {
    console.log("will abmelden")
    axios.post("/signout").then((res: AxiosResponse) => {
        window.location.href = "/startseite.html";
        console.log(res);
        console.log("hab abgemeldet")
    }).catch((reason: AxiosError) => {
        console.log(reason);
    });
    checkLogin();

}

function getUser() {
    axios.get("/user", {}).then((res: AxiosResponse) => {
        console.log("Hier");
        const userData = res.data;
        console.log(userData);
        if (userData.rollenid === 3) {
            renderUserProfile(userData);
            renderUserEdit(userData);
        }
        console.log(res);
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
                method: "GET"
            });
        const data = await response.json();

        if (response.status == 200) {
            const rolle = data.rolle;

            abmelden.classList.remove("d-none");
            registrieren.style.display = "none";
            profil.style.display = "inline-block";
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

function hideEditUser() {
    const UserEditForm = document.querySelector("#editUser") as HTMLElement;
    const UserProfilForm = document.querySelector("#profilUser") as HTMLElement;
    console.log("Wird jetzt angezeigt");
    getUser();
    UserEditForm.style.display = "none";
    UserProfilForm.style.display = "block";

}

function getProduct() {
    axios.get("/product", {}).then((res: AxiosResponse) => {
        console.log("Hier Produkt");
        const productData = res.data;
        console.log(productData);
        startseiteRender(productData);
        renderGamesVerteiler(productData);
        console.log(res);
    });
    checkLogin();
}

function renderGamesVerteiler(productData) {
    checkLogin();
    console.log(productData);
    const spiele = document.querySelector("#spieleAuflistung") as HTMLDivElement;
    let p;
    const JsonContent = productData
    console.log(JsonContent);
    for (p = 0; p < JsonContent.length; p++) {
        const productID = JsonContent[p].ID;
        spiele.innerHTML += `
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
                                    <h5 class="card-title font40 cardfont">${JsonContent[p].Produktname}<br/><span id="price">${JsonContent[p].Preis}€</span>
                                    </h5>
                                </div>
                                </a>
                                <button type="button" class="btn btn-primary bbuttoncard"><i
                                        class="fas fa-shopping-bag bicon bag" id="${JsonContent[p].ID}" onclick="putCart('${JsonContent[p].Produktname.trim()}', 1, 'add')"></i></button>
                            </div>
                        </div>
                </div>
    `
    }
    checkLogin();
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
    // startseiteRender.innerHTML = htmlContent;
}


function getCart() {
    axios.get("/cart", {}).then((res: AxiosResponse) => {

        console.log(res);
    });
    checkLogin();
}

function putCart(produktName, menge, method) {

    axios.put("/cart", {
        produktName: produktName,
        produktMenge: menge,
        method: method
    }).then((res: AxiosResponse) => {

        console.log(res);
    });
}


/* Funktion ist später dazu da die Produkte auf der Detailseite anzuzeigen
function renderGamesDetail(event){
    event.preventDefault();

    console.log("irgendwas rein");

    const productId = event.target.getAttribute("data-product-id");
    //Detailseite mit einem Div versehen
    const detailseite = document.querySelector("#detailseitedisplay") as HTMLDivElement;
    console.log(productId);


        detailseite.innerHTML=`
    <div class="container-fluid abstandtop">
    <div class="row">
        <div class="col-6">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-12">
                        <div class="img-container">
                        <img id="bildtactiletowers" src="${productId[0].Bilder}" class="img-fluid" alt="${productId[0].Produktname}">
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="row justify-content-center">
                            <div class="col-2">
                            </div>
                            <div class="col-2 produktbillderklein">
                                <img src="/img/tactiletowers1.png"">
                            </div>
                            <div class="col-2 produktbillderklein">
                                <img src="/img/tactiletowers2.png">
                            </div>
                            <div class="col-2 produktbillderklein">
                                <img src="/img/tactiletowers3.png">
                            </div>
                            <div class="col-2 produktbillderklein">
                                <img src="/img/tactiletowers4.png">
                            </div>
                            <div class="col-2">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-6">
            <div class="row">
                <div class="col-1"></div>
                <div class="col-9 bree40G">
                    ${productId[0].Produktname}
                </div>
                <div class="col-2">
                    <i class="far fa-bookmark bookmarks bicon"></i>
                </div>
            </div>
            <div class="row">
                <div class="col-1"></div>
                <div class="col-9">
                    <i class="fas fa-star stern"></i><i class="fas fa-star stern"></i><i class="fas fa-star stern"></i><i class="fas fa-star stern"></i>
                </div>
                <div class="col-2"></div>
            </div>
            <div class="row">
                <div class="col-1"></div>
                <div class="col-9 belleza15G mt-3">
                    ${productId[0].Kurzbeschreibung}
                </div>
                <div class="col-2"></div>
            </div>
            <div class="row">
                <div class="col-1"></div>
                <div class="col-6">
                    Button
                </div>
                <div class="col-4 text-end bree40G">
                    ${productId[0].Preis}
                </div>
                <div class="col-1"></div>
                <div class="col-1"></div>
                <div class="col-6">
                    Button2
                </div>
                <div class="col-4 text-end">
                    <i id="avilabilityIcon" class="fas fa-circle availability"></i> Auf Lager
                </div>
                <div class="col-1"></div>
            </div>
            <div class="row">
                <div class="col-1"></div>
                <div class="col-5">
                    <button id="expresscheckout" type="submit" class="btn btn-primary bbutton">
                        Expresscheckout
                    </button>
                </div>
                <div class="col-5">
                    <button id="warenkorbdetail" type="submit" class="btn btn-primary bbutton">
                        Warenkorb
                    </button>
                </div>
                <div class="col-1"></div>
            </div>
        </div>
    </div>
</div>

<div class="container-fluid mt-5">
    <div class="row ms-3 me-3">
        <div class="col-1 mb-3"></div>
        <div class="col-10 mb-3 bree40G">
            Produktbeschreibung
        </div>
        <div class="col-1 mb-3"></div>
        <div class="col-1 mb-3"></div>
        <div class="col-10 belleza25 mb-5">
            ${productId[0].Produktbeschreibung}
        </div>
        <div class="col-1 mb-3"></div>
        <div class="col-1 mb-3"></div>
        <div class="col-10 mb-3 bree40G">
            Lieferumfang
        </div>
        <div class="col-1 mb-3"></div>
        <div class="col-1 mb-3"></div>
        <div class="col-10 belleza25">
         ${productId[0].Lieferumfang}
        </div>
        <div class="col-1 mb-3"></div>
    </div>
</div>
    `
    console.log (productId[0]);
}
*/


/*function bilderwechsel(smallImg){
    const fullImg = document.getElementById("bildtactiletowers");
    smallImg.addEventListener("click", () => {
        fullImg.src = smallImg.src;
    })
}*/


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
/*
function toggleDanke(e: Event) {
    const dankeBestellContainer = document.getElementById("dankeContainer");
    const bestellungContainer = document.getElementById('dankeContainer') as HTMLElement;


    dankeBestellContainer.classList.remove("d-none");
    bestellungContainer.classList.add("d-none");
}
*/