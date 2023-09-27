/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.controller");


// reservation id
router.route("/:reservationId").get(controller.read)

router.route("/").get(controller.list);


module.exports = router;
