import * as express from "express";
import * as session from "express-session";
import * as mysql from "mysql";
import * as crypto from "crypto";
//Install Displayable Chart option
import {Chart} from 'chart.js';


// Ergänzt/Überlädt den Sessionstore
declare module "express-session" {
    //Das Interface deklariert, was in der Session erhalten sein muss
    interface Session {
        email: string;
        passwort: string;
        id: string;
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
    console.log("Server gestartet unter http://localhost:" + PORT + "/startseite.html");
});


// Pfade
// Der Ordner ../client/ wird auf die URL /res gemapped
app.use(express.static(__dirname + "/../client/"));

app.use("/img", express.static(__dirname+"/../img/"));

//JSON und URLenconded
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Pfade der Websites


//Nutzer Routen
app.post("/user", postUser);
app.put("/user/:id", checkLogin, putUser);
app.delete("/user/:id", checkLogin, deleteUser);
app.post("/bewertungen", checkLogin)
app.post("/signin", signIn);
app.get("/signout", signOut);
app.get("/product/:name", getProduct);
app.post("/product", postProduct);
app.get("/product", getAllProducts);
app.put("/product/:name", editProduct);
app.delete("/product/:name", deleteProduct);
app.get("/bewertungen/:name", getProductRating);

// Routen für CEO
// Beim anlegen Rolle mit schicken
app.put("/ceo/product/:id", editProduct);
app.post("/ceo", postCeo);
app.post("/ceo/product", postProduct);
app.get("/ceo/product/:name", getProduct);
app.get("/ceo/bewertungen", getAllRatings);
app.get("/ceo/bewertungen/:id", getProductRating);
app.post("/ceo/signin", signIn);
app.get("/ceo/signout", signOut);

// Routen für Admin
// Beim anlegen Rolle mit schicken
app.get("/admin/user", getUser);
app.post("/admin", postAdmin);
app.get("/admin/product", getProduct);
app.post("/admin/signin", signIn);
app.get("/admin/signout", signOut);
app.delete("/admin/user/:username", deleteUser);
app.put("/admin/user/:username", disableUser);


//SITE
// Angezeigte Webseite


function postUser(req: express.Request, res: express.Response): void {
    const anrede: string = req.body.anrede;
    const vorname: string = req.body.vorname;
    const nachname: string = req.body.nachname;
    const email: string = req.body.email;
    const passwort: string = req.body.passwort;
    const postleitzahl: number = req.body.postleitzahl;
    const ort: string = req.body.ort;
    const strasse: string = req.body.strasse;
    const hnr: number = req.body.hnr;
    const telefonnummer: number = req.body.telefonnummer;

    if (anrede === undefined || vorname === undefined || nachname === undefined || postleitzahl === undefined || ort === undefined || strasse === undefined || hnr === undefined || telefonnummer === undefined || passwort === undefined || email === undefined) {

        res.status(500);
        res.send("Alle Felder müssen gefüllt werden!");

    } else {


        const cryptopass: string = crypto.createHash("sha512").update(passwort).digest("hex");

        const data: [string, string, string, string, string, number, string, string, number, number] = [
            anrede,
            vorname,
            nachname,
            email,
            cryptopass,
            postleitzahl,
            ort,
            strasse,
            hnr,
            telefonnummer
        ];

        const newQuery: string = 'INSERT INTO Nutzerliste (Anrede, Vorname, Nachname, Email, Passwort, Postleitzahl, Ort, Straße, HausNr, Telefonnummer) VALUES (?,?,?,?,?,?,?,?,?,?);'

        connection.query(newQuery, data, (err, result) => {
            if (err) {
                //Anstatt des Servers wird die Datenbank gefragt, ob die Email schon vorhanden ist
                if (err.code === "ER_DUP_ENTRY"){
                    res.status(400).send("Email schon existent.");
                }else {
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

}

function putUser(req: express.Request, res: express.Response): void {

}

function deleteUser(req: express.Request, res: express.Response): void {

    const validemail: string = req.params.email;
    const email = req.session.email;

    const query: string = 'DELETE FROM Nutzerliste WHERE Email = ?;';

    if (validemail === email) {
        connection.query(query, [email], (err, result) => {
            if (err) {
                res.status(500);
                res.send("There went something wrong!")
                console.log("deleteUser" + err);
            } else {
                res.status(200);
                res.send("User successfully deleted!");
            }
        });
    } else {
        res.status(400);
        res.send("You can only delete yourself! ;)");
    }
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

// Prüft, ob ein Nutzer registriert ist und speichert ggf. den Nutzernamen im Sessionstore ab
function signIn(req: express.Request, res: express.Response): void {
    const email: string = req.body.email;
    const passwort: string = req.body.password;
    if (email !== undefined && passwort !== undefined) {
        query("SELECT Vorname, Nachname FROM Nutzerliste WHERE Email = ? AND Passwort = ?;", [email, passwort]).then((result: any) => {
            if (result.length === 1) {
                req.session.email = email;
                req.session.passwort = passwort;
                res.sendStatus(200);
            } else {
                console.log("500 in else");
                res.sendStatus(500);
            }
        }).catch(() => {
            console.log("500 in catch");
            res.sendStatus(500);
        });
    }
}


// User meldet sich ab -> Session wird gelöscht

function signOut(req: express.Request, res: express.Response): void {
    if (req.session && req.session.email && req.session.passwort) {
        req.session.destroy(() => {
            res.clearCookie("connect.sid");
            res.sendStatus(200);
        });
    } else {
        res.sendStatus(401); // Unauthorized
    }
}

function checkLogin(req: express.Request, res: express.Response, next: express.NextFunction): void {
    if (req.session) {
        next();
    } else {
        res.status(400);
        res.send("User is not logged in! ")
    }
}

function disableUser(req: express.Request, res: express.Response): void {

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
    res.sendStatus(200);
}




