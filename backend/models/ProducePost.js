import mongoose from 'mongoose';

/**
 * Produce Post Schema
 * Individual product listings by farmers
 */
const producePostSchema = new mongoose.Schema(
    {
        farmer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        productName: {
            type: String,
            required: true,
            trim: true,
        },

        category: {
            type: String,
            required: true,
            enum: ['vegetables', 'fruits', 'grains', 'pulses', 'dairy', 'organic', 'flowers', 'spices', 'other'],
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

        price: {
            value: {
                type: Number,
                required: true,
                min: 0,
            },
            unit: {
                type: String,
                default: 'per kg',
                enum: ['per kg', 'per quintal', 'per ton', 'per piece', 'per dozen', 'per bunch'],
            },
        },

        quantity: {
            value: {
                type: Number,
                required: true,
                min: 0,
            },
            unit: {
                type: String,
                default: 'kg',
                enum: ['kg', 'quintal', 'ton', 'pieces', 'dozen', 'bunches', 'bags'],
            },
        },

        quality: {
            type: String,
            enum: ['premium', 'standard', 'economy'],
            default: 'standard',
        },

        description: {
            type: String,
            maxlength: 500,
        },

        isOrganic: {
            type: Boolean,
            default: false,
        },

        isAvailable: {
            type: Boolean,
            default: true,
        },

        location: {
            village: String,
            district: String,
            state: String,
            coordinates: {
                latitude: Number,
                longitude: Number,
            },
        },

        // Analytics
        views: {
            type: Number,
            default: 0,
        },

        // Users who expressed interest
        interests: [
            {
                buyer: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],

        // Harvest/Available dates
        availableFrom: {
            type: Date,
            default: Date.now,
        },

        availableUntil: Date,

        // Status
        status: {
            type: String,
            enum: ['active', 'sold', 'expired', 'deleted'],
            default: 'active',
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for better query performance
producePostSchema.index({ farmer: 1, createdAt: -1 });
producePostSchema.index({ category: 1, isAvailable: 1 });
producePostSchema.index({ 'location.district': 1 });
producePostSchema.index({ 'location.state': 1 });
producePostSchema.index({ productName: 'text', description: 'text' });
producePostSchema.index({ createdAt: -1 });

// Virtual for interest count
producePostSchema.virtual('interestCount').get(function () {
    return this.interests.length;
});

// Method to check if user has expressed interest
producePostSchema.methods.hasUserInterest = function (userId) {
    return this.interests.some(interest => interest.buyer.toString() === userId.toString());
};

// Method to add interest
producePostSchema.methods.addInterest = function (userId) {
    if (!this.hasUserInterest(userId)) {
        this.interests.push({ buyer: userId });
        return this.save();
    }
    return Promise.resolve(this);
};

// Method to increment views
producePostSchema.methods.incrementViews = function () {
    this.views += 1;
    return this.save();
};

const ProducePost = mongoose.model('ProducePost', producePostSchema);

export default ProducePost;
