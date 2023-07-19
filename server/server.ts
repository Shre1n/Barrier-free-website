import * as express from "express";
import * as session from "express-session";
import * as mysql from "mysql";
import * as crypto from "crypto";
import * as path from "path";
import Joi = require('joi');
import * as cluster from "cluster";
import {func, string} from "joi";

//Install Displayable Chart option

class Adresse {
    anrede: string;
    vorname: string;
    nachname: string;
    postleitzahl: string;
    ort: string;
    strasse: string;
    hnr: string;
}

class WarenkorbProdukt {
    produktName: string;
    kurzbeschreibung: string;
    preis: number;
    bilder: string;
    bestand: number;
    produktMenge: number;
}

const warenkorbArray: WarenkorbProdukt[] = [];

// Ergänzt/Überlädt den Sessionstore
declare module "express-session" {
    //Das Interface deklariert, was in der Session erhalten sein muss
    interface Session {
        email: string;
        passwort: string;
        id: string;
        rollenid: number;
        cart: Object[];
        nutzerid: number;
        lieferadresse: Adresse;
        rechnungsadresse: Adresse;
        nutzerId: number;
        bestellID: number;
    }
}


// Klassen definieren: Nutzer erstellen und Constructor für Nutzer


const PORT: number = 8080;

const app: express.Express = express();
const connection: mysql.Connection = mysql.createConnection({
    database: "team-01",
    user: "team-01",
    host: "ip1-dbs.mni.thm.de",
    password: "CrWlwQ3]!PyDbLC)"
});

// Datenbankverbindung zu MySQL-Datenbank
connection.connect((err) => {
    if (err === null) {
        console.log("Datenbank erfolgreich verbunden.");
    } else {
        console.log("DB-Fehler: " + err);
    }
});

// Session config und Cookie
app.use(session({
    cookie: {
        maxAge: 60 * 60 * 1000,
        sameSite: true,
        secure: false
    },
    secret: Math.random().toString(),
    resave: false,
    saveUninitialized: true,
}))


// Server starten
app.listen(PORT, () => {
    console.log("Server gestartet unter http://localhost:" + PORT);
});


// Pfade
// Der Ordner ../client/ wird auf die URL /res gemapped
app.use(express.static(__dirname + "/../client/"));

app.use("/img", express.static(__dirname + "/../img/"));


// GET-Routen
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/../client/startseite.html'));

});



//JSON und URLenconded
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Pfade der Websites


//Nutzer Routen
app.post("/user", postUser);
app.put("/user", checkLogin, putUser);
app.delete("/deleteUser", checkLogin, deleteUser);
app.post("/bewertungen", checkLogin);
app.get("/user", checkLogin, getUser);
app.post("/signin", signIn);
app.post("/signout", signOut);
app.post("/product", postProduct);
app.get("/product", getProduct);
app.get("/addons", getAddons);
app.get("/spareparts", getSpareParts);
app.put("/product/:name", editProduct);
app.delete("/product/:name", deleteProduct);
app.get("/bewertungen/:name", getProductRating);
app.get("/login", checkLogin, isLoggedIn)
app.put("/lieferadresse", checkLogin, putLieferadresse);
app.put("/rechnungsadresse", checkLogin, putRechnungsadresse);
app.post("/bestellung", checkLogin, postBestellung);
app.get("/bestellung", checkLogin, getBestellung);
app.delete("/deleteAll", checkLogin, deleteCartAll);

app.get("/cart", checkLogin, getCart);
app.post("/cart", checkLogin, itemAlreadyInCart, postCart);
app.delete("/cart/:productName", checkLogin, deleteCart);
app.put("/cart", checkLogin, putCart);


//SITE
// Angezeigte Webseite



/**
 * @api {post} /user Neuen Benutzer erstellen
 * @apiName postUser
 * @apiGroup Nutzer
 *
 * @apiParam {String} anrede Anrede oder Anrede des Benutzers (z. B. 'Herr', 'Frau', 'Divers'). Erforderlich.
 * @apiParam {String} vorname Vorname des Benutzers. Erforderlich.
 * @apiParam {String} nachname Nachname des Benutzers. Erforderlich.
 * @apiParam {String} email E-Mail-Adresse des Benutzers. Muss im System eindeutig sein. Erforderlich.
 * @apiParam {String} passwort Passwort des Benutzers. Erforderlich.
 * @apiParam {String} postleitzahl Postleitzahl der Adresse des Benutzers. Erforderlich.
 * @apiParam {String} ort Stadt oder Ort der Adresse des Benutzers. Erforderlich.
 * @apiParam {String} strasse Straßenname der Adresse des Benutzers. Erforderlich.
 * @apiParam {String} hnr Hausnummer der Adresse des Benutzers. Erforderlich.
 * @apiParam {String} telefonnummer Telefonnummer des Benutzers. Erforderlich.
 * @apiParam {String} [newsletter] Gibt an, ob der Benutzer den Newsletter abonniert hat oder nicht. Optional.
 *
 * @apiSuccess (201) {String} message Erfolgsmeldung, die angibt, dass der Benutzer erstellt wurde: "Benutzer registriert!".
 *
 * @apiError (400) {String} AnredeErforderlich Fehlermeldung, die angibt, dass das Feld 'anrede' erforderlich ist.
 * @apiError (400) {String} VornameErforderlich Fehlermeldung, die angibt, dass das Feld 'vorname' erforderlich ist.
 * @apiError (400) {String} NachnameErforderlich Fehlermeldung, die angibt, dass das Feld 'nachname' erforderlich ist.
 * @apiError (400) {String} EmailErforderlich Fehlermeldung, die angibt, dass das Feld 'email' erforderlich ist.
 * @apiError (400) {String} PasswortErforderlich Fehlermeldung, die angibt, dass das Feld 'passwort' erforderlich ist.
 * @apiError (400) {String} PostleitzahlErforderlich Fehlermeldung, die angibt, dass das Feld 'postleitzahl' erforderlich ist.
 * @apiError (400) {String} OrtErforderlich Fehlermeldung, die angibt, dass das Feld 'ort' erforderlich ist.
 * @apiError (400) {String} StrasseErforderlich Fehlermeldung, die angibt, dass das Feld 'strasse' erforderlich ist.
 * @apiError (400) {String} HnrErforderlich Fehlermeldung, die angibt, dass das Feld 'hnr' erforderlich ist.
 * @apiError (400) {String} TelefonnummerErforderlich Fehlermeldung, die angibt, dass das Feld 'telefonnummer' erforderlich ist.
 * @apiError (400) {String} EmailBereitsVorhanden Fehlermeldung, die angibt, dass die angegebene E-Mail-Adresse bereits im System existiert.
 * @apiError (400) {String} EtwasIstSchiefGelaufen Fehlermeldung, die angibt, dass bei der Benutzererstellung etwas schief gelaufen ist.
 *
 */
function postUser(req: express.Request, res: express.Response): void {
    const anrede: string = req.body.anrede;
    const vorname: string = req.body.vorname;
    const nachname: string = req.body.nachname;
    const email: string = req.body.email;
    const passwort: string = req.body.passwort;
    const postleitzahl: string = req.body.postleitzahl;
    const ort: string = req.body.ort;
    const strasse: string = req.body.strasse;
    const hnr: string = req.body.hnr;
    const telefonnummer: string = req.body.telefonnummer;
    const newsletter: string = req.body.newsletter

    const {error} = validateUser(false, req.body);

    if (error) {
        res.status(403).json(error.details[0].message);
        console.log(error.details[0].message);
    } else {
        const cryptopass: string = crypto.createHash("sha512").update(passwort).digest("hex");

        const data: [string, string, string, string, string, string, string, string, string, string, string] = [
            anrede,
            vorname,
            nachname,
            email,
            cryptopass,
            postleitzahl,
            ort,
            strasse,
            hnr,
            telefonnummer,
            newsletter
        ];

        const newQuery: string = 'INSERT INTO Nutzerliste (Anrede, Vorname, Nachname, Email, Passwort, Postleitzahl, Ort, Straße, HausNr, Telefonnummer,Newsletter) VALUES (?,?,?,?,?,?,?,?,?,?,?);'

        connection.query(newQuery, data, (err, result) => {
            if (err) {
                //Anstatt des Servers wird die Datenbank gefragt, ob die Email schon vorhanden ist
                if (err.code === "ER_DUP_ENTRY") {
                    res.status(400).send("Email schon existent.");
                } else {
                    console.log("postUser: " + err);
                    res.status(400);
                    res.send("Etwas ist schief gelaufen. :(");
                }
            } else {
                if (result === 0) {
                    res.status(400);
                    res.send("result action");
                } else {
                    res.status(201);
                    res.send("User registriert!");
                }

            }
        });
    }
}

function postCeo(req: express.Request, res: express.Response): void {

}

function postAdmin(req: express.Request, res: express.Response): void {

}

/**
 * @api {get} /user Informationen des Benutzers abrufen
 * @apiName GetUser
 * @apiGroup Nutzer
 *
 * @apiSuccess {String} anrede Anrede des Benutzers (z. B. 'Herr', 'Frau', 'Divers').
 * @apiSuccess {String} vorname Vorname des Benutzers.
 * @apiSuccess {String} nachname Nachname des Benutzers.
 * @apiSuccess {String} email E-Mail-Adresse des Benutzers.
 * @apiSuccess {String} passwort Passwort des Benutzers (hashed).
 * @apiSuccess {String} postleitzahl Postleitzahl der Adresse des Benutzers.
 * @apiSuccess {String} ort Stadt oder Ort der Adresse des Benutzers.
 * @apiSuccess {String} strasse Straßenname der Adresse des Benutzers.
 * @apiSuccess {String} hnr Hausnummer der Adresse des Benutzers.
 * @apiSuccess {String} telefonnummer Telefonnummer des Benutzers.
 * @apiSuccess {Boolean} newsletter Gibt an, ob der Benutzer den Newsletter abonniert hat oder nicht.
 * @apiSuccess {Number} rollenid Rollen-ID des Benutzers.
 *
 * @apiError (500) {String} EtwasIstSchiefGelaufen Fehlermeldung, die angibt, dass bei der Datenbankabfrage etwas schief gelaufen ist.
 *
 */

function getUser(req: express.Request, res: express.Response): void {

    query("SELECT * FROM Nutzerliste WHERE Email = ?", [req.session.email])
        .then((result: any) => {
            res.status(200);
            res.json({
                anrede: result[0].Anrede,
                vorname: result[0].Vorname,
                nachname: result[0].Nachname,
                email: result[0].Email,
                passwort: result[0].Passwort,
                postleitzahl: result[0].Postleitzahl,
                ort: result[0].Ort,
                strasse: result[0].Straße,
                hnr: result[0].HausNr,
                telefonnummer: result[0].Telefonnummer,
                newsletter: result[0].Newsletter,
                rollenid: result[0].RollenID
            })
        })
        .catch((err: mysql.MysqlError) => {
            res.sendStatus(500);
            console.log(err);
        })
}

/**
 * @api {put} /user Benutzerinformationen bearbeiten
 * @apiName EditUser
 * @apiGroup Nutzer
 *
 * @apiParam {String} anrede Anrede des Benutzers (z. B. 'Herr', 'Frau', 'Divers').
 * @apiParam {String} vorname Vorname des Benutzers.
 * @apiParam {String} nachname Nachname des Benutzers.
 * @apiParam {String} postleitzahl Postleitzahl der Adresse des Benutzers.
 * @apiParam {String} ort Stadt oder Ort der Adresse des Benutzers.
 * @apiParam {String} strasse Straßenname der Adresse des Benutzers.
 * @apiParam {String} hnr Hausnummer der Adresse des Benutzers.
 * @apiParam {String} telefonnummer Telefonnummer des Benutzers.
 * @apiParam {Boolean} newsletter Gibt an, ob der Benutzer den Newsletter abonniert hat oder nicht.
 *
 * @apiSuccess (200) {String} message Erfolgsmeldung, dass der Benutzer erfolgreich bearbeitet wurde.
 *
 * @apiError (403) {String} UngültigeEingabe Fehlermeldung, die angibt, dass die Eingabe des Benutzers ungültig ist.
 * @apiError (500) {String} EtwasIstSchiefGelaufen Fehlermeldung, die angibt, dass bei der Datenbankabfrage etwas schief gelaufen ist.
 */

function putUser(req: express.Request, res: express.Response): void {

    const anrede: string = req.body.anrede;
    const vorname: string = req.body.vorname;
    const nachname: string = req.body.nachname;

    const postleitzahl: string = req.body.postleitzahl;
    const ort: string = req.body.ort;
    const strasse: string = req.body.strasse;
    const hnr: string = req.body.hnr;
    const telefonnummer: string = req.body.telefonnummer;
    const newsletter: string = req.body.newsletter;

    const email: string = req.session.email;


    const data: [string, string, string, string, string, string, string, string, string, string] = [anrede, vorname, nachname, postleitzahl, ort, strasse, hnr, telefonnummer, newsletter, email];
    const {error} = validateEditUser(false, req.body);

    if (error) {
        res.status(403).json(error.details[0].message);
        console.log(error.details[0].message);
    } else {
        const query: string = `UPDATE Nutzerliste SET Anrede = ?, Vorname = ?, Nachname = ?, Postleitzahl = ?, Ort = ?, Straße = ?, HausNr = ?, Telefonnummer = ?, Newsletter = ? WHERE Email = ?;`;

        connection.query(query, data, (err, result) => {
            if (err) {
                res.status(500);
                res.send("Etwas ist schiefgelaufen");
            } else {
                res.status(200);
                res.send("Nutzer bearbeitet!");
            }
        });
    }
}

/**
 * @api {delete} /user Benutzer löschen
 * @apiName DeleteUser
 * @apiGroup Nutzer
 *
 * @apiSuccess (200) {String} message Erfolgsmeldung, dass der Benutzer erfolgreich gelöscht wurde.
 *
 * @apiError (500) {String} EtwasIstSchiefGelaufen Fehlermeldung, die angibt, dass bei der Datenbankabfrage etwas schief gelaufen ist.
 */

function deleteUser(req: express.Request, res: express.Response): void {

    const logeedinUser: string = req.session.email;
    const query: string = 'DELETE FROM Nutzerliste WHERE Email = ?;';


    connection.query(query, [logeedinUser], (err, result) => {
        if (err) {
            res.status(500);
            res.send("There went something wrong!");
            console.log("deleteUser" + err);
        } else {
            res.status(200);
            res.send("User successfully deleted!");
        }
    });
}


//Produkt Routen

/**
 * @api {get} /product Request Produkte einer bestimmten Kategorie
 * @apiName GetProduct
 * @apiGroup Produkt
 *
 * @apiParam {Number} kategorieId ID der gewünschten Kategorie.
 *
 * @apiSuccess {Object[]} products Array von Produkten der angegebenen Kategorie.
 * @apiSuccess {Number} products.ID Produkt ID.
 * @apiSuccess {String} products.Produktname Name des Produkts.
 * @apiSuccess {String} products.Beschreibung Beschreibung des Produkts.
 * @apiSuccess {Number} products.Preis Preis des Produkts.
 * @apiSuccess {String} products.Bild URL des Produktbilds.
 *
 * @apiError (500) {Object} error Fehlerobjekt, das angibt, dass bei der Datenbankabfrage etwas schief gelaufen ist.
 * @apiError (500) {String} error.message Fehlermeldung.
 */


function getProduct(req: express.Request, res: express.Response): void {
    const sql = "SELECT * FROM Produktliste WHERE KategorieID = 1";

    // Führe die Datenbankabfrage aus
    connection.query(sql, (err, results) => {
        if (err) {
            // Bei einem Fehler sende eine Fehlerantwort an den Client
            res.status(500).json({error: "Fehler bei der Datenbankabfrage"});
        } else {
            // Bei erfolgreicher Abfrage sende die Ergebnisse an den Client
            res.json(results);
        }
    });
}

/**
 * @api {get} /addons Request Add-Ons einer bestimmten Kategorie
 * @apiName GetAddons
 * @apiGroup Add-On
 *
 * @apiParam {Number} kategorieId ID der gewünschten Kategorie.
 *
 * @apiSuccess {Object[]} addons Array von Add-Ons der angegebenen Kategorie.
 * @apiSuccess {Number} addons.ID Add-On ID.
 * @apiSuccess {String} addons.Produktname Name des Add-Ons.
 * @apiSuccess {String} addons.Beschreibung Beschreibung des Add-Ons.
 * @apiSuccess {Number} addons.Preis Preis des Add-Ons.
 * @apiSuccess {String} addons.Bild URL des Add-On-Bilds.
 *
 * @apiError (500) {Object} error Fehlerobjekt, das angibt, dass bei der Datenbankabfrage etwas schief gelaufen ist.
 * @apiError (500) {String} error.message Fehlermeldung.
 */

function getAddons(req: express.Request, res: express.Response): void {
    const sql = "SELECT * FROM Produktliste WHERE KategorieID = 2";

    // Führe die Datenbankabfrage aus
    connection.query(sql, (err, results) => {
        if (err) {
            // Bei einem Fehler sende eine Fehlerantwort an den Client
            res.status(500).json({error: "Fehler bei der Datenbankabfrage"});
        } else {
            // Bei erfolgreicher Abfrage sende die Ergebnisse an den Client
            res.json(results);
        }
    });
}

/**
 * @api {get} /spareparts Request Ersatzteile einer bestimmten Kategorie
 * @apiName GetSpareParts
 * @apiGroup Spare Parts
 *
 * @apiParam {Number} kategorieId ID der gewünschten Kategorie.
 *
 * @apiSuccess {Object[]} spareParts Array von Ersatzteilen der angegebenen Kategorie.
 * @apiSuccess {Number} spareParts.ID Ersatzteil ID.
 * @apiSuccess {String} spareParts.Produktname Name des Ersatzteils.
 * @apiSuccess {String} spareParts.Beschreibung Beschreibung des Ersatzteils.
 * @apiSuccess {Number} spareParts.Preis Preis des Ersatzteils.
 * @apiSuccess {String} spareParts.Bild URL des Ersatzteil-Bilds.
 *
 * @apiError (500) {Object} error Fehlerobjekt, das angibt, dass bei der Datenbankabfrage etwas schief gelaufen ist.
 * @apiError (500) {String} error.message Fehlermeldung.
 */

function getSpareParts(req: express.Request, res: express.Response): void {
    const sql = "SELECT * FROM Produktliste WHERE KategorieID = 3";

    // Führe die Datenbankabfrage aus
    connection.query(sql, (err, results) => {
        if (err) {
            // Bei einem Fehler sende eine Fehlerantwort an den Client
            res.status(500).json({error: "Fehler bei der Datenbankabfrage"});
        } else {
            // Bei erfolgreicher Abfrage sende die Ergebnisse an den Client
            res.json(results);
        }
    });
}


/**
 * @api {post} /cart Produkt zum Warenkorb hinzufügen
 * @apiName PostCart
 * @apiGroup Cart
 *
 * @apiParam {String} produktName Name des Produkts, das zum Warenkorb hinzugefügt werden soll.
 * @apiParam {Number} produktMenge Menge des Produkts, das zum Warenkorb hinzugefügt werden soll.
 *
 * @apiSuccess (201) {Number} status HTTP-Statuscode 201, der angibt, dass das Produkt erfolgreich zum Warenkorb hinzugefügt wurde.
 *
 * @apiError (404) {Number} status HTTP-Statuscode 404, der angibt, dass das angegebene Produkt nicht gefunden wurde.
 * @apiError (500) {Number} status HTTP-Statuscode 500, der angibt, dass bei der Datenbankabfrage ein Fehler aufgetreten ist.
 */

function postCart(req: express.Request, res: express.Response): void {

    const produktName: string = req.body.produktName;
    const produktMenge: number = req.body.produktMenge;

    query("SELECT * FROM Produktliste WHERE Produktname = ?;", [produktName])
        .then((result: any) => {
            const produktID: number = Number(result[0].ID);
            const newQuery: string = 'INSERT INTO Warenkorb (NutzerID, ProduktID, menge) VALUES (?,?,?);'

            const data: [number, number, number] = [
                req.session.nutzerid,
                produktID,
                produktMenge
            ];

            if (produktID === null || produktMenge === null) {
                res.sendStatus(404);
            }

            query(newQuery, data).then((result: any) => {
                res.sendStatus(201);
            }).catch((e) => {
                console.log(e);
                res.sendStatus(500);
            });


        })
        .catch((e) => {
            console.log(e);
        })


}

/**
 * @api {get} /cart Warenkorb anzeigen
 * @apiName GetCart
 * @apiGroup Cart
 *
 * @apiSuccess (200) {Object[]} warenkorb Array mit den Produkten im Warenkorb.
 * @apiSuccess (200) {String} warenkorb.produktName Name des Produkts im Warenkorb.
 * @apiSuccess (200) {String} warenkorb.kurzbeschreibung Kurzbeschreibung des Produkts im Warenkorb.
 * @apiSuccess (200) {String} warenkorb.bilder Bild des Produkts im Warenkorb.
 * @apiSuccess (200) {Number} warenkorb.preis Preis des Produkts im Warenkorb.
 * @apiSuccess (200) {Number} warenkorb.produktMenge Menge des Produkts im Warenkorb.
 * @apiSuccess (200) {Number} warenkorb.bestand Bestand des Produkts im Warenkorb.
 *
 * @apiError (500) {Number} status HTTP-Statuscode 500, der angibt, dass bei der Datenbankabfrage ein Fehler aufgetreten ist.
 */

function getCart(req: express.Request, res: express.Response): void {
    const warenkorbArray: WarenkorbProdukt[] = [];
    query("SELECT * FROM Warenkorb JOIN Produktliste ON Warenkorb.ProduktID = Produktliste.ID WHERE Warenkorb.NutzerID = ?;", [req.session.nutzerid])
        .then((results: any) => {
            if (results.length !== 0) {
                for (const r of results) {
                    let product: WarenkorbProdukt = new WarenkorbProdukt();
                    product.produktName = r.Produktname;
                    product.kurzbeschreibung = r.Kurzbeschreibung;
                    product.bilder = r.Bilder;
                    product.preis = r.Preis;
                    product.produktMenge = r.Menge;
                    product.bestand = r.Bestand;
                    warenkorbArray.push(product);
                    if (r.Produktname === undefined || r.Produktname === "") {

                        res.sendStatus(404);
                    }

                }
            }
            res.status(200).json({warenkorb: warenkorbArray});
        })
        .catch((e) => {
            console.log(e);
            res.sendStatus(500);
        });
}

/**
 * @api {post} /cart Item zum Warenkorb hinzufügen oder aktualisieren
 * @apiName AddOrUpdateCartItem
 * @apiGroup Cart
 *
 * @apiParam {String} produktName Name des Produkts.
 * @apiParam {String} method Methode zum Hinzufügen/Updaten des Produkts im Warenkorb (z.B. "add").
 * @apiParam {Number} produktMenge Menge des hinzuzufügenden/zu aktualisierenden Produkts.
 *
 * @apiSuccess (200) {String} message Erfolgsmeldung, dass der Warenkorb erfolgreich aktualisiert wurde.
 *
 * @apiError (500) {Number} status HTTP-Statuscode 500, der angibt, dass bei der Datenbankabfrage ein Fehler aufgetreten ist.
 */

function itemAlreadyInCart(req: express.Request, res: express.Response, next: express.NextFunction) {
    const produktName: string = req.body.produktName;
    const produktMethod: string = req.body.method;
    const produktMenge: number = req.body.produktMenge;

    query("SELECT ID, Preis, Bilder, Bestand, Kurzbeschreibung FROM Produktliste WHERE Produktname = ? ", [produktName])
        .then((result: any) => {
            query("SELECT * FROM Warenkorb WHERE NutzerID = ? AND ProduktID = ?;", [req.session.nutzerid, result[0].ID])
                .then((results: any) => {
                    if (results.length == 1) {
                        if (produktMethod === "add") {
                            query("UPDATE Warenkorb SET Menge = Menge + ? WHERE NutzerID = ? AND ProduktID = ?;", [produktMenge, req.session.nutzerid, result[0].ID])
                                .then(() => {
                                    res.status(200).send("Warenkorb geupdatet!");
                                })
                                .catch((e) => {
                                    console.log(e);
                                    res.sendStatus(500);
                                });
                        } else {
                            res.status(500).send("Wähle eine gültige Methode zum updaten des Warenkorbs!");
                        }
                    } else {
                        next();
                    }
                })
                .catch((e) => {
                    console.log(e);
                    res.sendStatus(500);
                });
        }).catch((e) => {
        console.log(e);
        res.sendStatus(500);
    });
}

/**
 * @api {put} /cart Warenkorb aktualisieren
 * @apiName UpdateCart
 * @apiGroup Cart
 *
 * @apiParam {String} produktName Name des zu aktualisierenden Produkts im Warenkorb.
 * @apiParam {Number} produktMenge Neue Menge des zu aktualisierenden Produkts im Warenkorb.
 * @apiParam {String} method Methode zum Aktualisieren des Produkts im Warenkorb (z.B. "change").
 *
 * @apiSuccess (200) {String} message Erfolgsmeldung, dass der Warenkorb erfolgreich aktualisiert wurde.
 *
 * @apiError (400) {Number} status HTTP-Statuscode 400, der angibt, dass Produkt Name oder Produkt Menge fehlerhaft sind.
 * @apiError (403) {Number} status HTTP-Statuscode 403, der angibt, dass die angegebene Menge negativ ist oder den Bestand überschreitet.
 * @apiError (500) {Number} status HTTP-Statuscode 500, der angibt, dass bei der Datenbankabfrage ein Fehler aufgetreten ist.
 */

function putCart(req: express.Request, res: express.Response): void {

    if (req.body.produktName === "" || req.body.produktMenge === "" || isNaN(req.body.produktMenge) || req.body.method === "") {
        res.status(400).send("Produkt Name oder Produkt Menge sind fehlerhaft.");
        return;
    }

    const produktName: string = req.body.produktName;
    const produktMenge: number = req.body.produktMenge;
    const produktMethod: string = req.body.method;

    query("SELECT ID, Preis, Bilder, Bestand, Kurzbeschreibung FROM Produktliste WHERE Produktname = ? ", [produktName])
        .then((result: any) => {
            if (result.length === 1) {
                if (produktMethod == "change") {
                    if (produktMenge < 1 || produktMenge > result[0].bestand) {
                        res.status(403).send("Menge ist negativ oder überschreitet den Bestand.");
                        return;
                    } else {
                        query("UPDATE Warenkorb SET Menge = ? WHERE NutzerID = ? AND ProduktID = ?;", [produktMenge, req.session.nutzerid, result[0].ID])
                            .then(() => {
                                res.status(200).send("Warenkorb geupdatet!")
                            })
                            .catch(() => {
                                res.sendStatus(500);
                            });
                    }
                } else {

                    res.status(500).send("Wähle eine gültige Methode zum updaten des Warenkorbs!");
                }
            } else {
                res.status(500).send("Produkt ist nicht im Warenkorb!");
            }

        }).catch((err) => {
        res.status(500).send("Internal Server Error");
        console.log(err);
    });
}

/**
 * @api {delete} /cart Alle Produkte im Warenkorb löschen
 * @apiName DeleteCartAll
 * @apiGroup Cart
 *
 * @apiSuccess (200) {String} message Erfolgsmeldung, dass alle Produkte im Warenkorb entfernt wurden.
 *
 * @apiError (500) {Number} status HTTP-Statuscode 500, der angibt, dass bei der Datenbankabfrage ein Fehler aufgetreten ist.
 */

function deleteCartAll(req: express.Request, res: express.Response): void {
    query("DELETE FROM Warenkorb WHERE NutzerID = ?;", [req.session.nutzerid])
        .then((result: any) => {
            res.status(200).send("Alle Produkte im Warenkorb wurden entfernt!");
        }).catch((e) => {
        console.log(e);
        res.status(500).send("Fehler beim Warenkorb löschen!");
    });
}

/**
 * @api {delete} /cart/:productName Produkt aus dem Warenkorb löschen
 * @apiName DeleteCartItem
 * @apiGroup Cart
 *
 * @apiParam {String} productName Name des zu löschenden Produkts im Warenkorb.
 *
 * @apiSuccess (200) {String} message Erfolgsmeldung, dass das Produkt aus dem Warenkorb gelöscht wurde.
 *
 * @apiError (500) {Number} status HTTP-Statuscode 500, der angibt, dass bei der Datenbankabfrage ein Fehler aufgetreten ist.
 */

function deleteCart(req: express.Request, res: express.Response): void {
    const productNameToDelete: string = req.params.productName;
    query("SELECT ID FROM Produktliste WHERE Produktname = ? ", [productNameToDelete])
        .then((result: any) => {
            query("DELETE FROM Warenkorb WHERE ProduktID = ? AND NutzerID = ?;", [result[0].ID, req.session.nutzerid])
                .then(() => {
                    res.status(200).send("Produkt aus Warenkorb gelöscht!");
                })
                .catch((e) => {
                    console.log(e);
                    res.status(500).send("Fehler bei der Produktauswahl!");
                });
        }).catch((e) => {
        console.log(e);
        res.status(500).send("Fehler bei der Produktauswahl!");
    });

}

function postProduct(req: express.Request, res: express.Response): void {

}

function editProduct(req: express.Request, res: express.Response): void {

}

function deleteProduct(req: express.Request, res: express.Response): void {

}

function getAllRatings(req: express.Request, res: express.Response): void {

}

function getProductRating(req: express.Request, res: express.Response): void {

}

// User Sign In

// Prüft, ob ein Nutzer registriert ist und speichert ggf. den Nutzernamen im Sessionstore ab

/**
 * @api {post} /signin Nutzer anmelden
 * @apiName SignIn
 * @apiGroup Authentication
 *
 * @apiParam {String} email E-Mail-Adresse des Nutzers.
 * @apiParam {String} passwort Passwort des Nutzers.
 *
 * @apiSuccess (200) {String} message Erfolgsmeldung, dass der Nutzer erfolgreich angemeldet wurde.
 *
 * @apiError (400) {Number} status HTTP-Statuscode 400, der angibt, dass die Anmeldeinformationen ungültig sind.
 * @apiError (500) {Number} status HTTP-Statuscode 500, der angibt, dass bei der Datenbankabfrage ein Fehler aufgetreten ist.
 */

function signIn(req: express.Request, res: express.Response): void {
    const email: string = req.body.email;
    const passwort: string = req.body.passwort;
    const cryptopass: string = crypto.createHash("sha512").update(passwort).digest("hex");
    if (email !== undefined && passwort !== undefined) {
        query("SELECT ID, Vorname, Nachname FROM Nutzerliste WHERE Email = ? AND Passwort = ?;", [email, cryptopass]).then((result: any) => {
            query("SELECT * FROM Nutzerliste WHERE Email = ? AND Passwort = ?;", [email, cryptopass]).then((result: any) => {
                if (result.length === 1) {
                    req.session.email = email;
                    req.session.passwort = cryptopass;
                    req.session.cart = [];
                    req.session.nutzerid = result[0].ID;
                    req.session.nutzerId = result[0].ID;

                    const anrede: string = result[0].Anrede;
                    const vorname: string = result[0].Vorname;
                    const nachname: string = result[0].Nachname;
                    const postleitzahl: string = result[0].Postleitzahl;
                    const ort: string = result[0].Ort;
                    const strasse: string = result[0].Straße;
                    const hnr: string = result[0].HausNr;

                    const lieferadresse: Adresse = new Adresse();
                    lieferadresse.anrede = anrede;
                    lieferadresse.vorname = vorname;
                    lieferadresse.nachname = nachname;
                    lieferadresse.postleitzahl = postleitzahl;
                    lieferadresse.ort = ort;
                    lieferadresse.strasse = strasse;
                    lieferadresse.hnr = hnr;
                    req.session.lieferadresse = lieferadresse;

                    const rechnungsadresse: Adresse = new Adresse();
                    rechnungsadresse.anrede = anrede;
                    rechnungsadresse.vorname = vorname;
                    rechnungsadresse.nachname = nachname;
                    rechnungsadresse.postleitzahl = postleitzahl;
                    rechnungsadresse.ort = ort;
                    rechnungsadresse.strasse = strasse;
                    rechnungsadresse.hnr = hnr;
                    req.session.rechnungsadresse = rechnungsadresse;
                    req.session.cart = [];
                    res.sendStatus(200);
                } else {
                    console.log("500 in else");
                    res.sendStatus(400);
                }
            }).catch(() => {
                console.log("500 in catch");
                res.sendStatus(500);
            });
        })
    }
}


// User meldet sich ab -> Session wird gelöscht
// Löscht den Sessionstore und weist den Client an, das Cookie zu löschen

/**
 * @api {get} /signout Nutzer abmelden
 * @apiName SignOut
 * @apiGroup Authentication
 *
 * @apiSuccess (200) {String} message Erfolgsmeldung, dass der Nutzer erfolgreich abgemeldet wurde.
 */


function signOut(req: express.Request, res: express.Response): void {
    req.session.destroy(() => {
            res.clearCookie("connect.sid");
            res.sendStatus(200);
        }
    );

}

/**
 * @api {get} /checklogin Prüfe ob der Nutzer eingeloggt ist
 * @apiName CheckLogin
 * @apiGroup Authentication
 *
 * @apiSuccess (200) {String} message Erfolgsmeldung, dass der Nutzer eingeloggt ist.
 *
 * @apiError (401) {String} message Fehlermeldung, dass der Nutzer nicht eingeloggt ist.
 */

function checkLogin(req: express.Request, res: express.Response, next: express.NextFunction): void {
    if (req.session.email !== undefined) {
        next();
    } else {
        res.status(401);
        res.send("User is not logged in! ");
    }
}

function disableUser(req: express.Request, res: express.Response): void {

}

/**
 * @api {post} /validateUser Validiere Nutzerdaten
 * @apiName ValidateUser
 * @apiGroup Authentication
 *
 * @apiParam {Boolean} isPut Gibt an, ob es sich um eine Aktualisierung (POST) handelt.
 * @apiParam {Object} user Nutzerdaten, die validiert werden sollen.
 *
 * @apiSuccess (200) {Object} value Validierte Nutzerdaten.
 *
 * @apiError (400) {String} message Fehlermeldung, dass die Nutzerdaten ungültig sind.
 */

function validateUser(isPost, user) {
    const schemaPost = Joi.object({
        anrede: Joi.string()
            .pattern(/^(Herr|Frau|Divers)$/)
            .message("Anrede ist nur Herr oder Frau erlaubt.")
            .required(),
        vorname: Joi.string()
            .pattern(/^[A-Za-zäöüÄÖÜß-]+(?:\s[A-Za-zäöüÄÖÜß]+)*$/)
            .message("Vorname darf nur aus Buchstaben bestehen und muss mind. 2 Buchstaben lang sein.")
            .min(2)
            .required(),
        nachname: Joi.string()
            .pattern(/^[A-Za-zäöüÄÖÜß-]{2,}(?:\s[A-Za-zäöüÄÖÜß]+)*$/)
            .message("Nachname darf nur aus Buchstaben bestehen und muss mind. 2 Buchstaben lang sein.")
            .min(2)
            .required(),
        email: Joi.string()
            // Email pattern Sonderzeichen sind NOCH erlaubt
            .pattern(/^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z-_]{2,}$/)
            .message("Email akzeptiert keine Umlaute (ä, ö, ü) oder andere Sonderzeichen nach dem @. Nach dem Punkt dürfen höchsten drei Buchstaben folgen.")
            .min(2)
            .required(),
        passwort: Joi.string()
            .pattern(/.{3,}/)
            .message("Passwort muss größer als 3 Zeichen sein.")
            .required(),
        postleitzahl: Joi.string()
            .pattern(/^[0-9]{1,5}$/)
            .message("Postleitzahl muss zwischen 1-5 Zahlen lang sein und darf nur Zahlen beinhalten.")
            .min(1)
            .max(5)
            .required(),
        ort: Joi.string()
            .pattern(/^[A-Za-zäöüÄÖÜß]+(?:[-\s][A-Za-zäöüÄÖÜß]+)*$/)
            .message("Ort darf keine Zahlen enthalten und muss mind. 2 Buchstaben lang sein.")
            .min(2)
            .required(),
        strasse: Joi.string()
            .pattern(/^[A-Za-zäöüÄÖÜß\s]+(?:\s[A-Za-zäöüÄÖÜß]+)*$/)
            .message("Strasse darf keine Zahlen und Sonderzeichen enthalten und muss mind. 2 Buchstaben lang sein.")
            .min(2)
            .required(),
        hnr: Joi.string()
            .pattern((/^\d[\w:-]*$/))
            .message("Hausnummer muss mit einer Zahl beginnen und mindestens eine Zahl enthalten. Appartment geben Sie bitte mit : an. Des Weiteren darf kein Leerzeichen verwendet werden.")
            .min(1)
            .max(20)
            .required(),
        telefonnummer: Joi.string()
            .pattern(/^(\+\d{5,})$|^(0\d{4,})$/)
            .message("Telefonnummer muss mit einer 0 oder einem + beginnen und muss mind. 5 Zahlen beinhalten. Die Telefonnummer darf nur aus Zahlen bestehen.")
            .required(),
        newsletter: Joi.string()
            .pattern(/^(Ja|Nein)$/)
    });

    return schemaPost.validate(user);
}

/**
 * @api {post} /validateUser Validiere Nutzerdaten
 * @apiName ValidateUser
 * @apiGroup Authentication
 *
 * @apiParam {Boolean} isPut Gibt an, ob es sich um eine Aktualisierung (PUT) handelt.
 * @apiParam {Object} user Nutzerdaten, die validiert werden sollen.
 *
 * @apiSuccess (200) {Object} value Validierte Nutzerdaten.
 *
 * @apiError (400) {String} message Fehlermeldung, dass die Nutzerdaten ungültig sind.
 */

function validateEditUser(isPut, user) {
    const schemaPUT = Joi.object({
        anrede: Joi.string()
            .pattern(/^(Herr|Frau|Divers)$/)
            .message("Anrede ist nur Herr oder Frau erlaubt.")
            .required(),
        vorname: Joi.string()
            .pattern(/^[A-Za-zäöüÄÖÜß-]+(?:\s[A-Za-zäöüÄÖÜß]+)*$/)
            .message("Vorname darf nur aus Buchstaben bestehen und muss mind. 2 Buchstaben lang sein.")
            .min(2)
            .required(),
        nachname: Joi.string()
            .pattern(/^[A-Za-zäöüÄÖÜß-]{2,}(?:\s[A-Za-zäöüÄÖÜß]+)*$/)
            .message("Nachname darf nur aus Buchstaben bestehen und muss mind. 2 Buchstaben lang sein.")
            .min(2)
            .required(),
        email: Joi.string()
            .pattern(/^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z-_]{2,}$/)
            .message("Email akzeptiert keine Umlaute (ä, ö, ü) oder andere Sonderzeichen nach dem @. Nach dem Punkt dürfen höchsten drei Buchstaben folgen.")
            .min(2)
            .required(),
        postleitzahl: Joi.string()
            .pattern(/^[0-9]{1,5}$/)
            .message("Postleitzahl muss zwischen 1-5 Zahlen lang sein und darf nur Zahlen beinhalten.")
            .min(1)
            .max(5)
            .required(),
        ort: Joi.string()
            .pattern(/^[A-Za-zäöüÄÖÜß]+(?:[-\s][A-Za-zäöüÄÖÜß]+)*$/)
            .message("Ort darf keine Zahlen enthalten und muss mind. 2 Buchstaben lang sein.")
            .min(2)
            .required(),
        strasse: Joi.string()
            .pattern(/^[A-Za-zäöüÄÖÜß\s]+(?:\s[A-Za-zäöüÄÖÜß]+)*$/)
            .message("Strasse darf keine Zahlen und Sonderzeichen enthalten und muss mind. 2 Buchstaben lang sein.")
            .min(2)
            .required(),
        hnr: Joi.string()
            .pattern((/^\d[\w:-]*$/))
            .message("Hausnummer muss mit einer Zahl beginnen und mindestens eine Zahl enthalten. Appartment geben Sie bitte mit : an. Des Weiteren darf kein Leerzeichen verwendet werden.")
            .min(1)
            .max(20)
            .required(),
        telefonnummer: Joi.string()
            .pattern(/^(\+\d{5,})$|^(0\d{4,})$/)
            .message("Telefonnummer muss mit einer 0 oder einem + beginnen und muss mind. 5 Zahlen beinhalten. Die Telefonnumer darf nur aus Zahlen bestehen.")
            .required(),
        newsletter: Joi.string()
            .pattern(/^(Ja|Nein)$/)
    });

    return schemaPUT.validate(user);
}



// Ein eigener Wrapper, um die MySQL-Query als Promise (then/catch Syntax) zu nutzen
function query(sql: string, param: any[] = []): Promise<any> {
    return new Promise<any>((resolve: any, reject: any) => {
        connection.query(sql, param, (err: mysql.MysqlError | null, results: any) => {
            if (err === null) {
                resolve(results);
            } else {
                reject(err);
            }
        });
    });
}

// Kleine Hilfsfunktion, die immer 200 OK zurückgibt

/**
 * @api {get} /isLoggedIn Prüfe ob Nutzer eingeloggt ist
 * @apiName IsLoggedIn
 * @apiGroup Authentication
 *
 * @apiSuccess (200) {String} message Bestätigung, dass der Nutzer eingeloggt ist.
 * @apiSuccess (200) {String} user Email des eingeloggten Nutzers.
 * @apiSuccess (200) {Number} rolle Rollen-ID des eingeloggten Nutzers.
 *
 * @apiError (401) {String} message Fehlermeldung, dass der Nutzer nicht eingeloggt ist.
 */

function isLoggedIn(req: express.Request, res: express.Response): void {
    res.status(200).send({message: "Nutzer ist noch eingeloggt", user: req.session.email, rolle: req.session.rollenid});
}


/**
 * @api {put} /putLieferadresse Lieferadresse aktualisieren
 * @apiName PutLieferadresse
 * @apiGroup Adressen
 *
 * @apiParam {String} anrede Anrede des Nutzers (Herr/Frau/Divers).
 * @apiParam {String} vorname Vorname des Nutzers.
 * @apiParam {String} nachname Nachname des Nutzers.
 * @apiParam {String} postleitzahl Postleitzahl des Nutzers.
 * @apiParam {String} ort Ort des Nutzers.
 * @apiParam {String} strasse Straße des Nutzers.
 * @apiParam {String} hnr Hausnummer des Nutzers.
 *
 * @apiSuccess (200) {String} message Bestätigung, dass die Lieferadresse aktualisiert wurde.
 *
 * @apiError (400) {String} message Fehlermeldung, dass alle Felder ausgefüllt werden müssen.
 * @apiError (403) {String} message Fehlermeldung bei Validierungsfehlern (z.B. fehlerhafte Eingabe).
 */

function putLieferadresse(req: express.Request, res: express.Response) {
    const anrede: string = req.body.anrede;
    const vorname: string = req.body.vorname;
    const nachname: string = req.body.nachname;
    const postleitzahl: string = req.body.postleitzahl;
    const ort: string = req.body.ort;
    const strasse: string = req.body.strasse;
    const hnr: string = req.body.hnr;

    if (anrede == undefined || vorname == undefined || nachname == undefined || postleitzahl == undefined || ort == undefined || strasse == undefined || hnr == undefined || anrede.trim() == "" || vorname.trim() == "" || nachname.trim() == "" || postleitzahl.trim() == "" || ort.trim() == "" || strasse.trim() == "" || hnr.trim() == "") {
        res.status(400);
        res.json({message: "Fülle alle Felder aus!"});
    } else {

        const lieferadresse: Adresse = new Adresse();
        lieferadresse.anrede = anrede;
        lieferadresse.vorname = vorname;
        lieferadresse.nachname = nachname;
        lieferadresse.postleitzahl = postleitzahl;
        lieferadresse.ort = ort;
        lieferadresse.strasse = strasse;
        lieferadresse.hnr = hnr;
        const rechnungsadresse: Adresse = new Adresse();
        rechnungsadresse.anrede = anrede;
        rechnungsadresse.vorname = vorname;
        rechnungsadresse.nachname = nachname;
        rechnungsadresse.postleitzahl = postleitzahl;
        rechnungsadresse.ort = ort;
        rechnungsadresse.strasse = strasse;
        rechnungsadresse.hnr = hnr;


        const {error} = validateAdress(lieferadresse);

        if (error) {
            res.status(403).json(error.details[0].message);
            console.log(error.details[0].message);
        } else {
            req.session.lieferadresse = lieferadresse;
            req.session.rechnungsadresse = rechnungsadresse;
            res.sendStatus(200);
        }
    }
}

/**
 * @api {put} /putRechnungsadresse Rechnungsadresse aktualisieren
 * @apiName PutRechnungsadresse
 * @apiGroup Adressen
 *
 * @apiParam {String} anrede Anrede des Nutzers (Herr/Frau/Divers).
 * @apiParam {String} vorname Vorname des Nutzers.
 * @apiParam {String} nachname Nachname des Nutzers.
 * @apiParam {String} postleitzahl Postleitzahl des Nutzers.
 * @apiParam {String} ort Ort des Nutzers.
 * @apiParam {String} strasse Straße des Nutzers.
 * @apiParam {String} hnr Hausnummer des Nutzers.
 *
 * @apiSuccess (200) {String} message Bestätigung, dass die Rechnungsadresse aktualisiert wurde.
 *
 * @apiError (400) {String} message Fehlermeldung, dass alle Felder ausgefüllt werden müssen.
 * @apiError (403) {String} message Fehlermeldung bei Validierungsfehlern (z.B. fehlerhafte Eingabe).
 */

function putRechnungsadresse(req: express.Request, res: express.Response) {
    const anrede: string = req.body.anrede;
    const vorname: string = req.body.vorname;
    const nachname: string = req.body.nachname;
    const postleitzahl: string = req.body.postleitzahl;
    const ort: string = req.body.ort;
    const strasse: string = req.body.strasse;
    const hnr: string = req.body.hnr;

    if (anrede == undefined || vorname == undefined || nachname == undefined || postleitzahl == undefined || ort == undefined || strasse == undefined || hnr == undefined || anrede.trim() == "" || vorname.trim() == "" || nachname.trim() == "" || postleitzahl.trim() == "" || ort.trim() == "" || strasse.trim() == "" || hnr.trim() == "") {
        res.status(400);
        res.json({message: "Fülle alle Felder aus!"});
    } else {

        const rechnungsadresse: Adresse = new Adresse();
        rechnungsadresse.anrede = anrede;
        rechnungsadresse.vorname = vorname;
        rechnungsadresse.nachname = nachname;
        rechnungsadresse.postleitzahl = postleitzahl;
        rechnungsadresse.ort = ort;
        rechnungsadresse.strasse = strasse;
        rechnungsadresse.hnr = hnr;

        const {error} = validateAdress(rechnungsadresse);

        if (error) {
            res.status(403).json(error.details[0].message);
            console.log(error.details[0].message);
        } else {
            req.session.rechnungsadresse = rechnungsadresse;
            res.sendStatus(200);
        }
    }

}

/**
 * @api {post} /postBestellung Bestellung abschließen
 * @apiName PostBestellung
 * @apiGroup Bestellung
 *
 * @apiParam {String} zahlungsmethode Die gewählte Zahlungsmethode (PayPal, SofortUeberweisung).
 *
 * @apiSuccess (200) {String} message Bestätigung, dass die Bestellung erfolgreich abgeschlossen wurde.
 *
 * @apiError (400) {String} message Fehlermeldung, dass der Warenkorb leer ist oder eine ungültige Zahlungsmethode gewählt wurde.
 * @apiError (500) {String} message Fehlermeldung, dass ein interner Serverfehler aufgetreten ist.
 */

function postBestellung(req: express.Request, res: express.Response) {


    const anredeL: string = req.session.lieferadresse.anrede;
    const vornameL: string = req.session.lieferadresse.vorname;
    const nachnameL: string = req.session.lieferadresse.nachname;
    const postleitzahlL: string = req.session.lieferadresse.postleitzahl;
    const ortL: string = req.session.lieferadresse.ort;
    const strasseL: string = req.session.lieferadresse.strasse;
    const hnrL: string = req.session.lieferadresse.hnr;
    const anredeR: string = req.session.rechnungsadresse.anrede;
    const vornameR: string = req.session.rechnungsadresse.vorname;
    const nachnameR: string = req.session.rechnungsadresse.nachname;
    const postleitzahlR: string = req.session.rechnungsadresse.postleitzahl;
    const ortR: string = req.session.rechnungsadresse.ort;
    const strasseR: string = req.session.rechnungsadresse.strasse;
    const hnrR: string = req.session.rechnungsadresse.hnr;
    const date = new Date().toISOString().split('T')[0];
    const zahlungsmethode = req.body.zahlungsmethode;


    query("SELECT * FROM Warenkorb JOIN Produktliste ON Warenkorb.ProduktID = Produktliste.ID WHERE Warenkorb.NutzerID = ?;", [req.session.nutzerid])
        .then((results: any) => {
            for (const r of results) {
                let product: WarenkorbProdukt = new WarenkorbProdukt();
                product.produktName = r.Produktname;
                product.kurzbeschreibung = r.Kurzbeschreibung;
                product.bilder = r.Bilder;
                product.preis = r.Preis;
                product.produktMenge = r.Menge;
                product.bestand = r.Bestand;
                warenkorbArray.push(product);
                if (r.Produktname === undefined || r.Produktname === "") {

                    res.sendStatus(404);
                }
            }
            if (results.length === 0) {
                res.status(400).json({message: "Mit leerem Warenkorb kann keine Bestellung abgeschlossen werden!"})
            } else {
                if (zahlungsmethode == "PayPal" || zahlungsmethode == "SofortUeberweisung") {
                    const param: [string, string, string, string, string, string, string, string, string, string, string, string, string, string, number, string, string, string] = [anredeL, vornameL, nachnameL, postleitzahlL, ortL, strasseL, hnrL, anredeR, vornameR, nachnameR, postleitzahlR, ortR, strasseR, hnrR, req.session.nutzerId, "offen", date, zahlungsmethode];
                    const sql: string = `INSERT INTO Bestellungen (LieferAnrede, LieferVorname, LieferNachname, LieferPostleitzahl, LieferOrt, LieferStraße, LieferHausNr, RechnungAnrede, RechnungVorname, RechnungNachname, RechnungPostleitzahl, RechnungOrt, RechnungStraße, RechnungHausNr, UserID, Status, Bestelldatum, Zahlungsmethode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
                    query(sql, param).then((result) => {
                        query("SELECT * FROM Nutzerliste WHERE Email = ?;", [req.session.email]).then((result: any) => {
                            if (result.length === 1) {
                                const anrede: string = result[0].Anrede;
                                const vorname: string = result[0].Vorname;
                                const nachname: string = result[0].Nachname;
                                const postleitzahl: string = result[0].Postleitzahl;
                                const ort: string = result[0].Ort;
                                const strasse: string = result[0].Straße;
                                const hnr: string = result[0].HausNr;

                                const lieferadresse: Adresse = new Adresse();
                                lieferadresse.anrede = anrede;
                                lieferadresse.vorname = vorname;
                                lieferadresse.nachname = nachname;
                                lieferadresse.postleitzahl = postleitzahl;
                                lieferadresse.ort = ort;
                                lieferadresse.strasse = strasse;
                                lieferadresse.hnr = hnr;
                                req.session.lieferadresse = lieferadresse;
                                req.session.rechnungsadresse = lieferadresse;

                            } else {
                                res.sendStatus(500);
                            }
                        }).catch(() => {
                            res.sendStatus(500);
                        });
                    }).catch((err: mysql.MysqlError) => {
                        res.sendStatus(500);
                        console.log(err);
                    });
                } else {
                    res.status(400).json({message: "Gebe eine gültige Zahlungsmethode an!"})
                }
            }
            res.status(200).send({"message": results});
        });

}

/**
 * @api {get} /getBestellung Bestelldetails abrufen
 * @apiName GetBestellung
 * @apiGroup Bestellung
 *
 * @apiSuccess (200) {Object} lieferadresse Informationen zur Lieferadresse des Nutzers.
 * @apiSuccess (200) {Object} rechnungsadresse Informationen zur Rechnungsadresse des Nutzers.
 */

function getBestellung(req: express.Request, res: express.Response) {
    res.status(200).json({lieferadresse: req.session.lieferadresse, rechnungsadresse: req.session.rechnungsadresse});
}


/**
 * @api {post} /validateAdresse Adresse validieren
 * @apiName ValidateAdresse
 * @apiGroup Adresse
 *
 * @apiParam {Object} adresse Die Adresse, die validiert werden soll.
 *
 * @apiSuccess (200) {Object} value Validierte Adresse.
 */

function validateAdress(adresse: Adresse) {
    const schemaPost = Joi.object({
        anrede: Joi.string()
            .pattern(/^(Herr|Frau|Divers)$/)
            .message("Anrede ist nur Herr oder Frau erlaubt.")
            .required(),
        vorname: Joi.string()
            .pattern(/^[A-Za-zäöüÄÖÜß-]+(?:\s[A-Za-zäöüÄÖÜß]+)*$/)
            .message("Vorname darf nur aus Buchstaben bestehen und muss mind. 2 Buchstaben lang sein.")
            .min(2)
            .required(),
        nachname: Joi.string()
            .pattern(/^[A-Za-zäöüÄÖÜß-]{2,}(?:\s[A-Za-zäöüÄÖÜß]+)*$/)
            .message("Nachname darf nur aus Buchstaben bestehen und muss mind. 2 Buchstaben lang sein.")
            .min(2)
            .required(),
        postleitzahl: Joi.string()
            .pattern(/^[0-9]{1,5}$/)
            .message("Postleitzahl muss zwischen 1-5 Zahlen lang sein und darf nur Zahlen beinhalten.")
            .min(1)
            .max(5)
            .required(),
        ort: Joi.string()
            .pattern(/^[A-Za-zäöüÄÖÜß]+(?:[-\s][A-Za-zäöüÄÖÜß]+)*$/)
            .message("Ort darf keine Zahlen enthalten und muss mind. 2 Buchstaben lang sein.")
            .min(2)
            .required(),
        strasse: Joi.string()
            .pattern(/^[A-Za-zäöüÄÖÜß\s]+(?:\s[A-Za-zäöüÄÖÜß]+)*$/)
            .message("Strasse darf keine Zahlen und Sonderzeichen enthalten und muss mind. 2 Buchstaben lang sein.")
            .min(2)
            .required(),
        hnr: Joi.string()
            .pattern((/^\d[\w:-]*$/))
            .message("Hausnummer muss mit einer Zahl beginnen und mindestens eine Zahl enthalten. Appartment geben Sie bitte mit : an. Des Weiteren darf kein Leerzeichen verwendet werden.")
            .min(1)
            .max(20)
            .required(),
    });

    return schemaPost.validate(adresse);
}



