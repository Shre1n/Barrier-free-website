//import axios, {AxiosError, AxiosResponse} from "axios;

let modalFensterUser: bootstrap.Modal;
let modalFensterUserLogin: bootstrap.Modal;
let modalFensterWarenkorb: bootstrap.Modal;
document.addEventListener("DOMContentLoaded", () => {
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
    const cancelEdit= document.querySelector("#cancelEditButton")as HTMLButtonElement;
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

    getUser();
    getProduct();


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

function getErrorMessage(data){
    const firstSpace = data.indexOf(" ");
    const firstword = data.substring(0,firstSpace);
    const caselower = firstword.toLowerCase();
    (document.getElementById(`${caselower}Err`).innerText= data);
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
    console.log("klick");
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
    const logout = (document.querySelector("#abmelden")as HTMLElement);
    const profil= (document.querySelector("#profilseite") as HTMLElement);
    const registrieren= (document.querySelector("#registrieren") as HTMLElement);

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
        if (reason.response.status == 400){
            document.getElementById("loginError").innerText = "Passwort oder Email ist falsch."
        }
        checkLogin();
    });
    checkLogin();
}

function signOff(): void {
    console.log("will abmelden")
    axios.post("/signout").then((res: AxiosResponse) => {
        checkLogin();
        window.location.href = "/startseite.html";
        console.log(res);
        console.log("hab abgemeldet")
    }).catch((reason: AxiosError) => {
        console.log(reason);
    });
    checkLogin();

}

function getUser(){

    axios.get("/user",{

    }).then((res:AxiosResponse) => {
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
    console.log("Wird jetzt angezeigt");
    getUser();
    UserEditForm.style.display = "none";
    UserProfilForm.style.display = "block";

}
function getProduct(){
    axios.get("/product",{

    }).then((res:AxiosResponse) => {
        console.log("Hier Produkt");
        const productData = res.data;
        console.log(productData);
        startseiteRender(productData);
        renderGamesVerteiler(productData);
        console.log(res);
    });
    checkLogin();
}
function renderGamesVerteiler(productData){
    checkLogin();
    console.log(productData);
    const spiele = document.querySelector("#spieleAuflistung") as HTMLDivElement;
    let p;
    const JsonContent =productData
    console.log(JsonContent);
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
                                    <h5 class="card-title font40 cardfont">${JsonContent[p].Produktname}<br/><span id="price">${JsonContent[p].Preis}€</span>
                                    </h5>
                                </div>
                                </a>
                                <button type="button" class="btn btn-primary bbuttoncard"><i
                                        class="fas fa-shopping-bag bicon bag" id="${JsonContent[p].ID}"></i></button>
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