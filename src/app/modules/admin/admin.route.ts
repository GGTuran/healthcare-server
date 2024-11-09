import express from "express";
import { adminController } from "./admin.controller";
import validate from "../../middlewares/validate";
import { adminValidationSchemas } from "./admin.validation";


const router = express.Router();

router.get('/', adminController.getAll);


router.get('/:id', adminController.getById);

router.patch(
    '/:id',
    validate(adminValidationSchemas.update),
    adminController.update);

router.delete('/:id', adminController.deleteAdmin);

router.delete('/soft/:id', adminController.softDelete);

export const adminRoutes = router;