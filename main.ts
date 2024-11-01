import fs from "fs";
import { rules } from "./rules";

fs.writeFileSync(
    "karabiner.json",
    JSON.stringify(
      {
        global: {
          show_in_menu_bar: false,
        },
        profiles: [
          {
            name: "Default",
            complex_modifications: {
              rules,
            },
          },
        ],
      },
      null,
      2
    )
  );