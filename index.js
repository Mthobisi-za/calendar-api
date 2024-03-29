const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const creds = require('./credentials.json');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');
const cors = require("cors");
const moment = require('moment')
require('./txt');

app.use(cors({ origin: "*" }));

async function database(type, val, res) {
    // If modifying these scopes, delete token.json.
    const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly', 'https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/spreadsheets'];
    // The file token.json stores the user's access and refresh tokens, and is
    // created automatically when the authorization flow completes for the first
    // time.
    const TOKEN_PATH = path.join(process.cwd(), 'token.json');
    const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

    /**
     * Reads previously authorized credentials from the save file.
     *
     * @return {Promise<OAuth2Client|null>}
     */
    async function loadSavedCredentialsIfExist() {
        try {
            const content = await fs.readFile(TOKEN_PATH);
            const credentials = JSON.parse(content);
            return google.auth.fromJSON(credentials);
        } catch (err) {
            return null;
        }
    }

    /**
     * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
     *
     * @param {OAuth2Client} client
     * @return {Promise<void>}
     */
    async function saveCredentials(client) {
        const content = await fs.readFile(CREDENTIALS_PATH);
        const keys = JSON.parse(content);
        const key = keys.installed || keys.web;
        const payload = JSON.stringify({
            type: 'authorized_user',
            client_id: key.client_id,
            client_secret: key.client_secret,
            refresh_token: client.credentials.refresh_token,
        });
        await fs.writeFile(TOKEN_PATH, payload);
    }

    /**
     * Load or request or authorization to call APIs.
     *
     */
    async function authorize() {
        let client = await loadSavedCredentialsIfExist();
        if (client) {
            return client;
        }
        client = new google.auth.GoogleAuth({
            scopes: SCOPES,
            keyFile: CREDENTIALS_PATH,
        });
        if (client.credentials) {
            await saveCredentials(client);
        }
        return client;
    }

    /**
     * Prints the names and majors of students in a sample spreadsheet:
     * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
     * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
     */
    async function listMajors(auth) {
        const sheets = google.sheets({ version: 'v4', auth });
        const res = await sheets.spreadsheets.values.get({
            spreadsheetId: '1Pr94ZBWUNYGfe5Wr0k1j_EXcUCAdSE7iJkff7vJEORA',
            range: 'testing',
        });
        const rows = res.data.values;
        if (!rows || rows.length === 0) {
            console.log('No data found.');
            return;
        }

        rows.forEach((row) => {
            // Print columns A and E, which correspond to indices 0 and 4.
            console.log(row);
        });

        return rows;
    }

    //setnew data
    async function updateData(auth) {
        console.log('update');
        const sheets = google.sheets({ version: 'v4', auth });
        const request = {
            // The ID of the spreadsheet to update.
            spreadsheetId: '1Pr94ZBWUNYGfe5Wr0k1j_EXcUCAdSE7iJkff7vJEORA', // TODO: Update placeholder value.

            // The A1 notation of a range to search for a logical table of data.
            // Values are appended after the last row of the table.
            range: 'testing', // TODO: Update placeholder value.

            // How the input data should be interpreted.
            valueInputOption: 'RAW', // TODO: Update placeholder value.

            // How the input data should be inserted.
            insertDataOption: 'INSERT_ROWS', // TODO: Update placeholder value.

            resource: {
                values: [
                    [val.name, val.surname, val.email, val.company_name, val.e_name_surname, val.occupation, val.date_booked, val.e_cell]
                ]
            },

            auth: auth,
        };
        const newRes = (await sheets.spreadsheets.values.append(request)).data;
        console.log(JSON.stringify(newRes, null, 2));
    }


    if (type === 'get') {
        return await authorize().then(listMajors).catch(console.error);
    } else if (type === 'update') {
        authorize().then(updateData).catch(console.error);
    }


}


app.get('/', (req, res) => {
    (async() => {
        try {
            let data = await database('get', 'val', res);
            var arg = [];
            await data.forEach(ele => {
                if (ele[0] == 'FirstName') {

                } else {


                    var fromD = ((((ele[6].split('-')[0]).replace('/', '-')).replace('/', '-')).replace('/', '-'));
                    var toD = ((((ele[6].split('-')[1]).replace('/', '-')).replace('/', '-')).replace('/', '-'));
                    console.log(fromD, toD);
                    var itr = moment.twix(new Date(fromD), new Date(toD)).iterate("days");
                    var range = [];
                    while (itr.hasNext()) {
                        range.push(itr.next().format("YYYY-M-D"))
                    }
                    console.log(range)
                    var obj = {
                        FirstName: ele[0],
                        LastName: ele[1],
                        Email: ele[2],
                        Company_name: ele[3],
                        e_name_surname: ele[4],
                        occupation: ele[5],
                        date_booked: range
                    }
                    arg.push(obj);
                }


            });
            res.json({ status: 200, status_text: 'success', data: await arg });
        } catch (error) {
            res.json({ status: 201, status_text: 'success' });
        }

    })()

});
app.get('/update/:name/:surname/:email/:company_name/:e_name_surname/:occupation/:date_booked', (req, res) => {
    let name = req.params.name;
    let surname = req.params.surname;
    let email = req.params.email;
    let company_name = req.params.company_name;
    let e_name_surname = req.params.e_name_surname;
    let occupation = req.params.occupation;
    let date_booked = req.params.date_booked;

    var fromd = (date_booked).replace('-', '/').replace('-', '/').replace('-', '/').replace('-', '/').replace('-', '/');
    var full = fromd.replace('=', '-');
    console.log('full date >' + full);


    console.log(name, surname, email, company_name, e_name_surname, occupation, database)
    database('update', { name, surname, email, company_name, e_name_surname, occupation, date_booked: full });
    res.json({ status: 200, status_text: 'success' });
});
app.get('/newupdate/:name/:surname/:email/:company_name/:e_name_surname/:occupation/:date_booked/:e_cell', (req, res) => {
    let name = req.params.name;
    let surname = req.params.surname;
    let email = req.params.email;
    let company_name = req.params.company_name;
    let e_name_surname = req.params.e_name_surname;
    let occupation = req.params.occupation;
    let date_booked = req.params.date_booked;
    let e_cell = req.params.e_cell;

    var fromd = (date_booked).replace('-', '/').replace('-', '/').replace('-', '/').replace('-', '/').replace('-', '/');
    var full = fromd.replace('=', '-');
    console.log('full date >' + full);



    console.log(name, surname, email, company_name, e_name_surname, occupation, );
    database('update', { name, surname, email, company_name, e_name_surname, occupation, date_booked: full, e_cell });

    res.json({ status: 200, status_text: 'success' });
});
app.listen(port, () => {
    console.log('server started on ' + port);
})
