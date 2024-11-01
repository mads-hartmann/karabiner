import { From, KeyCode, Manipulator, Modifiers, To, VariableCondition } from "./types";

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
  alsoSendKey?: KeyCode;
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

  if (options.alsoSendKey) {
    to.push({
      key_code: options.alsoSendKey,
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

export const ShiftLockEnabled: VariableCondition = {
  type: "variable_if",
  name: SHIFT_LOCK,
  value: 1,
}

export const ShiftLockDisabled: VariableCondition = {
  type: "variable_if",
  name: SHIFT_LOCK,
  value: 0,
}

/**
 * Transforms 'from' to 'to' with the 'shift' modifier added
 */
export function transform(from: From, to: To): Manipulator {
  return {
    from: from,
    to: [
      {
        key_code: to.key_code,
        modifiers: ["shift", ...(to.modifiers || [])],
      },
    ],
    conditions: [ShiftLockEnabled],
    type: "basic",
  };
}
