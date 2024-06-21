import fs from "fs";
import { KarabinerRules } from "./types";
import { createHyperSubLayers, app, open } from "./utils";
import * as ShiftLock from "./shiftlock"


const rules: KarabinerRules[] = [
  {
    description: "Caps Lock to Control",
    manipulators: [
      {
        description: "⇪ -> ^",
        from: {
          key_code: "caps_lock",
          modifiers: {
            optional: ["any"],
          },
        },
        to: [
          {
            key_code: "left_control",
          },
        ],
        type: "basic",
      },
    ],
  },
  // Define the Hyper key itself
  {
    description: "Hyper Key (⌃⌥⇧⌘)",
    manipulators: [
      {
        description: "Right ⌘ -> Hyper Key",
        from: {
          key_code: "right_command",
          modifiers: {
            optional: ["any"],
          },
        },
        to: [
          {
            set_variable: {
              name: "hyper",
              value: 1,
            },
          },
        ],
        to_after_key_up: [
          {
            set_variable: {
              name: "hyper",
              value: 0,
            },
          },
        ],
        to_if_alone: [
          {
            key_code: "escape",
          },
        ],
        type: "basic",
      },
    ],
  },
  {
    description: "Change ⌘^hjkl to arrow keys",
    manipulators: [
      {
        from: {
          key_code: "h",
          modifiers: {
            mandatory: ["command", "control"],
            optional: ["any"],
          },
        },
        to: [
          {
            key_code: "left_arrow",
          },
        ],
        type: "basic",
      },
      {
        from: {
          key_code: "j",
          modifiers: {
            mandatory: ["command", "control"],
            optional: ["any"],
          },
        },
        to: [
          {
            key_code: "down_arrow",
          },
        ],
        type: "basic",
      },
      {
        from: {
          key_code: "k",
          modifiers: {
            mandatory: ["command", "control"],
            optional: ["any"],
          },
        },
        to: [
          {
            key_code: "up_arrow",
          },
        ],
        type: "basic",
      },
      {
        from: {
          key_code: "l",
          modifiers: {
            mandatory: ["command", "control"],
            optional: ["any"],
          },
        },
        to: [
          {
            key_code: "right_arrow",
          },
        ],
        type: "basic",
      },
    ],
  },
  // Experimental: Trying to implement a shift-lock feature so I can emulate Emacs' set-mark feature
  {
    description: "Shift-lock toggle",
    manipulators: [
      ShiftLock.on({key_code: "spacebar", modifiers: { mandatory: ["control"] }}),

      ShiftLock.off({key_code: "spacebar", modifiers: { mandatory: ["control"] }}),
      ShiftLock.off({key_code: "escape" }),
      ShiftLock.off({key_code: "delete_or_backspace" }, {passThrough: true}),
      ShiftLock.off({key_code: "g", modifiers: { mandatory: ["control"] }}),

      ShiftLock.transform({key_code: "n", modifiers: { mandatory: ["control"] }}, "down_arrow"),
      ShiftLock.transform({key_code: "p", modifiers: { mandatory: ["control"] }}, "up_arrow"),
      ShiftLock.transform({key_code: "f", modifiers: { mandatory: ["control"] }}, "right_arrow"),
      ShiftLock.transform({key_code: "b", modifiers: { mandatory: ["control"] }}, "left_arrow"),
      ShiftLock.transform({key_code: "down_arrow"}, "down_arrow"),
      ShiftLock.transform({key_code: "up_arrow"}, "up_arrow"),
      ShiftLock.transform({key_code: "right_arrow"}, "right_arrow"),
      ShiftLock.transform({key_code: "left_arrow"}, "left_arrow"),
    ],
  },
  ...createHyperSubLayers({
    // o = "Open" applications
    o: {
      1: app("1Password"),
      g: app("Google Chrome"),
      c: app("Notion Calendar"),
      v: app("Visual Studio Code"),
      s: app("Slack"),
      n: app("Notion"),
      t: app("Terminal"),
      f: app("Finder"),
      r: app("Texts"),
      // "i"Message
      p: app("Spotify"),
    },

    // s = "System"
    s: {
      u: { to: [ { key_code: "volume_increment" } ] },
      j: { to: [ { key_code: "volume_decrement" } ] },
      i: { to: [ { key_code: "display_brightness_increment" } ],},
      k: { to: [ { key_code: "display_brightness_decrement" } ],},
      p: { to: [ { key_code: "play_or_pause" } ],},
      // "T"heme
      t: open(`raycast://extensions/raycast/system/toggle-system-appearance`),
      c: open("raycast://extensions/raycast/system/open-camera"),
    },

    // r = "Raycast"
    r: {
      c: open("raycast://extensions/thomas/color-picker/pick-color"),
      n: open("raycast://script-commands/dismiss-notifications"),
      k: open("raycast://extensions/raycast/raycast/confetti"),
      a: open("raycast://extensions/raycast/raycast-ai/ai-chat"),
      h: open("raycast://extensions/raycast/clipboard-history/clipboard-history"),
    },
  }),
];

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
