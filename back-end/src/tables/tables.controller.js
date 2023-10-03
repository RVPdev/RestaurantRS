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
  res.json({ data });
}

const VALID_PROPERTIES = ["table_name", "capacity", "reservation_id"];

function hasValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }

  next();
}

async function create(req, res, next) {
  const data = await service.create(req.body.data);

  res.status(201).json({ data });
}

async function update(req, res, next) {
  const tables = {
    ...req.body.data,
    table_id: res.locals.table.table_id,
  };

  const data = await service.update(table);
  res.json({ data });
}

async function destroy(req, res, next) {
  const { table } = res.locals;
  await service.delete(table.table_id);
  res.sendStatus(204);
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(tableExists), read],
  create: [
    hasValidProperties,
    hasRequiredProperties,
    asyncErrorBoundary(create),
  ],
  update: [
    asyncErrorBoundary(tableExists),
    hasValidProperties,
    hasRequiredProperties,
    asyncErrorBoundary(update),
  ],
  delete: [asyncErrorBoundary(tableExists), asyncErrorBoundary(destroy)],
};
