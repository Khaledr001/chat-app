// import {
//   PipeTransform,
//   Injectable,
//   NotAcceptableException,
// } from '@nestjs/common';
// import { Types } from 'mongoose';

// @Injectable()
// export class ParseObjectIdPipe
//   implements PipeTransform<string, Types.ObjectId>
// {
//   transform(value: string): Types.ObjectId {
//     const isValid = Types.ObjectId.isValid(value);
//     if (!isValid) {
//       throw new NotAcceptableException(`Invalid ObjectId: ${value}`);
//     }
//     return new Types.ObjectId(value);
//   }
// }
