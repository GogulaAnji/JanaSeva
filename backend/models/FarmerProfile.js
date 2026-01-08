import mongoose from 'mongoose';

/**
 * Farmer Profile Schema
 * For agricultural producers and sellers
 */
const farmerProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },

        // Farm Information
        farmName: {
            type: String,
            trim: true,
        },

        farmSize: {
            value: {
                type: Number,
                min: 0,
            },
            unit: {
                type: String,
                enum: ['acres', 'hectares', 'guntas'],
                default: 'acres',
            },
        },

        farmLocation: {
            village: String,
            mandal: String,
            district: String,
            state: String,
            pincode: String,
            coordinates: {
                latitude: Number,
                longitude: Number,
            },
        },

        // Farming Type
        farmingType: {
            type: String,
            enum: ['organic', 'conventional', 'mixed'],
            default: 'conventional',
        },

        // Crops
        crops: [
            {
                name: {
                    type: String,
                    required: true,
                },
                category: {
                    type: String,
                    enum: ['cereals', 'pulses', 'vegetables', 'fruits', 'spices', 'cash-crops', 'other'],
                },
                season: {
                    type: String,
                    enum: ['kharif', 'rabi', 'zaid', 'year-round'],
                },
                area: {
                    value: Number,
                    unit: String,
                },
            },
        ],

        // Current Produce Available
        produceListings: [
            {
                cropName: {
                    type: String,
                    required: true,
                },
                quantity: {
                    value: {
                        type: Number,
                        required: true,
                        min: 0,
                    },
                    unit: {
                        type: String,
                        enum: ['kg', 'quintal', 'ton', 'bags'],
                        default: 'kg',
                    },
                },
                expectedPrice: {
                    value: Number,
                    unit: {
                        type: String,
                        default: 'per kg',
                    },
                },
                quality: {
                    type: String,
                    enum: ['premium', 'standard', 'economy'],
                    default: 'standard',
                },
                availableFrom: Date,
                availableUntil: Date,
                images: [String],
                description: String,
                isActive: {
                    type: Boolean,
                    default: true,
                },
            },
        ],

        // Livestock (if any)
        livestock: [
            {
                type: {
                    type: String,
                    enum: ['cattle', 'buffalo', 'goat', 'sheep', 'poultry', 'other'],
                },
                count: Number,
                purpose: {
                    type: String,
                    enum: ['dairy', 'meat', 'eggs', 'breeding', 'other'],
                },
            },
        ],

        // Equipment Owned
        equipment: [
            {
                name: String,
                available: {
                    type: Boolean,
                    default: false,
                },
                rentalPrice: Number,
            },
        ],

        // Certifications
        certifications: [
            {
                type: {
                    type: String,
                    enum: ['organic', 'good-agricultural-practices', 'fair-trade', 'other'],
                },
                issuedBy: String,
                issuedDate: Date,
                expiryDate: Date,
                certificateUrl: String,
            },
        ],

        // Bank Details (for direct payments)
        bankDetails: {
            accountHolderName: String,
            accountNumber: String,
            ifscCode: String,
            bankName: String,
            branch: String,
            upiId: String,
        },

        // Transport Needs
        transportRequired: {
            type: Boolean,
            default: false,
        },

        // Government Schemes Enrolled
        governmentSchemes: [
            {
                schemeName: String,
                enrollmentDate: Date,
                benefitReceived: String,
            },
        ],

        // Statistics
        totalSales: {
            type: Number,
            default: 0,
        },

        totalRevenue: {
            type: Number,
            default: 0,
        },

        // Reviews from Buyers
        reviews: [
            {
                buyer: {
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
    },
    {
        timestamps: true,
    }
);

// Indexes
farmerProfileSchema.index({ user: 1 });
farmerProfileSchema.index({ 'farmLocation.district': 1 });
farmerProfileSchema.index({ 'farmLocation.state': 1 });
farmerProfileSchema.index({ 'produceListings.cropName': 1 });

// Calculate average rating
farmerProfileSchema.methods.calculateAverageRating = function () {
    if (this.reviews.length === 0) return 0;

    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / this.reviews.length).toFixed(1);
};

const FarmerProfile = mongoose.model('FarmerProfile', farmerProfileSchema);

export default FarmerProfile;
