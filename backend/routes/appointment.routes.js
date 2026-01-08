import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import {
    createAppointment,
    getAppointment,
    getMyAppointments,
    getDoctorAppointments,
    updateAppointmentStatus,
    cancelAppointment,
    addConsultationNotes,
    updatePaymentStatus,
} from '../controllers/appointment.controller.js';

const router = express.Router();

// Protected routes
router.post('/', protect, createAppointment);
router.get('/my', protect, getMyAppointments);
router.get('/doctor', protect, authorize('doctor'), getDoctorAppointments);
router.get('/:id', protect, getAppointment);
router.put('/:id/status', protect, updateAppointmentStatus);
router.put('/:id/cancel', protect, cancelAppointment);
router.put('/:id/notes', protect, authorize('doctor'), addConsultationNotes);
router.put('/:id/payment', protect, updatePaymentStatus);

export default router;
