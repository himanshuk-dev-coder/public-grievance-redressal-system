import { rolePermissions } from "../constants/rolePermissions.js";

/**
 * @desc    Role Based Access Control Middleware
 * @param   {Array<string>} requiredPermissions
 */
export const authorize = (requiredPermissions = []) => {
  return (req, res, next) => {
    try {
      // 1️⃣ Must be authenticated
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: User not authenticated",
        });
      }

      // 2️⃣ Permissions must exist
      const { permissions } = req.user;

      if (!Array.isArray(permissions)) {
        return res.status(403).json({
          success: false,
          message: "Access denied: Permissions missing",
        });
      }

      // 3️⃣ Normalize permissions (ignore case & extra spaces)
      const normalizedUserPermissions = permissions.map(p => p.trim().toLowerCase());
      const normalizedRequiredPermissions = requiredPermissions.map(p => p.trim().toLowerCase());

      // 4️⃣ Check which permissions are missing
      const missingPermissions = normalizedRequiredPermissions.filter(
        p => !normalizedUserPermissions.includes(p)
      );

      // 4️⃣ Check if user has at least one required permission
      const hasPermission = normalizedRequiredPermissions.some(
        p => normalizedUserPermissions.includes(p)
      );

      // const hasPermission = missingPermissions.length === 0;
      console.log("User permissions:", normalizedUserPermissions);
      console.log("Required permissions:", normalizedRequiredPermissions);
      console.log("Missing permissions:", missingPermissions);
      console.log("Has permission?", hasPermission);

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: `Access Denied: Missing Permissions → ${missingPermissions.join(", ")}`,
        });
      }

      // 5️⃣ All good
      next();
    } catch (error) {
      console.error("RBAC ERROR →", error);
      return res.status(500).json({
        success: false,
        message: "Authorization failed",
      });
    }
  };
};

