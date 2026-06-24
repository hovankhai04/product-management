module.exports.getStatistic = async (Model) => {
  const total = await Model.countDocuments({
    deleted: false
  });

  const active = await Model.countDocuments({
    deleted: false,
    status: "active"
  });

  const inactive = await Model.countDocuments({
    deleted: false,
    status: "inactive"
  });

  return {
    total,
    active,
    inactive
  };
};