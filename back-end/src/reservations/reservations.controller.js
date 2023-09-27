/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");

async function list(req, res, next) {
  console.log("11111111111111111")
  service
    .list()
    .then((data) => res.json({ data }))
    .catch(next);
}

module.exports = {
  list,
};
