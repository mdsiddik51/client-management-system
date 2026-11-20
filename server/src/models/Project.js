import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    assignedAdmin: { type: mongoose.Schema.Types.Mixed },
    startDate: { type: Date },
    endDate: { type: Date },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Planning', 'Active', 'On Hold', 'Completed', 'Cancelled'],
      default: 'Planning',
    },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

const Project = mongoose.model('Project', projectSchema);
export default Project;
