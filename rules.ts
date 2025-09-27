import { KarabinerRules } from "./types";
import { app, createHyperSubLayers, open } from "./utils";
import * as ShiftLock from "./shiftlock";

export const rules: KarabinerRules[] = [
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
  {
    description: "Hyper Key (Right ⌘)",
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
      ShiftLock.on({
        key_code: "spacebar",
        modifiers: { mandatory: ["control"] },
      }),
      ShiftLock.off({
        key_code: "spacebar",
        modifiers: { mandatory: ["control"] },
      }),
      ShiftLock.off({ key_code: "escape" }, { passThrough: true }), // pass-through so it also cancels the selection
      ShiftLock.off({ key_code: "delete_or_backspace" }, { passThrough: true }),
      ShiftLock.off(
        { key_code: "v", modifiers: { mandatory: ["command"] } },
        { passThrough: true }
      ),
      ShiftLock.off(
        { key_code: "x", modifiers: { mandatory: ["command"] } },
        { passThrough: true }
      ),
      ShiftLock.off(
        { key_code: "g", modifiers: { mandatory: ["control"] } },
        { passThrough: false, alsoSendKey: "escape" }
      ), // C-g

      // TODO: I haven't been able to implement shift-lock as a generic add shift to all key presses so for now I'll have to re-define
      // all navigation keys with shift-lock enabled.
      ShiftLock.transform(
        { key_code: "n", modifiers: { mandatory: ["control"] } },
        { key_code: "down_arrow" }
      ), // C-n
      ShiftLock.transform(
        { key_code: "p", modifiers: { mandatory: ["control"] } },
        { key_code: "up_arrow" }
      ), // C-p
      ShiftLock.transform(
        { key_code: "f", modifiers: { mandatory: ["control"] } },
        { key_code: "right_arrow" }
      ), // C-f
      ShiftLock.transform(
        { key_code: "f", modifiers: { mandatory: ["option"] } },
        { key_code: "right_arrow", modifiers: ["option"] }
      ), // M-f
      ShiftLock.transform(
        { key_code: "b", modifiers: { mandatory: ["control"] } },
        { key_code: "left_arrow" }
      ), // C-b
      ShiftLock.transform(
        { key_code: "b", modifiers: { mandatory: ["option"] } },
        { key_code: "left_arrow", modifiers: ["option"] }
      ), // M-b
      ShiftLock.transform(
        { key_code: "e", modifiers: { mandatory: ["control"] } },
        { key_code: "right_arrow", modifiers: ["command"] }
      ), // C-e
      ShiftLock.transform(
        { key_code: "a", modifiers: { mandatory: ["control"] } },
        { key_code: "left_arrow", modifiers: ["command"] }
      ), // C-a
      ShiftLock.transform(
        { key_code: "v", modifiers: { mandatory: ["control"] } },
        { key_code: "page_down" }
      ), // C-v
      ShiftLock.transform(
        { key_code: "v", modifiers: { mandatory: ["option"] } },
        { key_code: "page_up" }
      ), // M-v
      ShiftLock.transform(
        { key_code: "left_arrow" },
        { key_code: "left_arrow" }
      ),
      ShiftLock.transform({ key_code: "up_arrow" }, { key_code: "up_arrow" }),
      ShiftLock.transform(
        { key_code: "right_arrow" },
        { key_code: "right_arrow" }
      ),
      ShiftLock.transform(
        { key_code: "down_arrow" },
        { key_code: "down_arrow" }
      ),
    ],
  },
  // Emacs navigation
  {
    description: "Emacs navigation and text manipulation",
    manipulators: [
      // M-d
      {
        from: {
          key_code: "d",
          modifiers: {
            mandatory: ["option"],
          },
        },
        to: [
          {
            key_code: "delete_forward",
            modifiers: ["option"],
          },
        ],
        type: "basic",
      },
      // C-p
      {
        from: {
          key_code: "p",
          modifiers: {
            mandatory: ["control"],
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
      // C-b → left arrow
      {
        from: {
          key_code: "b",
          modifiers: {
            mandatory: ["control"],
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
      // C-f → right arrow
      {
        from: {
          key_code: "f",
          modifiers: {
            mandatory: ["control"],
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
      // C-g → escape
      {
        from: {
          key_code: "g",
          modifiers: {
            mandatory: ["control"],
            optional: ["any"],
          },
        },
        to: [
          {
            key_code: "escape",
          },
        ],
        type: "basic",
      },
      // C-n
      {
        from: {
          key_code: "n",
          modifiers: {
            mandatory: ["control"],
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
      // M-b
      {
        from: {
          key_code: "b",
          modifiers: {
            mandatory: ["option"],
          },
        },
        to: [
          {
            key_code: "left_arrow",
            modifiers: ["option"],
          },
        ],
        type: "basic",
      },
      // M-f
      {
        from: {
          key_code: "f",
          modifiers: {
            mandatory: ["option"],
          },
        },
        to: [
          {
            key_code: "right_arrow",
            modifiers: ["option"],
          },
        ],
        type: "basic",
      },
      // C-v
      {
        from: {
          key_code: "v",
          modifiers: {
            mandatory: ["control"],
            optional: ["any"],
          },
        },
        to: [
          {
            key_code: "page_down",
          },
        ],
        type: "basic",
      },
      // M-v
      {
        from: {
          key_code: "v",
          modifiers: {
            mandatory: ["option"],
            optional: ["any"],
          },
        },
        to: [
          {
            key_code: "page_up",
          },
        ],
        type: "basic",
      },
    ],
  },
  ...createHyperSubLayers({
    // a = "Application"
    o: {
      e: app("Visual Studio Code"),
      t: app("Ghostty"),
    },
    // r = "Raycast"
    r: {
      // Can't seem to decide on 'c' for clipboard history or 'v' as I'm about to paste
      c: open(
        "raycast://extensions/raycast/clipboard-history/clipboard-history"
      ),
      v: open(
        "raycast://extensions/raycast/clipboard-history/clipboard-history"
      ),
      k: open("raycast://extensions/raycast/raycast/confetti"),
      s: open("raycast://extensions/raycast/snippets/search-snippets"),
      i: open("raycast://extensions/raycast/screenshots/search-screenshots"),
      n: open("raycast://extensions/raycast/raycast-notes/raycast-notes"),
    },
  }),
];
