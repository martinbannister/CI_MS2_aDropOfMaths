
function saveToHighscore() {


}

function makeApiCall() {
    try {
        let initals = 'MB';

        let dataToSend = {
            'data': {
                'initials': initals,
                'score': 100
            }
        };

        SheetDB.write('https://sheetdb.io/api/v1/o9udtiqi23nf0', dataToSend).then(function(result){
            console.log(result);
            }, function(error){
            console.log(error);
        });
    }

    catch(err) {
        console.log(err);
    }
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