import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setCodec("h264");
// H.264 + yuv420p plays natively on iPad / iPhone (Files, Photos, Safari).
Config.setPixelFormat("yuv420p");
