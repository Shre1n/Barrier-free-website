//import axios, {AxiosError, AxiosResponse} from "axios;

let modalFensterUser: bootstrap.Modal;
let modalFensterUserLogin: bootstrap.Modal;
document.addEventListener("DOMContentLoaded", () => {
    checkLogin();
    modalFensterUser = new bootstrap.Modal(document.getElementById("ModalUser"));
    modalFensterUserLogin = new bootstrap.Modal(document.getElementById("ModalUserLogin"));
    const registrieren = document.querySelector("#registrieren") as HTMLElement;
    const signupform = document.querySelector("#signupform");
    const loginform = document.querySelector("#loginform");
    const abmelden = document.querySelector("#abmelden");
    const deleteUser = document.querySelector("#nutzerlöschenbutton") as HTMLElement;
    const deletecheck = document.querySelector("#userdeletecheck") as HTMLElement;
    const editButtonUser = (document.querySelector("#editIconUser") as HTMLElement);
    const saveEdit = document.querySelector("#saveEdit") as HTMLButtonElement;
    const cancelEdit= document.querySelector("#cancelEditButton")as HTMLButtonElement;
    //const spiele = document.querySelector("#spiele") as HTMLButtonElement;
    const produkteAnzeigen = document.querySelector("#produkteanzeigen") as HTMLButtonElement;
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
    //spiele.addEventListener("click", getProduct);
    produkteAnzeigen.addEventListener("click", getProduct);
    editButtonUser.addEventListener("click", (event: Event) => {
        const UserEditForm = document.querySelector("#editUser") as HTMLElement;
        const UserProfilForm = document.querySelector("#profilUser") as HTMLElement;
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
    console.log("klick")
    const form: HTMLFormElement = event.target as HTMLFormElement;

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
    console.log("Wird jetzt angezeigt")
    UserEditForm.style.display = "none";
    UserProfilForm.style.display = "block";

}
function getProduct(){
    axios.get("/product",{

    }).then((res:AxiosResponse) => {
        console.log("Hier Produkt");
        const productData = res.data;
        console.log(productData);
        renderGames(productData);
        console.log(res);
    });
}
function renderGames(productData){
    console.log(productData);
    const spiele = document.querySelector("#spieleAuflistung") as HTMLDivElement;

    const JsonContent =productData
    console.log(JsonContent);
    for (let p = 0; JsonContent.length; p++) {
    spiele.innerHTML=`
    <div class="col">
                    <div class="col cardindex">
                        <div class="card cardbp">
                            <div class="container-fluid merken">
                                <i class="far fa-bookmark bookmarks bicon"></i>
                                <img src="${JsonContent[p].Bilder}}" class="card-img-top cardpicp"
                                     alt="placeholder">
                            </div>
                            <div class="card-body">
                                <div class="container cardword">
                                    <i class="fas fa-circle availability"></i>
                                    <h5 class="card-title font40 cardfont">${JsonContent[p].ProduktName}<br/><span id="price">${JsonContent[p].Preis}</span>
                                    </h5>
                                </div>
                                <button type="button" class="btn btn-primary bbuttoncard"><i
                                        class="fas fa-shopping-bag bicon bag"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
    `
    }
}











/*function bilderwechsel(smallImg){
    const fullImg = document.getElementById("bildtactiletowers");
    smallImg.addEventListener("click", () => {
        fullImg.src = smallImg.src;
    })
}*/
