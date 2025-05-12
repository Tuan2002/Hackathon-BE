const extendOrigin = process.env.EXTEND_CORS
  ? process.env.EXTEND_CORS.split(';')
  : [];
export const corsConfig = {
  origin: ['https://senselib.vncsoft.com', ...extendOrigin],
  credentials: true,
};
