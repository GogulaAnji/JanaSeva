import Appointment from '../models/Appointment.js';

export const createAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.create({ patient: req.user.id, ...req.body });
        res.status(201).json({ success: true, message: 'Appointment booked successfully', appointment });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create appointment', error: error.message });
    }
};

export const getAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id).populate('patient doctor', 'name phone email');
        if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
        if (appointment.patient._id.toString() !== req.user.id.toString() && appointment.doctor._id.toString() !== req.user.id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        res.status(200).json({ success: true, appointment });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get appointment', error: error.message });
    }
};

export const getMyAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ patient: req.user.id }).populate('doctor', 'name phone').sort({ appointmentDate: -1 });
        res.status(200).json({ success: true, count: appointments.length, appointments });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get appointments', error: error.message });
    }
};

export const getDoctorAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctor: req.user.id }).populate('patient', 'name phone').sort({ appointmentDate: -1 });
        res.status(200).json({ success: true, count: appointments.length, appointments });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get appointments', error: error.message });
    }
};

export const updateAppointmentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
        appointment.status = status;
        await appointment.save();
        res.status(200).json({ success: true, message: 'Appointment status updated', appointment });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update appointment', error: error.message });
    }
};

export const cancelAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
        appointment.status = 'cancelled';
        appointment.cancelledBy = req.user.id;
        appointment.cancelledAt = new Date();
        appointment.cancellationReason = req.body.reason;
        await appointment.save();
        res.status(200).json({ success: true, message: 'Appointment cancelled successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to cancel appointment', error: error.message });
    }
};

export const addConsultationNotes = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
        if (appointment.doctor.toString() !== req.user.id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        appointment.consultationNotes = req.body;
        appointment.status = 'completed';
        await appointment.save();
        res.status(200).json({ success: true, message: 'Consultation notes added successfully', appointment });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to add consultation notes', error: error.message });
    }
};

export const updatePaymentStatus = async (req, res) => {
    try {
        const { status, method, transactionId } = req.body;
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
        appointment.payment.status = status;
        appointment.payment.method = method;
        appointment.payment.transactionId = transactionId;
        if (status === 'paid') appointment.payment.paidAt = new Date();
        await appointment.save();
        res.status(200).json({ success: true, message: 'Payment status updated', appointment });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update payment', error: error.message });
    }
};
