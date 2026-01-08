import mongoose from 'mongoose';

/**
 * Worker Profile Schema
 * For local service providers (electrician, plumber, driver, etc.)
 */
const workerProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },

        // Skill Information
        skillCategory: {
            type: String,
            required: [true, 'Please select a skill category'],
            enum: [
                'electrician',
                'plumber',
                'driver',
                'mason',
                'painter',
                'carpenter',
                'house-helper',
                'delivery-boy',
                'farm-labor',
                'mechanic',
                'welder',
                'gardener',
                'security-guard',
                'cook',
                'tutor',
                'other',
            ],
        },

        skills: [
            {
                type: String,
                trim: true,
            },
        ],

        // Experience
        experience: {
            type: Number,
            required: [true, 'Please provide years of experience'],
            min: 0,
            max: 50,
        },

        experienceDetails: {
            type: String,
            maxlength: [500, 'Experience details cannot exceed 500 characters'],
        },

        // Availability
        availability: {
            type: String,
            enum: ['available', 'busy', 'unavailable'],
            default: 'available',
        },

        workingDays: {
            type: [String],
            enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
            default: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        },

        workingHours: {
            start: {
                type: String,
                default: '09:00',
            },
            end: {
                type: String,
                default: '18:00',
            },
        },

        // Payment Information
        expectedPay: {
            amount: {
                type: Number,
                required: [true, 'Please provide expected pay'],
                min: 0,
            },
            type: {
                type: String,
                enum: ['hourly', 'daily', 'monthly', 'per-task'],
                default: 'daily',
            },
        },

        // Certifications & Documents
        certifications: [
            {
                name: String,
                issuedBy: String,
                issuedDate: Date,
                documentUrl: String,
            },
        ],

        // ID Proof
        idProof: {
            type: {
                type: String,
                enum: ['aadhar', 'pan', 'voter-id', 'driving-license'],
            },
            number: String,
            documentUrl: String,
            verified: {
                type: Boolean,
                default: false,
            },
        },

        // Work Portfolio
        portfolio: [
            {
                title: String,
                description: String,
                imageUrl: String,
                completedDate: Date,
            },
        ],

        // Service Area
        serviceRadius: {
            type: Number,
            default: 10, // in kilometers
            min: 1,
            max: 100,
        },

        // Statistics
        totalJobs: {
            type: Number,
            default: 0,
        },

        completedJobs: {
            type: Number,
            default: 0,
        },

        // Reviews
        reviews: [
            {
                user: {
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

        // Verification Status
        isVerified: {
            type: Boolean,
            default: false,
        },

        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },

        verifiedAt: Date,
    },
    {
        timestamps: true,
    }
);

// Indexes
workerProfileSchema.index({ user: 1 });
workerProfileSchema.index({ skillCategory: 1 });
workerProfileSchema.index({ availability: 1 });
workerProfileSchema.index({ 'expectedPay.amount': 1 });

// Calculate average rating
workerProfileSchema.methods.calculateAverageRating = function () {
    if (this.reviews.length === 0) return 0;

    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / this.reviews.length).toFixed(1);
};

const WorkerProfile = mongoose.model('WorkerProfile', workerProfileSchema);

export default WorkerProfile;
