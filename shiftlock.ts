import { From, KeyCode, Manipulator, Modifiers, To } from "./types";

const SHIFT_LOCK = "shiftlock";

/**
 * Toggle 'shift lock' on
 */
export function on(from: From): Manipulator {
  return {
    from: from,
    to: [
      {
        set_variable: {
          name: SHIFT_LOCK,
          value: 1,
        },
      },
    ],
    conditions: [
      {
        type: "variable_if",
        name: SHIFT_LOCK,
        value: 0,
      },
    ],
    type: "basic",
  };
}

type OffOptions = {
  passThrough: boolean;
};

/**
 * Toggle 'shift lock' off
 * If passThrough is enabled it will also pass the key pass through. Useful for action on the selection.
 */
export function off(
  from: From,
  options: OffOptions = { passThrough: false }
): Manipulator {
  const to: To[] = [
    {
      set_variable: {
        name: SHIFT_LOCK,
        value: 0,
      },
    },
  ];

  if (options.passThrough) {
    to.push({
      key_code: from.key_code,
      modifiers: from.modifiers?.mandatory,
    });
  }

  return {
    from: from,
    to: to,
    conditions: [
      {
        type: "variable_if",
        name: SHIFT_LOCK,
        value: 1,
      },
    ],
    type: "basic",
  };
}

/**
 * Transforms 'from' to 'to' with the 'shift' modifier added
 */
export function transform(from: From, to: KeyCode): Manipulator {
    return {
        from: from,
        to: [{ key_code: to, modifiers: ["shift"] }],
        conditions: [
          {
            type: "variable_if",
            name: SHIFT_LOCK,
            value: 1,
          },
        ],
        type: "basic",
    };
    
  }