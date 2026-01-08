import mongoose from 'mongoose';

/**
 * Doctor Profile Schema
 * For healthcare professionals
 */
const doctorProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },

        // Professional Information
        specialization: {
            type: String,
            required: [true, 'Please provide your specialization'],
            enum: [
                'general-physician',
                'pediatrician',
                'gynecologist',
                'cardiologist',
                'dermatologist',
                'orthopedic',
                'dentist',
                'ent-specialist',
                'ophthalmologist',
                'psychiatrist',
                'neurologist',
                'urologist',
                'ayurvedic',
                'homeopathic',
                'physiotherapist',
                'other',
            ],
        },

        qualifications: [
            {
                degree: {
                    type: String,
                    required: true,
                },
                institution: String,
                year: Number,
                certificateUrl: String,
            },
        ],

        // Registration Details
        registrationNumber: {
            type: String,
            required: [true, 'Please provide medical registration number'],
            unique: true,
        },

        registrationCouncil: {
            type: String,
            default: 'Medical Council of India',
        },

        // Experience
        experience: {
            type: Number,
            required: [true, 'Please provide years of experience'],
            min: 0,
        },

        // Clinic/Hospital Information
        clinicName: {
            type: String,
            trim: true,
        },

        clinicAddress: {
            street: String,
            area: String,
            city: String,
            state: String,
            pincode: String,
        },

        // Consultation Details
        consultationFee: {
            inPerson: {
                type: Number,
                default: 0,
            },
            online: {
                type: Number,
                default: 0,
            },
        },

        consultationDuration: {
            type: Number,
            default: 15, // in minutes
        },

        // Availability
        availability: {
            type: String,
            enum: ['available', 'busy', 'on-leave'],
            default: 'available',
        },

        schedule: [
            {
                day: {
                    type: String,
                    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
                },
                slots: [
                    {
                        startTime: String,
                        endTime: String,
                        type: {
                            type: String,
                            enum: ['in-person', 'online', 'both'],
                            default: 'both',
                        },
                    },
                ],
            },
        ],

        // Services Offered
        servicesOffered: [
            {
                type: String,
                trim: true,
            },
        ],

        // Emergency Services
        emergencyAvailable: {
            type: Boolean,
            default: false,
        },

        emergencyContact: {
            type: String,
            match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number'],
        },

        // Languages Spoken
        languages: {
            type: [String],
            default: ['english'],
        },

        // Statistics
        totalAppointments: {
            type: Number,
            default: 0,
        },

        completedAppointments: {
            type: Number,
            default: 0,
        },

        // Reviews
        reviews: [
            {
                patient: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
                rating: {
                    type: Number,
                    required: true,
                    min: 1,
                    max: 5,
                },
                comment: {
                    type: String,
                    maxlength: 500,
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],

        // Verification
        isVerified: {
            type: Boolean,
            default: false,
        },

        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },

        verifiedAt: Date,

        // Additional Info
        about: {
            type: String,
            maxlength: 1000,
        },

        awards: [
            {
                title: String,
                year: Number,
                description: String,
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Indexes
doctorProfileSchema.index({ user: 1 });
doctorProfileSchema.index({ specialization: 1 });
doctorProfileSchema.index({ registrationNumber: 1 });
doctorProfileSchema.index({ availability: 1 });

// Calculate average rating
doctorProfileSchema.methods.calculateAverageRating = function () {
    if (this.reviews.length === 0) return 0;

    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / this.reviews.length).toFixed(1);
};

const DoctorProfile = mongoose.model('DoctorProfile', doctorProfileSchema);

export default DoctorProfile;
