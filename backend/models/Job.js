import mongoose from 'mongoose';

/**
 * Job Schema
 * For employment opportunities
 */
const jobSchema = new mongoose.Schema(
    {
        // Posted By
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        // Job Details
        title: {
            type: String,
            required: [true, 'Please provide job title'],
            trim: true,
            maxlength: [100, 'Job title cannot exceed 100 characters'],
        },

        description: {
            type: String,
            required: [true, 'Please provide job description'],
            maxlength: [2000, 'Description cannot exceed 2000 characters'],
        },

        // Job Category
        category: {
            type: String,
            required: [true, 'Please select a job category'],
            enum: [
                'agriculture',
                'construction',
                'retail',
                'hospitality',
                'healthcare',
                'education',
                'manufacturing',
                'transportation',
                'it-software',
                'sales-marketing',
                'customer-service',
                'security',
                'housekeeping',
                'other',
            ],
        },

        // Job Type
        jobType: {
            type: String,
            required: [true, 'Please select job type'],
            enum: ['full-time', 'part-time', 'contract', 'temporary', 'internship', 'daily-wage'],
        },

        // Experience Required
        experienceRequired: {
            min: {
                type: Number,
                default: 0,
            },
            max: {
                type: Number,
                default: 50,
            },
        },

        // Skills Required
        skillsRequired: [
            {
                type: String,
                trim: true,
            },
        ],

        // Education Required
        educationRequired: {
            type: String,
            enum: ['no-education', 'primary', 'secondary', 'higher-secondary', 'diploma', 'graduate', 'post-graduate', 'any'],
            default: 'any',
        },

        // Salary/Wage
        salary: {
            min: {
                type: Number,
                required: [true, 'Please provide minimum salary'],
            },
            max: {
                type: Number,
            },
            type: {
                type: String,
                enum: ['hourly', 'daily', 'weekly', 'monthly', 'yearly'],
                default: 'monthly',
            },
            negotiable: {
                type: Boolean,
                default: true,
            },
        },

        // Location
        location: {
            village: String,
            mandal: String,
            district: {
                type: String,
                required: [true, 'Please provide district'],
            },
            state: {
                type: String,
                required: [true, 'Please provide state'],
            },
            pincode: String,
            coordinates: {
                latitude: Number,
                longitude: Number,
            },
        },

        // Company/Employer Details
        companyName: {
            type: String,
            trim: true,
        },

        companyWebsite: {
            type: String,
            trim: true,
        },

        // Contact Information
        contactPerson: {
            name: String,
            phone: String,
            email: String,
        },

        // Vacancies
        numberOfVacancies: {
            type: Number,
            default: 1,
            min: 1,
        },

        // Application Deadline
        applicationDeadline: {
            type: Date,
        },

        // Job Status
        status: {
            type: String,
            enum: ['active', 'closed', 'on-hold', 'filled'],
            default: 'active',
        },

        // Applications
        applications: [
            {
                applicant: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
                appliedAt: {
                    type: Date,
                    default: Date.now,
                },
                status: {
                    type: String,
                    enum: ['pending', 'shortlisted', 'rejected', 'hired'],
                    default: 'pending',
                },
                resumeUrl: String,
                coverLetter: String,
            },
        ],

        // Additional Benefits
        benefits: [
            {
                type: String,
                trim: true,
            },
        ],

        // Work Schedule
        workSchedule: {
            type: String,
            trim: true,
        },

        // Remote Work
        remoteWork: {
            type: Boolean,
            default: false,
        },

        // Accommodation Provided
        accommodationProvided: {
            type: Boolean,
            default: false,
        },

        // Food Provided
        foodProvided: {
            type: Boolean,
            default: false,
        },

        // Views Count
        viewsCount: {
            type: Number,
            default: 0,
        },

        // Featured Job
        isFeatured: {
            type: Boolean,
            default: false,
        },

        // Verification
        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
jobSchema.index({ postedBy: 1 });
jobSchema.index({ category: 1 });
jobSchema.index({ jobType: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ 'location.district': 1 });
jobSchema.index({ 'location.state': 1 });
jobSchema.index({ createdAt: -1 });

// Method to check if job is expired
jobSchema.methods.isExpired = function () {
    if (!this.applicationDeadline) return false;
    return new Date() > this.applicationDeadline;
};

const Job = mongoose.model('Job', jobSchema);

export default Job;
