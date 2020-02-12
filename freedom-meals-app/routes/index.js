const express = require('express');

//router responds to any requests from the root url
const router = express.Router();

router.get('/', (req, res) =>{
    res.send('It works!');
});

module.exports = router;