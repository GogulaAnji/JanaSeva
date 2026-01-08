import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * User Schema - Supports multiple roles
 * Roles: doctor, farmer, worker, employer, admin
 */
const userSchema = new mongoose.Schema(
    {
        // Basic Information
        name: {
            type: String,
            required: [true, 'Please provide your name'],
            trim: true,
            maxlength: [50, 'Name cannot exceed 50 characters'],
        },
        email: {
            type: String,
            required: [true, 'Please provide your email'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email',
            ],
        },
        phone: {
            type: String,
            required: [true, 'Please provide your phone number'],
            unique: true,
            match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number'],
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false,
        },

        // Role & Status
        role: {
            type: String,
            enum: ['doctor', 'farmer', 'worker', 'employer', 'admin'],
            required: [true, 'Please select a role'],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },

        // Location Information
        location: {
            village: { type: String, trim: true },
            mandal: { type: String, trim: true },
            district: { type: String, trim: true },
            state: { type: String, trim: true },
            pincode: { type: String, match: [/^[0-9]{6}$/, 'Invalid pincode'] },
            coordinates: {
                latitude: Number,
                longitude: Number,
            },
        },

        // Profile Picture
        profilePicture: {
            type: String,
            default: 'default-avatar.png',
        },

        // Language Preference
        preferredLanguage: {
            type: String,
            enum: ['english', 'telugu', 'hindi'],
            default: 'english',
        },

        // Ratings & Reviews
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        reviewCount: {
            type: Number,
            default: 0,
        },

        // Timestamps
        lastLogin: {
            type: Date,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'location.district': 1 });
userSchema.index({ 'location.state': 1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Virtual for full address
userSchema.virtual('fullAddress').get(function () {
    const { village, mandal, district, state, pincode } = this.location;
    return [village, mandal, district, state, pincode]
        .filter(Boolean)
        .join(', ');
});

const User = mongoose.model('User', userSchema);

export default User;
