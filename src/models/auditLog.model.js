import mongoose, { Schema } from "mongoose";

const auditLogSchema = new Schema(
  {
    action: { type: String, required: true },
    target: { type: String, required: true },
    entityId: { type: mongoose.Schema.Types.ObjectId },
    entityType: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId },
    ipAddress: { type: String },
  },
  { timestamps: true }
);

const AuditLog = mongoose.model("AuditLog", auditLogSchema);
