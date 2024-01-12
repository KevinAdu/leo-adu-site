export const CLOUDINARY_URL_ROOT = 'https://res.cloudinary.com/dz8vyplpm/image/upload/';

const versionAndFilenameRegex = /\/v.*$/g;
export const getCloudinaryFilename = (image: string) => image.match(versionAndFilenameRegex);