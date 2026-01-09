import mongoose from 'mongoose';

/**
 * Service Post Schema
 * For workers to post their services (electrician, plumber, painter, etc.)
 */
const servicePostSchema = new mongoose.Schema(
    {
        worker: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        serviceName: {
            type: String,
            required: true,
            trim: true,
        },

        category: {
            type: String,
            required: true,
            enum: [
                'electrician',
                'plumber',
                'painter',
                'carpenter',
                'mason',
                'cleaner',
                'gardener',
                'mechanic',
                'driver',
                'cook',
                'tutor',
                'beautician',
                'tailor',
                'ac-repair',
                'appliance-repair',
                'pest-control',
                'security-guard',
                'delivery',
                'moving-packing',
                'other',
            ],
        },

        images: {
            type: [String],
            validate: {
                validator: function (v) {
                    return v && v.length > 0 && v.length <= 5;
                },
                message: 'Must have between 1 and 5 images',
            },
        },

        // Flexible pricing options
        pricing: {
            hourly: {
                rate: Number,
                minHours: {
                    type: Number,
                    default: 1,
                },
            },
            daily: {
                rate: Number,
            },
            perJob: {
                rate: Number,
                description: String, // e.g., "per room", "per installation"
            },
            custom: {
                enabled: {
                    type: Boolean,
                    default: false,
                },
                description: String, // e.g., "Negotiable based on work"
            },
        },

        description: {
            type: String,
            required: true,
            maxlength: 1000,
        },

        // Service area
        serviceArea: {
            districts: [String],
            radius: {
                type: Number, // in kilometers
                default: 10,
            },
        },

        // Availability
        availability: {
            weekdays: {
                type: Boolean,
                default: true,
            },
            weekends: {
                type: Boolean,
                default: false,
            },
            specificDates: [Date],
        },

        // Skills and experience
        skills: [String],

        experience: {
            type: Number, // years
            min: 0,
        },

        // What's included in the service
        includes: [String],

        // Tools/equipment
        hasOwnTools: {
            type: Boolean,
            default: false,
        },

        // Status
        isAvailable: {
            type: Boolean,
            default: true,
        },

        status: {
            type: String,
            enum: ['active', 'paused', 'deleted'],
            default: 'active',
        },

        // Analytics
        views: {
            type: Number,
            default: 0,
        },

        // Users who expressed interest
        interests: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
                message: String,
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],

        // Bookings count
        totalBookings: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
servicePostSchema.index({ worker: 1, createdAt: -1 });
servicePostSchema.index({ category: 1, isAvailable: 1 });
servicePostSchema.index({ 'serviceArea.districts': 1 });
servicePostSchema.index({ serviceName: 'text', description: 'text' });
servicePostSchema.index({ createdAt: -1 });

// Virtual for interest count
servicePostSchema.virtual('interestCount').get(function () {
    return this.interests.length;
});

// Method to check if user has expressed interest
servicePostSchema.methods.hasUserInterest = function (userId) {
    return this.interests.some(interest => interest.user.toString() === userId.toString());
};

// Method to add interest
servicePostSchema.methods.addInterest = function (userId, message = '') {
    if (!this.hasUserInterest(userId)) {
        this.interests.push({ user: userId, message });
        return this.save();
    }
    return Promise.resolve(this);
};

// Method to increment views
servicePostSchema.methods.incrementViews = function () {
    this.views += 1;
    return this.save();
};

// Method to get pricing display
servicePostSchema.methods.getPricingDisplay = function () {
    const display = [];

    if (this.pricing.hourly && this.pricing.hourly.rate) {
        display.push({
            type: 'hourly',
            text: `₹${this.pricing.hourly.rate}/hour${this.pricing.hourly.minHours > 1 ? ` (min ${this.pricing.hourly.minHours} hours)` : ''}`,
            value: this.pricing.hourly.rate,
        });
    }

    if (this.pricing.daily && this.pricing.daily.rate) {
        display.push({
            type: 'daily',
            text: `₹${this.pricing.daily.rate}/day`,
            value: this.pricing.daily.rate,
        });
    }

    if (this.pricing.perJob && this.pricing.perJob.rate) {
        display.push({
            type: 'perJob',
            text: `₹${this.pricing.perJob.rate}${this.pricing.perJob.description ? ` ${this.pricing.perJob.description}` : ' per job'}`,
            value: this.pricing.perJob.rate,
        });
    }

    if (this.pricing.custom && this.pricing.custom.enabled) {
        display.push({
            type: 'custom',
            text: this.pricing.custom.description || 'Negotiable',
            value: 0,
        });
    }

    return display;
};

const ServicePost = mongoose.model('ServicePost', servicePostSchema);

export default ServicePost;
