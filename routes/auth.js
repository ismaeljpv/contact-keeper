const express = require('express');
const router = express.Router();

// @route   GET api/auth
// @desc    Get logged in user
// @access  Private
router.get('/', (req, res) => {
    res.send('Get logged in user');
});


// @route   POST api/auth
// @desc    Authenticate the user
// @access  Public
router.post('/', (req, res) => {
    res.send('Authenticate user and get token');
});

module.exports = router;