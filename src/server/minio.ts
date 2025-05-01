import dotenv from "dotenv";
import * as Minio from "minio";
import { env } from "@/env";

dotenv.config();

export const minio = new Minio.Client({
  endPoint: env.MINIO_ENDPOINT,
  port: env.MINIO_PORT,
  accessKey: env.MINIO_CLIENT_ACCESS_KEY,
  secretKey: env.MINIO_CLIENT_SECRET_KEY,
  useSSL: env.MINIO_USE_SSL,
});
