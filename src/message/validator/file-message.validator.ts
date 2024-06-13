import { FileTypeValidator, MaxFileSizeValidator } from '@nestjs/common';

export const FileMessageValidator = {
  validators: [
    new MaxFileSizeValidator({ maxSize: 26214400 }), //25mb
    new FileTypeValidator({ fileType: 'jpeg|png' }),
  ],
  fileIsRequired: false,
};
