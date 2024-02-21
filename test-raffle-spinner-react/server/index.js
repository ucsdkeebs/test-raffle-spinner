const serviceAccount = require('../.env/secrets.json');
const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
const { JWT } = require('google-auth-library')

const app = express();
const PORT = 3001;

app.use(cors());

// the id can be found by looking after /d/ in the sheet URL
const spreadsheetId = '18beUG4b0cNLogO8NFJPVvbB4kdFJPNSi7Wlc4nzBiPY';

// fetches the google sheet data from a specific range
app.get('/api/get-google-sheet-data', async (req, res) => {
  //console.log("api test");
  try {
    // creates auth credentials to use the service account
    const auth = new JWT(
      serviceAccount.client_email,
      null,
      serviceAccount.private_key,
      ['https://www.googleapis.com/auth/spreadsheets'], //the scope of the permissions
    );

    const sheets = google.sheets({ version: 'v4', auth });

    // gets the last row of Attendees that has data
    //const lastRow = sheets.data.sheets[0].data[0].rowData.length;
    // Specify the range you want to read
    const range = `Attendees!D2:I600`; // Update with your desired range

    // Actually gets the spreadsheet values after passing the spreadsheetId and the range of values
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
    });

    // sets the values to the response of the api and returns as a json
    const values = response.data.values;
    res.json(values);
  } catch (error) {
    console.error('Error reading Google Sheet data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// finds which row to place the most recent winner on, for more private info to verify
app.get('/api/get-num-winners', async (req, res) => {
  //console.log("api test");
  try {
    // creates credentials for service account
    const auth = new JWT(
      serviceAccount.client_email,
      null,
      serviceAccount.private_key,
      ['https://www.googleapis.com/auth/spreadsheets'],
    );

    const sheets = google.sheets({ version: 'v4', auth });

    const range = `Attendees!I2:I600`; // Update with desired range

    // queries from the spreadsheet
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
    });

    // returns the values of the "won yet" column as .json
    const values = response.data.values;
    res.json(values);
  } catch (error) {
    console.error('Error reading Google Sheet data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


/*
* adds the winner to the winner sheet and updates attendees sheet so they can't win again
* originalIndex: the row which has the winner in attendees
* newRow: the row to place the winner's email and name in winner sheet
* name: winner's name
* email: winner's email
*/
app.post('/api/add-winner/:originalIndex/:newRow/:name/:email/:orderid', async (req, res) => {
  try {
    // credential creation
    const auth = new JWT(
      serviceAccount.client_email,
      null,
      serviceAccount.private_key,
      ['https://www.googleapis.com/auth/spreadsheets'],
    );

    const sheets = google.sheets({ version: 'v4', auth });

    // Update won item to TRUE inside of Attendees sheet
    const updateAttendees = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Attendees!I${req.params.originalIndex}`,
      valueInputOption: 'USER_ENTERED', //here so that the value looks like TRUE instead of `TRUE since boolean values are weird with sheets
      resource: {
        values: [['TRUE']],
      },
    });

    // Log the update response (optional)
    //console.log('Update Response');

    // Updates the winners sheet to have the information of the new winner
    const updateWinners = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Winners!A${req.params.newRow}:C${req.params.newRow}`,
      valueInputOption: 'RAW',
      resource: {
        values: [[req.params.name, req.params.email, req.params.orderid]],
      },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating cell value:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// updates the spreadsheet so that values can't be changed mid spin
app.post('/api/add-protection', async (req, res) => {
  //console.log("protected!");

  const auth = new JWT(
    serviceAccount.client_email,
    null,
    serviceAccount.private_key,
    ['https://www.googleapis.com/auth/spreadsheets'],
  );

  const sheets = google.sheets({ version: 'v4', auth });

  try {
    const request = {
      spreadsheetId,
      resource: {
        requests: [
          {
            addProtectedRange: {
              protectedRange: {
                range: {
                  sheetId: 1581120529, // Sheet ID, 0 for the first sheet
                  startRowIndex: 1,
                  endRowIndex: 600, // Adjust as needed
                  startColumnIndex: 0,
                  endColumnIndex: 7, // Adjust as needed
                },
                warningOnly: true,
                requestingUserCanEdit: false,
              },
            },
          },
        ],
      },
    };

    const response = await sheets.spreadsheets.batchUpdate(request);
    const protectedRangeId = response.data.replies[0].addProtectedRange.protectedRange.protectedRangeId;
    res.json(protectedRangeId);
  } catch (error) {
    console.error('Error unprotecting range:', error.message);
  }
});

// updates the spreadsheet again so that the values can be entered
app.post('/api/remove-protection/:sheetID', async (req, res) => {
  //console.log("removing protection!");

  const auth = new JWT(
    serviceAccount.client_email,
    null,
    serviceAccount.private_key,
    ['https://www.googleapis.com/auth/spreadsheets'],
  );

  const sheets = google.sheets({ version: 'v4', auth });

  try {
    const request = {
      spreadsheetId,
      resource: {
        requests: [
          {
            deleteProtectedRange: {
              protectedRangeId: req.params.sheetID, // Obtain this ID from the response when protecting the range
            },
          },
        ],
      },
    };

    const response = await sheets.spreadsheets.batchUpdate(request);
  } catch (error) {
    console.error('Error unprotecting range:', error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});