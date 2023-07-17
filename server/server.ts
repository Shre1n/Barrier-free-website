import * as express from "express";
import * as session from "express-session";
import * as mysql from "mysql";
import * as crypto from "crypto";
import * as path from "path";
import Joi = require('joi');
//Install Displayable Chart option
import {Chart} from 'chart.js';
import {func} from "joi";

class Adresse {
    anrede: string;
    vorname: string;
    nachname: string;
    postleitzahl: string;
    ort: string;
    strasse: string;
    hnr: string;
}

// Ergänzt/Überlädt den Sessionstore
declare module "express-session" {
    //Das Interface deklariert, was in der Session erhalten sein muss
    interface Session {
        email: string;
        passwort: string;
        id: string;
        rollenid: number;
        cart: Object[];
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
app.get("/product/:name", getProduct);
app.post("/product", postProduct);
app.get("/product", getProduct);
app.get("/product", getProduct);
app.get("/addons" ,getAddons);
app.get("/spareparts", getSpareParts);
app.put("/product/:name", editProduct);
app.delete("/product/:name", deleteProduct);
app.get("/bewertungen/:name", getProductRating);
app.get("/login", checkLogin, isLoggedIn)
app.put("/lieferadresse", checkLogin, putLieferadresse);
app.put("/rechnungsadresse", checkLogin, putRechnungsadresse);
app.post("/bestellung", checkLogin, postBestellung);
app.get("/bestellung", checkLogin, getBestellung)

app.get("/cart", checkLogin, getCart);
app.post("/cart", checkLogin, postCart);
app.delete("/cart/:productName", checkLogin, deleteCart);
app.put("/cart", checkLogin, putCart);


//SITE
// Angezeigte Webseite



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
function getAddons(req: express.Request, res: express.Response): void {
    const sql = "SELECT * FROM Produktliste WHERE KategorieID = 2";

    // Führe die Datenbankabfrage aus
    connection.query(sql, (err, results) => {
        if (err) {
            // Bei einem Fehler sende eine Fehlerantwort an den Client
            res.status(500).json({ error: "Fehler bei der Datenbankabfrage" });
        } else {
            // Bei erfolgreicher Abfrage sende die Ergebnisse an den Client
            res.json(results);
        }
    });
}
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


function postCart(req: express.Request, res: express.Response): void {

}

function getCart(req: express.Request, res: express.Response): void {
    res.send(req.session.cart);
}

function putCart(req: express.Request, res: express.Response): void {

    if (req.body.produktName === "" || req.body.produktMenge === "" || isNaN(req.body.produktMenge) || req.body.method === "") {
        res.status(400).send("Produkt Name oder Produkt Menge sind fehlerhaft.");
        return;
    }

    const produktName: string = req.body.produktName;
    const produktMenge: number = req.body.produktMenge;
    const produktMethod: string = req.body.method;

    query("SELECT Preis, Bilder, Bestand, Kurzbeschreibung FROM Produktliste WHERE Produktname = ?", [produktName])
        .then((result: any) => {
            if (result.length === 1) {
                for (let i = 0; i < req.session.cart.length; i++) {
                    if (req.session.cart[i].
                    produktName.includes(produktName)) {
                        req.session.cart[i].produktMenge = (produktMethod === "add") ? req.session.cart[i].produktMenge + 1 : produktMenge;
                        res.sendStatus(200);
                        return;
                    }
                }
                req.session.cart.push(JSON.parse(`{"produktName": "${produktName}","produktMenge": ${produktMenge}, "preis": ${result[0].Preis}, "bilder": "${result[0].Bilder}", "bestand": ${result[0].Bestand}, "kurzbeschreibung": "${result[0].Kurzbeschreibung}"}`));
                res.sendStatus(200);
            } else {
                res.status(500).send("Produkt konnte nicht eindeutig Identifiziert werden.");
            }

        }).catch((err) => {
        res.status(500).send("Internal Server Error");
        console.log(err);
    });
}

function deleteCart(req: express.Request, res: express.Response): void {
    const productNameToDelete: string = req.params.productName;
    // Finde das Produkt im Warenkorb und entferne es
    req.session.cart = req.session.cart.filter(
        (product) => product.produktName !== productNameToDelete
    );
    res.sendStatus(200);
}

function postProduct(req: express.Request, res: express.Response): void {

}

function getAllProducts(req: express.Request, res: express.Response): void {

}

function
editProduct(req: express.Request, res: express.Response): void {

}

function deleteProduct(req: express.Request, res: express.Response): void {

}

function getAllRatings(req: express.Request, res: express.Response): void {

}

function getProductRating(req: express.Request, res: express.Response): void {

}

// User Sign In

// Prüft, ob ein Nutzer registriert ist und speichert ggf. den Nutzernamen im Sessionstore ab
function signIn(req: express.Request, res: express.Response): void {
    const email: string = req.body.email;
    const passwort: string = req.body.passwort;
    const cryptopass: string = crypto.createHash("sha512").update(passwort).digest("hex");
    if (email !== undefined && passwort !== undefined) {
        query("SELECT * FROM Nutzerliste WHERE Email = ? AND Passwort = ?;", [email, cryptopass]).then((result: any) => {
            if (result.length === 1) {
                req.session.email = email;
                req.session.passwort = cryptopass;
                req.session.cart = [];
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
    }
}


// User meldet sich ab -> Session wird gelöscht
// Löscht den Sessionstore und weist den Client an, das Cookie zu löschen

function signOut(req: express.Request, res: express.Response): void {
    req.session.destroy(() => {
            res.clearCookie("connect.sid");
            res.sendStatus(200);
        }
    );

}

function checkLogin(req: express.Request, res: express.Response, next: express.NextFunction): void {
    if (req.session.email !== undefined) {
        next();
        console.log("Lüppt")
    } else {
        res.status(401);
        res.send("User is not logged in! ")
    }
}

function disableUser(req: express.Request, res: express.Response): void {

}

function validateUser(isPut, user) {
    const schemaPost = Joi.object({
        anrede: Joi.string()
            .pattern(/^(Herr|Frau)$/)
            .message("Anrede ist nur Herr oder Frau erlaubt.")
            .required(),
        vorname: Joi.string()
            .pattern(/^[A-Za-zäöüÄÖÜß]+(?:\s[A-Za-zäöüÄÖÜß]+)*$/)
            .message("Vorname darf keine Zahlen enthalten und muss mind. 2 Zeichen lang sein.")
            .min(2)
            .required(),
        nachname: Joi.string()
            .pattern(/^[A-Za-zäöüÄÖÜß]{2,}(?:\s[A-Za-zäöüÄÖÜß]+)*$/)
            .message("Nachname darf keine Zahlen enthalten und muss mind. 2 Zeichen lang sein.")
            .min(2)
            .required(),
        email: Joi.string()
            // Email pattern Sonderzeichen sind NOCH erlaubt
            .pattern(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]/)
            .message("Email muss in folgendem Format sein: test@test.test.")
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
            .message("Ort darf keine Zahlen enthalten und muss mind. 2 Zeichen lang sein.")
            .min(2)
            .required(),
        strasse: Joi.string()
            .pattern(/^[A-Za-zäöüÄÖÜß\s]+(?:\s[A-Za-zäöüÄÖÜß]+)*$/)
            .message("Strasse darf keine Zahlen enthalten und muss mind. 2 Zeichen lang sein.")
            .min(2)
            .required(),
        hnr: Joi.string()
            .pattern((/^[0-9]+[A-Za-z]?(-\d+[A-Za-z]?)?$/))
            .message("Hausnummer muss mindestens eine Zahl enthalten. App. geben Sie bitte mit - an.")
            .min(1)
            .max(5)
            .required(),
        telefonnummer: Joi.string()
            .pattern(/^(\+[0-9]{1,3}[0-9]{4,}|[0-9])[0-9]{4,}$/)
            .message("Telefonnummer muss in folgendem Format sein: +49123456 oder 0123456 und muss mind. 5 Zahlen beinhalten.")
            .min(5)
            .required(),
        newsletter: Joi.string()
            .pattern(/^(Ja|Nein)$/)
    });

    return schemaPost.validate(user);
}
function validateEditUser(isPut, user) {
    const schemaPost = Joi.object({
        anrede: Joi.string()
            .pattern(/^(Herr|Frau)$/)
            .message("Anrede ist nur Herr oder Frau erlaubt.")
            .required(),
        vorname: Joi.string()
            .pattern(/^[A-Za-zäöüÄÖÜß]+(?:\s[A-Za-zäöüÄÖÜß]+)*$/)
            .message("Vorname darf keine Zahlen enthalten und muss mind. 2 Zeichen lang sein.")
            .min(2)
            .required(),
        nachname: Joi.string()
            .pattern(/^[A-Za-zäöüÄÖÜß]{2,}(?:\s[A-Za-zäöüÄÖÜß]+)*$/)
            .message("Nachname darf keine Zahlen enthalten und muss mind. 2 Zeichen lang sein.")
            .min(2)
            .required(),
        email: Joi.string()
            .pattern(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]/)
            .message("Email muss in folgendem Format sein: test@test.test.")
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
            .message("Ort darf keine Zahlen enthalten und muss mind. 2 Zeichen lang sein.")
            .min(2)
            .required(),
        strasse: Joi.string()
            .pattern(/^[A-Za-zäöüÄÖÜß\s]+(?:\s[A-Za-zäöüÄÖÜß]+)*$/)
            .message("Strasse darf keine Zahlen enthalten und muss mind. 2 Zeichen lang sein.")
            .min(2)
            .required(),
        hnr: Joi.string()
            .pattern((/^[0-9]+[A-Za-z]?(-\d+[A-Za-z]?)?$/))
            .message("Hausnummer muss mindestens eine Zahl enthalten. App. geben Sie bitte mit - an.")
            .min(1)
            .required(),
        telefonnummer: Joi.string()
            .pattern(/^(\+[0-9]{1,3}[0-9]{4,}|[0-9])[0-9]{4,}$/)
            .message("Telefonnummer muss in folgendem Format sein: +49123456 oder 0123456 und muss mind. 5 Zahlen beinhalten.")
            .min(5)
            .required(),
        newsletter: Joi.string()
            .pattern(/^(Ja|Nein)$/)
    });

    return schemaPost.validate(user);
}


// Ein eigener Wrapper, um die MySQL-Query als Promise (then/catch Syntax) zu nutzen
function query(sql: string, param: any[] = []): Promise<any> {
    return new Promise<any>((resolve: any, reject: any) => {
        connection.query(sql, param, (err: mysql.MysqlError | null, results: any) => {
            if (err === null) {
                resolve(results);
                console.log("resolving ...");
            } else {
                reject(err);
            }
        });
    });
}

// Kleine Hilfsfunktion, die immer 200 OK zurückgibt
function isLoggedIn(req: express.Request, res: express.Response): void {
    res.status(200).send({message:"Nutzer ist noch eingeloggt", user: req.session.email, rolle: req.session.rollenid});
}


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
            res.status(403).json({message: error.details[0].message});
            console.log(error.details[0].message);
        } else {
            req.session.lieferadresse = lieferadresse;
            req.session.rechnungsadresse = rechnungsadresse;
            res.sendStatus(200);
        }
    }
}

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
            res.status(403).json({message: error.details[0].message});
            console.log(error.details[0].message);
        } else {
            req.session.rechnungsadresse = rechnungsadresse;
            res.sendStatus(200);
        }
    }

}

function postBestellung(req: express.Request, res: express.Response) {
    const anredeL: string = req.session.lieferadresse.anrede;
    const vornameL: string =  req.session.lieferadresse.vorname;
    const nachnameL: string =  req.session.lieferadresse.nachname;
    const postleitzahlL: string =  req.session.lieferadresse.postleitzahl;
    const ortL: string =  req.session.lieferadresse.ort;
    const strasseL: string = req.session.lieferadresse.strasse;
    const hnrL: string =  req.session.lieferadresse.hnr;
    const anredeR: string = req.session.rechnungsadresse.anrede;
    const vornameR: string =  req.session.rechnungsadresse.vorname;
    const nachnameR: string =  req.session.rechnungsadresse.nachname;
    const postleitzahlR: string =  req.session.rechnungsadresse.postleitzahl;
    const ortR: string =  req.session.rechnungsadresse.ort;
    const strasseR: string = req.session.rechnungsadresse.strasse;
    const hnrR: string =  req.session.rechnungsadresse.hnr;
    const date = new Date().toISOString().split('T')[0];
    const zahlungsmethode = req.body.zahlungsmethode;


    if(req.session.cart.length == 0) {
        res.status(400).json({message: "Mit leerem Warenkorb kann keine Bestellung abgeschlossen werden!"})
    } else {
        if(zahlungsmethode == "PayPal" || zahlungsmethode == "SofortUeberweisung") {
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
                        req.session.cart = [];
                    } else {
                        res.sendStatus(500);
                    }
                }).catch(() => {
                    res.sendStatus(500);
                });
                res.sendStatus(200);
            }).catch((err: mysql.MysqlError) => {
                res.sendStatus(500);
                console.log(err);
            });
        } else {
            res.status(400).json({message: "Gebe eine gültige Zahlungsmethode an!"})
        }
    }
}

function getBestellung(req: express.Request, res: express.Response) {
    res.status(200).json({lieferadresse: req.session.lieferadresse, rechnungsadresse: req.session.rechnungsadresse});
}


function validateAdress(adresse: Adresse) {
    const schemaPost = Joi.object({
        anrede: Joi.string()
            .pattern(/^(Herr|Frau)$/)
            .message("Anrede ist nur Herr oder Frau erlaubt.")
            .required(),
        vorname: Joi.string()
            .pattern(/^[A-Za-zäöüÄÖÜß]+(?:\s[A-Za-zäöüÄÖÜß]+)*$/)
            .message("Vorname darf keine Zahlen enthalten und muss mind. 2 Zeichen lang sein.")
            .min(2)
            .required(),
        nachname: Joi.string()
            .pattern(/^[A-Za-zäöüÄÖÜß]{2,}(?:\s[A-Za-zäöüÄÖÜß]+)*$/)
            .message("Nachname darf keine Zahlen enthalten und muss mind. 2 Zeichen lang sein.")
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
            .message("Ort darf keine Zahlen enthalten und muss mind. 2 Zeichen lang sein.")
            .min(2)
            .required(),
        strasse: Joi.string()
            .pattern(/^[A-Za-zäöüÄÖÜß\s]+(?:\s[A-Za-zäöüÄÖÜß]+)*$/)
            .message("Strasse darf keine Zahlen enthalten und muss mind. 2 Zeichen lang sein.")
            .min(2)
            .required(),
        hnr: Joi.string()
            .pattern((/^[0-9]+[A-Za-z]?(-\d+[A-Za-z]?)?$/))
            .message("Hausnummer muss mindestens eine Zahl enthalten. App. geben Sie bitte mit - an.")
            .min(1)
            .required()
    });

    return schemaPost.validate(adresse);
}


/*
const query = 'SELECT Email FROM Nutzerliste where RollenID = ?;';
connection.query(query, [userId], (err, result) => {
    if (err) {
        console.error('Nutzerrolle konnte nicht gelesen werden:', err);
    } else {
        if (result.length > 0) {
            const Rolle = result[0].RollenID;
            // Store the user role in a variable or session for future use
            // Example: req.session.userRole = userRole;
        } else {
            console.error('Nutzer nicht gefunden');
            // Handle the case when the user is not found or the role is not defined
        }
    }
});
 */



