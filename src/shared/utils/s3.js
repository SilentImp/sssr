export const convertS3Url = url => `${url.replace('https://tmauthors.s3.amazonaws.com/', 'https://s3a.tmimgcdn.com/')}`;

export default convertS3Url;
