import type { Plugin } from "vite";
import { getPackageSize } from "./utils";
import dayjs, { type Dayjs } from "dayjs";
import duration from "dayjs/plugin/duration";
import gradientString from "gradient-string";
import boxen, { type Options as BoxenOptions } from "boxen";
dayjs.extend(duration);

const welcomeMessage = gradientString("cyan", "magenta").multiline(
  `
DDDDDDDDDDDDD           SSSSSSSSSSSSSSS
D::::::::::::DDD      SS:::::::::::::::S
D:::::::::::::::DD   S:::::SSSSSS::::::S
DDD:::::DDDDD:::::D  S:::::S     SSSSSSS
  D:::::D    D:::::D S:::::S
  D:::::D     D:::::DS:::::S
  D:::::D     D:::::D S::::SSSS
  D:::::D     D:::::D  SS::::::SSSSS
  D:::::D     D:::::D    SSS::::::::SS
  D:::::D     D:::::D       SSSSSS::::S
  D:::::D     D:::::D            S:::::S
  D:::::D    D:::::D             S:::::S
DDD:::::DDDDD:::::D  SSSSSSS     S:::::S
D:::::::::::::::DD   S::::::SSSSSS:::::S
D::::::::::::DDD     S:::::::::::::::SS
DDDDDDDDDDDDD         SSSSSSSSSSSSSSS
`
);

const boxenOptions: BoxenOptions = {
  padding: 0.5,
  borderColor: "cyan",
  borderStyle: "round"
};

export function viteBuildInfo(): Plugin {
  let config: { command: string };
  let startTime: Dayjs;
  let endTime: Dayjs;
  let outDir: string;
  return {
    name: "vite:buildInfo",
    configResolved(resolvedConfig) {
      config = resolvedConfig;
      outDir = resolvedConfig.build?.outDir ?? "dist";
    },
    buildStart() {
      console.log(boxen(welcomeMessage, boxenOptions));
      if (config.command === "build") {
        startTime = dayjs(new Date());
      }
    },
    closeBundle() {
      if (config.command === "build") {
        endTime = dayjs(new Date());
        getPackageSize({
          folder: outDir,
          callback: (size: string) => {
            console.log(
              boxen(
                gradientString("cyan", "magenta").multiline(
                  `🎉 恭喜打包完成（总用时${dayjs
                    .duration(endTime.diff(startTime))
                    .format("mm分ss秒")}，打包后的大小为${size}）`
                ),
                boxenOptions
              )
            );
          }
        });
      }
    }
  };
}
