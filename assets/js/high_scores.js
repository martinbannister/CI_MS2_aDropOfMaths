
function saveToHighscore() {


}

function makeApiCall() {
    var params = {
      // The ID of the spreadsheet to update.
      spreadsheetId: '1UQPFk1pgxJHESHmhj505eYeq2ec_4I5uoi65IVahiRs',

      // The A1 notation of a range to search for a logical table of data.
      // Values will be appended after the last row of the table.
      range: 'A1', 

      // How the input data should be interpreted.
      valueInputOption: 'RAW', 

      // How the input data should be inserted.
      insertDataOption: 'INSERT_ROWS', 
    };

    var valueRangeBody = {
        "range": "A1:B1000",
        "values": [
          [
            "CAT",
            12
          ]
        ]
    };

    var request = gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody);
    request.then(function(response) {
      // TODO: Change code below to process the `response` object:
      console.log(response.result);
    }, function(reason) {
      console.error('error: ' + reason.result.error.message);
    });
  }

function start() {
    // 2. Initialize the JavaScript client library.
    gapi.client.init({
        'apiKey': 'AIzaSyCfPy5be2i-S3bUUPeNn3Uq7kyOPv2O0hY'
    }).then(function () {
        // 3. Initialize and make the API request.
        return gapi.client.sheets.spreadsheets.values.get({
            "spreadsheetId": "1UQPFk1pgxJHESHmhj505eYeq2ec_4I5uoi65IVahiRs",
            "range": "A1:B1000",
            "access_token": "AIzaSyCfPy5be2i-S3bUUPeNn3Uq7kyOPv2O0hY"
        })
            .then(function (response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);
            },
                function (err) { console.error("Execute error", err); });
    });
}

// 1. Load the JavaScript client library.
// gapi.load('client', start);