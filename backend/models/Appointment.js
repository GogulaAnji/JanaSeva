import mongoose from 'mongoose';

/**
 * Appointment Schema
 * For doctor-patient appointments
 */
const appointmentSchema = new mongoose.Schema(
    {
        // Patient Information
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        // Doctor Information
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        doctorProfile: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'DoctorProfile',
            required: true,
        },

        // Appointment Details
        appointmentDate: {
            type: Date,
            required: [true, 'Please provide appointment date'],
        },

        appointmentTime: {
            type: String,
            required: [true, 'Please provide appointment time'],
        },

        duration: {
            type: Number,
            default: 15, // in minutes
        },

        // Consultation Type
        consultationType: {
            type: String,
            enum: ['in-person', 'online-video', 'online-audio', 'chat'],
            required: [true, 'Please select consultation type'],
        },

        // Appointment Status
        status: {
            type: String,
            enum: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'],
            default: 'scheduled',
        },

        // Patient Details
        patientDetails: {
            age: Number,
            gender: {
                type: String,
                enum: ['male', 'female', 'other'],
            },
            bloodGroup: String,
            weight: Number,
            height: Number,
        },

        // Symptoms & Reason
        symptoms: [
            {
                type: String,
                trim: true,
            },
        ],

        reasonForVisit: {
            type: String,
            required: [true, 'Please provide reason for visit'],
            maxlength: [500, 'Reason cannot exceed 500 characters'],
        },

        // Medical History
        medicalHistory: {
            type: String,
            maxlength: [1000, 'Medical history cannot exceed 1000 characters'],
        },

        currentMedications: [
            {
                type: String,
                trim: true,
            },
        ],

        allergies: [
            {
                type: String,
                trim: true,
            },
        ],

        // Consultation Notes (filled by doctor)
        consultationNotes: {
            diagnosis: String,
            prescription: [
                {
                    medicine: String,
                    dosage: String,
                    frequency: String,
                    duration: String,
                    instructions: String,
                },
            ],
            tests: [
                {
                    testName: String,
                    instructions: String,
                },
            ],
            advice: String,
            followUpRequired: {
                type: Boolean,
                default: false,
            },
            followUpDate: Date,
        },

        // Documents
        documents: [
            {
                name: String,
                type: {
                    type: String,
                    enum: ['report', 'prescription', 'scan', 'other'],
                },
                url: String,
                uploadedBy: {
                    type: String,
                    enum: ['patient', 'doctor'],
                },
                uploadedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],

        // Payment
        payment: {
            amount: {
                type: Number,
                required: true,
            },
            status: {
                type: String,
                enum: ['pending', 'paid', 'refunded'],
                default: 'pending',
            },
            method: {
                type: String,
                enum: ['cash', 'upi', 'card', 'net-banking'],
            },
            transactionId: String,
            paidAt: Date,
        },

        // Online Consultation Link
        meetingLink: {
            type: String,
        },

        // Cancellation
        cancellationReason: {
            type: String,
        },

        cancelledBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },

        cancelledAt: Date,

        // Reminders Sent
        remindersSent: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
appointmentSchema.index({ patient: 1 });
appointmentSchema.index({ doctor: 1 });
appointmentSchema.index({ appointmentDate: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ createdAt: -1 });

// Method to check if appointment is upcoming
appointmentSchema.methods.isUpcoming = function () {
    const appointmentDateTime = new Date(this.appointmentDate);
    return appointmentDateTime > new Date() && this.status === 'scheduled';
};

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
