import express from "express";
import { adminController } from "./admin.controller";


const router = express.Router();

router.get('/', adminController.getAll);

export const adminRoutes = router;