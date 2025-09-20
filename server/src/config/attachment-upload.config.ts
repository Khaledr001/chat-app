
export const allowedTypes = [
  'image/', // images
  'audio/', // audio
  'video/', // video
  'application/pdf', // PDF
  'application/msword', // Word .doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // Word .docx
  'application/vnd.ms-excel', // Excel .xls
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Excel .xlsx
  'application/vnd.ms-powerpoint', // PowerPoint .ppt
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PowerPoint .pptx
];

export const attachmentUploadConfig = {
  fileFilter: (req, file, callback) => {
    const isAllowed = allowedTypes.some(
      (type) => file.mimetype === type || file.mimetype.startsWith(type),
    );

    if (!isAllowed) {
      return callback(
        new Error(
          'Only image, audio, video, PDF, and document files are allowed!',
        ),
        false,
      );
    }

    callback(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
};
