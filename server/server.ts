import * as express from "express";
import * as session from "express-session";
import * as mysql from "mysql";
import * as crypto from "crypto";
import * as path from "path";
import Joi = require('joi');
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
            res.send("There went something wrong!")
            console.log("deleteUser" + err);
        } else {
            res.status(200);
            res.send("User successfully deleted!");
        }
    });
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
    const passwort: string = req.body.passwort;
    const cryptopass: string = crypto.createHash("sha512").update(passwort).digest("hex");
    if (email !== undefined && passwort !== undefined) {
        query("SELECT Vorname, Nachname FROM Nutzerliste WHERE Email = ? AND Passwort = ?;", [email, cryptopass]).then((result: any) => {
            if (result.length === 1) {
                req.session.email = email;
                req.session.passwort = cryptopass;
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
            .message("Bei Anrede ist nur Herr oder Frau erlaubt.")
            .required(),
        vorname: Joi.string()
            .pattern(/^[A-Za-zäöüÄÖÜß]+(?:\s[A-Za-zäöüÄÖÜß]+)*$/)
            .message("Vorname darf keine Zahlen enthalten und muss mindestens 2 Zeichen lang sein")
            .min(2)
            .required(),
        nachname: Joi.string()
            .pattern(/^[A-Za-zäöüÄÖÜß]{2,}(?:\s[A-Za-zäöüÄÖÜß]+)*$/)
            .message("Nachname darf keine Zahlen enthalten und muss mindestens 2 Zeichen lang sein")
            .min(2)
            .required(),
        email: Joi.string()
            .pattern(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]/)
            .message("Email muss in folgendem Format sein: test@test.test")
            .min(2)
            .required(),
        passwort: Joi.string()
            .pattern(/.{3,}/)
            .message("Muss größer als 3 Zeichen sein")
            .required(),
        postleitzahl: Joi.string()
            .pattern(/^[0-9]{1,5}$/)
            .message("Muss zwischen 1-5 Zeichen lang sein und darf nur Zahlen beinhalten")
            .min(1)
            .max(5)
            .required(),
        ort: Joi.string()
            .pattern(/^[A-Za-zäöüÄÖÜß]+(?:[-\s][A-Za-zäöüÄÖÜß]+)*$/)
            .message("Ortsangabe darf keine Zahlen enthalten und muss mindestens 2 Zeichen lang sein")
            .min(2)
            .required(),
        strasse: Joi.string()
            .pattern(/^[A-Za-zäöüÄÖÜß\s]+(?:\s[A-Za-zäöüÄÖÜß]+)*$/)
            .message("Straßenangabe darf keine Zahlen enthalten und muss mindestens 2 Zeichen lang sein")
            .min(2)
            .required(),
        hnr: Joi.string()
            .pattern((/^[0-9]+[A-Za-z]?(-\d+[A-Za-z]?)?$/))
            .message("Hausnummer muss mindestens eine Zahl enthalten")
            .min(1)
            .required(),
        telefonnummer: Joi.string()
            .pattern(/^(\+[0-9]{1,3}[0-9]{4,}|[0-9])[0-9]{4,}$/)
            .message("Telefonnummer muss darf keine Buchstaben enthalten")
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
            .message("Bei Anrede ist nur Herr oder Frau erlaubt.")
            .required(),
        vorname: Joi.string()
            .pattern(/^[A-Za-zäöüÄÖÜß]+(?:\s[A-Za-zäöüÄÖÜß]+)*$/)
            .message("Vorname darf keine Zahlen enthalten und muss mindestens 2 Zeichen lang sein")
            .min(2)
            .required(),
        nachname: Joi.string()
            .pattern(/^[A-Za-zäöüÄÖÜß]{2,}(?:\s[A-Za-zäöüÄÖÜß]+)*$/)
            .message("Nachname darf keine Zahlen enthalten und muss mindestens 2 Zeichen lang sein")
            .min(2)
            .required(),
        email: Joi.string()
            .pattern(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]/)
            .message("Email muss in folgendem Format sein: test@test.test")
            .min(2)
            .required(),
        postleitzahl: Joi.string()
            .pattern(/^[0-9]{1,5}$/)
            .message("Muss zwischen 1-5 Zeichen lang sein und darf nur Zahlen beinhalten")
            .min(1)
            .max(5)
            .required(),
        ort: Joi.string()
            .pattern(/^[A-Za-zäöüÄÖÜß]+(?:[-\s][A-Za-zäöüÄÖÜß]+)*$/)
            .message("Ortsangabe darf keine Zahlen enthalten und muss mindestens 2 Zeichen lang sein")
            .min(2)
            .required(),
        strasse: Joi.string()
            .pattern(/^[A-Za-zäöüÄÖÜß\s]+(?:\s[A-Za-zäöüÄÖÜß]+)*$/)
            .message("Straßenangabe darf keine Zahlen enthalten und muss mindestens 2 Zeichen lang sein")
            .min(2)
            .required(),
        hnr: Joi.string()
            .pattern((/^[0-9]+[A-Za-z]?(-\d+[A-Za-z]?)?$/))
            .message("Hausnummer muss mindestens eine Zahl enthalten")
            .min(1)
            .required(),
        telefonnummer: Joi.string()
            .pattern(/^(\+[0-9]{1,3}[0-9]{4,}|[0-9])[0-9]{4,}$/)
            .message("Telefonnummer muss darf keine Buchstaben enthalten")
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
    res.sendStatus(200);
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



