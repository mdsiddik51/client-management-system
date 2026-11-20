import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        'client_created',
        'client_updated',
        'client_deleted',
        'project_created',
        'project_updated',
        'project_deleted',
        'task_created',
        'task_updated',
        'task_deleted',
        'user_updated',
        'image_uploaded',
      ],
      required: true,
    },
    userId: { type: mongoose.Schema.Types.Mixed, required: true },
    targetId: { type: mongoose.Schema.Types.Mixed },
    targetModel: { type: String },
    description: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

const Activity = mongoose.model('Activity', activitySchema);
export default Activity;
