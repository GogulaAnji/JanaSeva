import mongoose from 'mongoose';

/**
 * Community Service Schema
 * For blood donation, emergency help, lost & found, announcements
 */
const communityServiceSchema = new mongoose.Schema(
    {
        // Posted By
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        // Service Type
        serviceType: {
            type: String,
            required: [true, 'Please select service type'],
            enum: [
                'blood-donation',
                'emergency-help',
                'lost-found',
                'community-event',
                'announcement',
                'free-learning',
                'volunteer',
                'donation-request',
            ],
        },

        // Title & Description
        title: {
            type: String,
            required: [true, 'Please provide a title'],
            trim: true,
            maxlength: [150, 'Title cannot exceed 150 characters'],
        },

        description: {
            type: String,
            required: [true, 'Please provide description'],
            maxlength: [2000, 'Description cannot exceed 2000 characters'],
        },

        // Blood Donation Specific Fields
        bloodDonation: {
            bloodGroup: {
                type: String,
                enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
            },
            unitsRequired: Number,
            urgency: {
                type: String,
                enum: ['immediate', 'urgent', 'normal'],
            },
            hospitalName: String,
            patientName: String,
            contactPerson: String,
            contactPhone: String,
        },

        // Emergency Help Specific Fields
        emergencyHelp: {
            emergencyType: {
                type: String,
                enum: ['medical', 'accident', 'natural-disaster', 'fire', 'other'],
            },
            severity: {
                type: String,
                enum: ['critical', 'high', 'medium', 'low'],
            },
            peopleAffected: Number,
            helpNeeded: [String],
        },

        // Lost & Found Specific Fields
        lostFound: {
            itemType: {
                type: String,
                enum: ['person', 'pet', 'document', 'vehicle', 'belongings', 'other'],
            },
            status: {
                type: String,
                enum: ['lost', 'found'],
            },
            itemDescription: String,
            lastSeenDate: Date,
            lastSeenLocation: String,
            images: [String],
            identificationMarks: String,
            rewardOffered: Number,
        },

        // Community Event Specific Fields
        communityEvent: {
            eventDate: Date,
            eventTime: String,
            venue: String,
            organizer: String,
            registrationRequired: {
                type: Boolean,
                default: false,
            },
            registrationLink: String,
            maxParticipants: Number,
            currentParticipants: {
                type: Number,
                default: 0,
            },
            eventCategory: {
                type: String,
                enum: ['cultural', 'educational', 'sports', 'health', 'social', 'religious', 'other'],
            },
        },

        // Free Learning Specific Fields
        freeLearning: {
            subject: String,
            level: {
                type: String,
                enum: ['beginner', 'intermediate', 'advanced'],
            },
            duration: String,
            schedule: String,
            mode: {
                type: String,
                enum: ['online', 'offline', 'hybrid'],
            },
            instructor: String,
            materialsProvided: Boolean,
            certificateOffered: Boolean,
        },

        // Location
        location: {
            village: String,
            mandal: String,
            district: String,
            state: String,
            pincode: String,
            coordinates: {
                latitude: Number,
                longitude: Number,
            },
            address: String,
        },

        // Contact Information
        contactInfo: {
            name: String,
            phone: String,
            email: String,
            alternatePhone: String,
        },

        // Status
        status: {
            type: String,
            enum: ['active', 'fulfilled', 'closed', 'expired'],
            default: 'active',
        },

        // Priority
        priority: {
            type: String,
            enum: ['critical', 'high', 'medium', 'low'],
            default: 'medium',
        },

        // Expiry Date
        expiryDate: {
            type: Date,
        },

        // Responses/Volunteers
        responses: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
                message: String,
                contactPhone: String,
                respondedAt: {
                    type: Date,
                    default: Date.now,
                },
                status: {
                    type: String,
                    enum: ['pending', 'accepted', 'rejected'],
                    default: 'pending',
                },
            },
        ],

        // Images
        images: [
            {
                type: String,
            },
        ],

        // Views Count
        viewsCount: {
            type: Number,
            default: 0,
        },

        // Verification
        isVerified: {
            type: Boolean,
            default: false,
        },

        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
communityServiceSchema.index({ postedBy: 1 });
communityServiceSchema.index({ serviceType: 1 });
communityServiceSchema.index({ status: 1 });
communityServiceSchema.index({ priority: 1 });
communityServiceSchema.index({ 'location.district': 1 });
communityServiceSchema.index({ createdAt: -1 });

// Method to check if service is expired
communityServiceSchema.methods.isExpired = function () {
    if (!this.expiryDate) return false;
    return new Date() > this.expiryDate;
};

const CommunityService = mongoose.model('CommunityService', communityServiceSchema);

export default CommunityService;
