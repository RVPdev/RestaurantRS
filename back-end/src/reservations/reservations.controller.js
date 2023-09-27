/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");

async function list(req, res, next) {
  service
    .list()
    .then((data) => res.json({ data }))
    .catch(next);
}

module.exports = {
  list,
};
