import * as express from "express";
import * as session from "express-session";
import * as mysql from "mysql";
import * as crypto from "crypto";
//Install Displayable Chart option
import {Chart} from 'chart.js';

// Klassen definieren: Nutzer erstellen und Constructor für Nutzer
class Nutzer {
    vorname: string;
    nachname: string;
    email: string;
    passwort: string;
    postleitzahl: number;
    ort: string;
    adresse: string;
    telefonnummer: number;

    constructor(vorname: string, nachname: string, email: string, passwort: string, postleitzahl: number, ort: string, adresse: string, telefonnummer: number) {
        this.vorname = vorname;
        this.nachname = nachname;
        this.email = email;
        this.passwort = passwort;
        this.postleitzahl = postleitzahl;
        this.ort = ort;
        this.adresse = adresse;
        this.telefonnummer = telefonnummer;
    }
}

//Klasse definieren: Produkt erstellen und Constructor für Produkt
class Produkt {
    name: string;
    kurzbeschreibung: string;
    lieferumfang: string;
    verfuegbarkeit: number;
    preis: number;
    kategorie: string;

    constructor(name: string, kurzbeschreibung: string, lieferumfang: string, verfuegbarkeit: number, preis: number, kategorie: string) {
        this.name = name;
        this.kurzbeschreibung = kurzbeschreibung;
        this.lieferumfang = lieferumfang;
        this.verfuegbarkeit = verfuegbarkeit;
        this.preis = preis;
        this.kategorie = kategorie;
    }

}


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
    console.log("Server gestartet unter http://localhost:" + PORT + "/");
});


// Pfade
const path = require('path');
const basedir: string = path.join(__dirname, '/');

// Express Router
const router = express();


router.use('/', express.static(path.join(basedir, "/../client")));

router.use("/res", express.static(__dirname + "/client"))

//JSON und URLenconded
router.use(express.json());
router.use(express.urlencoded({extended: false}));

// Pfade der Websites


//Nutzer Routen
router.post("/user", postUser);
router.put("/user/:username", checkLogin, putUser);
router.delete("/user/:username", checkLogin, deleteUser);
router.post("/bewertungen", checkLogin)
router.post("/signin", signIn);
router.get("/signout", signOut);

//Produkt Routen für Nutzer
router.get("/product/:name", getProduct);
router.post("/product", postProduct);
router.get("/product", getAllProducts);
router.put("/product/:name", editProduct);
router.delete("/product/:name", deleteProduct);
router.get("/bewertungen/:name", getProductRating);

// Produkt Routen für CEO
router.put("/ceo/product/:id", editProduct);
router.post("/ceo/product", postProduct);
router.get("/ceo/product/:name", getProduct);
router.get("/ceo/bewertungen", getAllRatings);
router.get("/ceo/bewertungen/:id", getProductRating);
router.post("/ceo/signin", signIn);
router.get("/ceo/signout", signOut);

//Produkt Routen für Admin
router.get("/admin/user", getUser);
router.post("/admin/signin", signIn);
router.get("/admin/signout", signOut);

// Admin Routen für Nutzer
router.delete("/admin/user/:username", deleteUser);
router.put("/admin/user/:username", disableUser);

function postUser(req: express.Request, res: express.Response): void {
    const vorname: string = req.body.vorname;
    const nachname: string = req.body.nachname;
    const email: string = req.body.email;
    const passwort: string = req.body.passwort;
    const postleitzahl: number = req.body.postleitzahl;
    const ort: string = req.body.ort;
    const adresse: string = req.body.adresse;
    const telefonnummer: number = req.body.telefonnummer;

    if (vorname === undefined || nachname === undefined || postleitzahl === undefined || ort === undefined || adresse === undefined || telefonnummer === undefined || passwort === undefined || email === undefined) {

        res.status(500);
        res.send("Alle Felder müssen gefüllt werden!");

    } else {

        const queryselect: string = 'SELECT Email FROM Nutzerliste WHERE Email = ?;'

        connection.query(queryselect, [email], (err, result) => {

            if (err) {
                res.status(500);
                res.send("Ein Fehler ist aufgetreten :(");
            } else if (result.length > 0) {
                res.status(500);
                res.send("Diese Email ist leider schon vergeben!");
            } else {
                const cryptopass: string = crypto.createHash("sha512").update(passwort).digest("hex");

                const data: [string, string, string, string, number, string, string, number] = [
                    vorname,
                    nachname,
                    email,
                    cryptopass,
                    postleitzahl,
                    ort,
                    adresse,
                    telefonnummer
                ];

                const newQuery: string = 'INSERT INTO Nutzerliste (Vorname, Nachname, Email, Passwort, Postleitzahl, Ort, Adresse, Telefonnummer) VALUES (?,?,?,?,?,?,?,?);'

                connection.query(newQuery, data, (err, result) => {
                    if (err) {
                        console.log("postUser: " + err);
                        res.status(400);
                        res.send("Etwas ist schief gelaufen. :(");

                    } else {
                        if (result === 0) {
                            res.status(400);
                            res.send("result action");
                        } else {
                            res.status(201);
                            res.send("User Signed Up!");
                        }

                    }
                });
            }
        });
    }
}

function getUser(req: express.Request, res: express.Response): void {

}

function putUser(req: express.Request, res: express.Response): void {

}

function deleteUser(req: express.Request, res: express.Response): void {

}


//Produkt Routen

function getProduct(req: express.Request, res: express.Response): void {

}

function postProduct(req: express.Request, res: express.Response): void {

}

function getAllProducts(req: express.Request, res: express.Response): void {

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

function signIn(req: express.Request, res: express.Response): void {

    const email: string = req.body.email;
    const passwort: string = req.body.passwort;

    const data: [string, string] = [email, crypto.createHash("sha512").update(passwort).digest('hex')];
    const query: string = 'SELECT ID, Email, passwort FROM user WHERE  Email = ? AND passwort = ?;';

    connection.query(query, data, (err, rows: any) => {


        if (err) {
            res.status(500);
            res.send("Something went wrong!");
            console.log("signIn" + err);
        } else if (rows.length == 0) {
            res.sendStatus(404);
        } else {
            // const okuser: string = rows[0].Username;
            // hier session zeug
            res.status(200);
            res.send("Sie sind Angemeldet!");

        }
    });
}

// User meldet sich ab -> Session wird gelöscht

function signOut(req: express.Request, res: express.Response): void {


    req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.status(200);
        res.send("User succesfully logged out!")
    });

}

function checkLogin(req: express.Request, res: express.Response): void {

}

function disableUser(req: express.Request, res: express.Response): void {

}




