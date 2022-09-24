const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    obj={
        a: 'somil',
        num: 23
    }
    res.json(obj)
})
module.exports = router