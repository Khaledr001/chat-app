import { Types } from 'mongoose';

export const getOtherMember = (members: any[], userId: Types.ObjectId): any => {
  return members.find((member) => member._id.toString() !== userId.toString());
};
