import { authorizeRoles, isAuthenticated } from './../../../middlewares/auth';
import Jobseeker from './../../../models/Jobseeker';
import User from './../../../models/User';
import connectDB from './../../../libs/connectDB';

connectDB();

// For an API route to work, you need to export a function as default (a.k.a request handler),
// which then receives the following parameters:

// req: An instance of http.IncomingMessage, plus some pre-built middlewares
// res: An instance of http.ServerResponse, plus some helper functions

const handler = async (req, res) => {
  let user;
  let isAuthorize;

  switch (req.method) {
    case 'GET':
      const jobAggregate = [
        // const jobseekerSchema = new mongoose.Schema(
        //     {
        //       user: {
        //         type: mongoose.Types.ObjectId,
        //         ref: 'user',
        //         required: true,
        //       },
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user',
          },
        },
        { $unwind: '$user' },
      ];

      if (req.query.q) {
        const searchAggregate = {
          $search: {
            index: 'jobseeker',
            text: {
              path: 'skills',
              query: req.query.q,
            },
          },
        };

        jobAggregate.unshift(searchAggregate);
      }

      const jobseekers = await Jobseeker.aggregate(jobAggregate);

      return res.status(200).json({ jobseekers });
    case 'PATCH':
      user = await isAuthenticated(req, res);
      if (!user) return;

      isAuthorize = await authorizeRoles(user._id, res, 'jobseeker');
      if (!isAuthorize) return;

      const {
        avatar,
        name,
        dob,
        cv,
        province,
        city,
        district,
        postalCode,
        skills,
        about,
      } = req.body;
      if (!name)
        return res.status(400).json({ msg: 'Please provide your name.' });

      if (dob) {
        if (new Date(dob) > new Date()) {
          return res
            .status(400)
            .json({ msg: "Date of birth can't be greater than current date." });
        }
      }

      const jobseekerId = isAuthorize._id;

      const newUser = await User.findOneAndUpdate(
        { _id: user._id },
        {
          name,
          avatar,
          province,
          city,
          district,
          postalCode,
        },
        { new: true }
      );

      await Jobseeker.findOneAndUpdate(
        { _id: jobseekerId },
        {
          dob,
          cv,
          skills,
          about,
        }
      );

      return res.status(200).json({
        msg: 'Profile has been updated successfully.',
        user: newUser,
      });
    default:
      return res.status(405).json({
        msg: `${req.method} method is not allowed for this endpoint.`,
      });
  }
};

export default handler;
