import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    avatar: {
      type: String,
      default:
        'https://res.cloudinary.com/dvpy1nsjp/image/upload/v1635570881/sample.jpg',
    },
    province: {
      type: String,
    },
    city: {
      type: String,
    },
    district: {
      type: String,
    },
    postalCode: {
      type: String,
    },
    type: {
      type: String,
      default: 'register',
    },
    role: {
      type: String,
      default: 'jobseeker',
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.user || mongoose.model('user', userSchema);
export default User;
