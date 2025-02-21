const express = require("express");
const app = express();
const port = 3000;


app.get('/', (req,res)=>{
    res.send('Not implemented yet');
});


app.post('/bestMove', (req,res)=>{
    res.send('Not implemented yet');
});


app.listen(port, () => console.log(`NextMove app listening on port ${port}!`));