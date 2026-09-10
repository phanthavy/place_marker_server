import type { Request, Response, NextFunction } from "express";

exports.roleMiddleware = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ success: false, message: "No access" });
    }
    next();
  };
};
