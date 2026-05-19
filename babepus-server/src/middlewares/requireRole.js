const ApiError = require("../utils/ApiError");

const requireRole = (...allowedRoles) => (req, _res, next) => {
  if (!req.user) {
    return next(new ApiError(401, "Autentikasi diperlukan."));
  }

  if (!allowedRoles.includes(req.user.role)) {
    // Log unauthorized access attempt
    console.warn(`Unauthorized access attempt: User ${req.user.id} (${req.user.role}) tried to access ${req.originalUrl}`);

    return next(new ApiError(403, "Anda tidak memiliki akses ke resource ini."));
  }

  return next();
};

module.exports = requireRole;
