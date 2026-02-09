import { diff } from "deep-diff";

export const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj)) as T;

type Operation = "add" | "remove" | "replace";

interface Patch {
  op: Operation;
  path: string;
  value?: any;
  oldValue?: any;
}

export const generatePatches = (prevState: any, newState: any): Patch[] => {
  const differences = diff(prevState, newState) || [];

  return differences.map((delta): Patch => {
    switch (delta.kind) {
      case "E": // Edit
        return {
          op: "replace",
          path: `/${delta.path!.join("/")}`,
          oldValue: delta.lhs,
          value: delta.rhs,
        };

      case "D": // Delete
        return {
          op: "remove",
          path: `/${delta.path!.join("/")}`,
          oldValue: delta.lhs,
        };

      case "N": // New
        return {
          op: "add",
          path: `/${delta.path!.join("/")}`,
          value: delta.rhs,
        };

      case "A": // Array change
        const arrayPath = delta.path?.length
          ? `/${delta.path.join("/")}/${delta.index}`
          : `/${delta.index}`;

        switch (delta.item.kind) {
          case "N":
            return {
              op: "add",
              path: `/${arrayPath}`,
              value: delta.item.rhs,
            };
          case "D":
            return {
              op: "remove",
              path: `/${arrayPath}`,
              oldValue: delta.item.lhs,
            };
          case "E":
            return {
              op: "replace",
              path: `/${arrayPath}`,
              oldValue: delta.item.lhs,
              value: delta.item.rhs,
            };
        }

      default:
        throw new Error(`Unhandled delta kind: ${(delta as any).kind}`);
    }
  });
};

export const applyPatches = (state: any, patches: Patch[]): any => {
  const newState = deepClone(state);

  patches.forEach((patch) => {
    const keys = patch.path.split("/").filter(Boolean);
    let target = newState;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      target = target[key];
    }

    const lastKey = keys[keys.length - 1];

    switch (patch.op) {
      case "add":
        if (Array.isArray(target)) {
          target.splice(Number(lastKey), 0, patch.value);
        } else {
          target[lastKey] = patch.value;
        }
        break;

      case "remove":
        if (Array.isArray(target)) {
          target.splice(Number(lastKey), 1);
        } else {
          delete target[lastKey];
        }
        break;

      case "replace":
        target[lastKey] = patch.value;
        break;
    }
  });

  return newState;
};

export const filterPatches = (patches: Patch[]): Patch[] => {
  return patches.filter((patch) => {
    // Игнорируем временные состояния
    const isTemporary = [
      "/dragging",
      "/selected",
      "/positionAbsolute",
      "/zIndex",
    ].some((s) => patch.path.includes(s));

    // Игнорируем позицию если смещение < 10px
    if (patch.path.endsWith("/position")) {
      const dx = Math.abs(patch.value.x - patch.oldValue.x);
      const dy = Math.abs(patch.value.y - patch.oldValue.y);
      return dx > 10 || dy > 10;
    }

    return !isTemporary;
  });
};
