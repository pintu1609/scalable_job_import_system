const router = require("express").Router();
const { getImportHistory } = require("../../controller/import/import");


router.route("/").get(getImportHistory);

module.exports = router;
