const express = require('express');
const cors = require('cors');

const app = express();

// App is using static the current directory
app.use(express.static(__dirname));

// Server running on localhost port 7000
const port = 7000;
app.listen(port, () => {
    console.log(`--------------------------------------------------`);
    console.log(`FitTrack Frontend is running!`);
    console.log(`Open your browser at: http://localhost:${port}`);
    console.log(`Press Ctrl + C to stop`);
    console.log(`--------------------------------------------------`);
});