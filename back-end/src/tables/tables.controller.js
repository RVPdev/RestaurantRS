const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const hasProperties = require("../errors/hasProperties");
const hasRequiredProperties = hasProperties(
  "table_name",
  "capacity",
  "reservation_id"
);

async function list(req, res, next) {
  const data = await service.list();
  res.json({ data: date });
}

async function tableExists(req, res, next) {
  const table = await service.read(req.params.tableId);

  if (table) {
    res.locals.table = table;
    return next();
  }

  next({
    status: 404,
    message: `Table ${req.params.tableId} cannot be found.`,
  });
}

async function read(req, res, next) {
  const { table: data } = res.locals;
  res.json({data});
}
