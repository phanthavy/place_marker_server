import type {Request, Response, NextFunction} from 'express'
const jwt = require('jsonwebtoken')

exports.authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({success: false, message: "No token provided"})
        }

        const token = authHeader.split(" ")[1];
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        
        (req as any).user = decode
        next();
    } catch (error) {
        console.error(error)
        return res.status(401).json({success: false, message: "Invalid or Expired token"})
    } 
}