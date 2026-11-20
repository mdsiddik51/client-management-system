import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    company: { type: String, trim: true },
    industry: { type: String, trim: true },
    profileImage: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      zipCode: { type: String },
    },
    status: {
      type: String,
      enum: ['Lead', 'Active', 'Inactive'],
      default: 'Lead',
    },
    notes: { type: String },
    assignedAdmin: { type: mongoose.Schema.Types.Mixed, ref: 'User' },
    userId: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

const Client = mongoose.model('Client', clientSchema);
export default Client;
