const express = require('express');
const app = express();
const { google } = require('googleapis');
const port = process.env.PORT || 5000;

const oauth2Client = new google.auth.OAuth2(
    '617247702863-b22g95q0ro93bhe8hukrd6t7ev0kbpl2.apps.googleusercontent.com',
    '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',
    '/'
);
const scopes = [
    'https://www.googleapis.com/auth/drive.metadata.readonly',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/spreadsheets.readonly'
];



app.get('/', (req, res) => {




    const sheets = google.sheets('v4');

    async function main() {
        const authClient = await authorize();
        const request = {
            // The ID of the spreadsheet to retrieve data from.
            spreadsheetId: '1Pr94ZBWUNYGfe5Wr0k1j_EXcUCAdSE7iJkff7vJEORA', // TODO: Update placeholder value.

            // The A1 notation of the values to retrieve.
            range: 'testing', // TODO: Update placeholder value.

            // How values should be represented in the output.
            // The default render option is ValueRenderOption.FORMATTED_VALUE.
            //valueRenderOption: '', // TODO: Update placeholder value.

            // How dates, times, and durations should be represented in the output.
            // This is ignored if value_render_option is
            // FORMATTED_VALUE.
            // The default dateTime render option is [DateTimeRenderOption.SERIAL_NUMBER].
            //dateTimeRenderOption: '', // TODO: Update placeholder value.

            auth: authClient,
        };

        try {
            const response = (await sheets.spreadsheets.values.get(request)).data;
            // TODO: Change code below to process the `response` object:
            console.log(JSON.stringify(response, null, 2));
        } catch (err) {
            console.error(err);
        }
    }
    main();

    async function authorize() {
        // TODO: Change placeholder below to generate authentication credentials. See
        // https://developers.google.com/sheets/quickstart/nodejs#step_3_set_up_the_sample
        //
        // Authorize using one of the following scopes:
        //   'https://www.googleapis.com/auth/drive',
        //   'https://www.googleapis.com/auth/drive.file',
        //   'https://www.googleapis.com/auth/drive.readonly',
        //   'https://www.googleapis.com/auth/spreadsheets',
        //   'https://www.googleapis.com/auth/spreadsheets.readonly'
        let authClient = oauth2Client;

        if (authClient == null) {
            throw Error('authentication failed');
        }

        return authClient;
    }
    res.send('<h1>yes</h1>')
})


app.listen(port, () => {
    console.log('server started on ' + port)
})

//AIzaSyAW-0T3HM6CWN7YGQ-ywneEzrJ6INyHgJQ