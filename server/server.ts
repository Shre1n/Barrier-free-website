import * as express from "express";
import * as session from "express-session";
import * as mysql from "mysql";
import * as crypto from "crypto";
//Install Displayable Chart option
import {Chart} from 'chart.js';

const PORT: number = 8080;

const app: express.Express = express();
const connection: mysql.Connection = mysql.createConnection({
    database: "team-01",
    host: "localhost",
    user: "viewer"
});

// Datenbankverbindung zu MySQL-Datenbank
connection.connect((err) => {
    if (err === null) {
        console.log("Datenbank erfolgreich verbunden.");
    } else {
        console.log("DB-Fehler: " + err);
    }
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

router.post("/signin", signIn);
router.get("/signout", signOut);



// User
// Register a new User

function signIn(req: express.Request, res: express.Response): void {

    const email: string = req.body.email;
    const password: string = req.body.password;

    const data: [string, string] = [email, crypto.createHash("sha512").update(password).digest('hex')];
    const query: string = 'SELECT ID, Email, Password FROM user WHERE  Email = ? AND Password = ?;';

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










