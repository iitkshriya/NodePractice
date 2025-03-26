const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAll, get, save, update, remove } = require("../controllers/recipes");

router.route('/').get(getAll).post(auth.authenticate(), save);
router.route('/:id').get(get).put(auth.authenticate(), update).delete(auth.authenticate(), remove);

module.exports = router;
