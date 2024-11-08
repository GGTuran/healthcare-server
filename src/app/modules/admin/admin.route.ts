import express from "express";
import { adminController } from "./admin.controller";


const router = express.Router();

router.get('/', adminController.getAll);


router.get('/:id', adminController.getById);

router.patch('/:id', adminController.update);

router.delete('/:id', adminController.deleteAdmin);

router.delete('/soft/:id', adminController.softDelete);

export const adminRoutes = router;