//import axios, {AxiosError, AxiosResponse} from "axios;

interface WarenkorbProdukt{
    produktName: string;
    kurzbeschreibung: string;
    preis:number;
    bilder:string;
    bestand: number;
    produktMenge: number;
}


let modalFensterUser: bootstrap.Modal;
let modalFensterUserLogin: bootstrap.Modal;
let modalFensterWarenkorb: bootstrap.Modal;

let shoppingCart:WarenkorbProdukt[] = [];

document.addEventListener("DOMContentLoaded", () => {
    checkLogin();
    getCart();

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
    getProduct2();


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
        console.log(e)
    }





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
            //Error Ausgabe in Console

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

function erfolgreichChange(){
    document.getElementById("angelegt").innerText= "Nutzer erfolgreich geändert!";
    const toastLiveExample = document.getElementById('erfolgreich');
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
    document.getElementById("warenkorbErfolgreich").innerText= "Produkt dem Warenkorb hinzugefügt!";
    const toastLiveExample = document.getElementById('warenkorbErfolg');
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
        erfolgreichEingeloggt();
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
                                        class="fas fa-shopping-bag bicon bag" data-product-id="${JsonContent[p].ID}" data-productName="${JsonContent[p].Produktname}" onclick="postCart('${JsonContent[p].Produktname.trim()}', 1, 'add')"></i></button>
                            </div>
                        </div>
                </div>
    `

        const bags = document.querySelectorAll(".bag");
        bags.forEach((button) => {
            console.log("🧇");
            button.addEventListener("click", warenkorbErfolgreich);
        });
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

    // Wenn auf shopping cart mehrmals gedrückt wird, wird die zahl in menge um 1 größer
    // Nutzer kann max bis zum Bestand der von getProdukt() kommt Bestellen.
    //Löscht die Inhalte des Warenkorbmodals
    modalFormWarenkorb.innerHTML = "";
    modalFormWarenkorb.innerHTML = `
    <div class="modal-body">
         <div class="row border border-dark rounded">
    `

    for (let i = 0; i < shoppingCart.length; i++) {
        let produkt = shoppingCart[i];
        // @ts-ignore
        modalFormWarenkorb.innerHTML += `
        <div class="modal-body" data-position="${i}">
             <div class="row border border-dark rounded">
                <div class="col-4">
                    <div class="row mt-3">
                        <div class="col">
                            <img src="${produkt.bilder}" id="imageProdukt" alt="Bild" class="placeholdermerkliste img-fluid imgHöhe">
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
                        <span >${produkt.kurzbeschreibung}
                        </span>
                        </div>
                        <div class="col-2 mb-4"></div>
                        <div class="col-6">
                            <label for=menge>Menge: </label>
                            <input type="number" name="menge" min="1" max="${produkt.bestand}" value="${produkt.produktMenge}">
                            <span id="bestandErr"></span>
                        </div>
                        <div id=preis class="col-6 text-end">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `
    }
    modalFormWarenkorb.innerHTML += `
    </div>
            </div>   
            <div class="modal-footer">
                <button id="zurKasse" type="submit" class="btn bbutton">
                    Zur Kasse
                </button>
            </div>
    
    `

    // Finde alle Elemente mit der Klasse ".fa-trash" und füge ein Klickereignis hinzu
    const deleteButtons = document.querySelectorAll(".fa-trash");
    deleteButtons.forEach((button) => {
        button.addEventListener("click", deleteItemFromWarenkorb);
    });


}

async function deleteItemFromWarenkorb(event: Event): Promise<void> {
    const target: HTMLElement = event.target as HTMLElement;
    deleteProductFromCart(target.dataset.trash)
    await getCart();
    warenkorbRender();
}



async function getCart(){
    await fetch("/cart",{
        method: "GET"
    }).then(async (res)=>{
        const data = await res.json();
        shoppingCart = data.warenkorb;

    })
        .catch((e)=>{
        console.log(e)

    })
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

function postCart(produktName,menge, method){
    axios.post("/cart", {
        produktName: produktName,
        produktMenge: menge,
        method: method
    }).then(async () => {
        await getCart();
    });
}