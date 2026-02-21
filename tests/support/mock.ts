type ObjectLiteral = { [key: string]: any };

const mocks: { object: ObjectLiteral, property: string, previousImplementation: any, hasKey: boolean }[] = [];

export default function mock<T>(object: ObjectLiteral, property: string, fn: T, { ignoreExistence = false } = {}): T {
  const hasKey = property in object;

  if (!hasKey && !ignoreExistence) throw new Error(`Property ${property} does not exist`);

  mocks.push({
    object, property, hasKey, previousImplementation: object[property],
  });

  try {
    object[property] = fn;
  } catch {
    Object.defineProperty(object, property, { value: fn, writable: true, configurable: true });
  }

  return fn;
}

export function restoreAllMocks(): void {
  while (mocks.length > 0) {
    const { object, property, hasKey, previousImplementation } = mocks.pop()!;

    if (hasKey) {
      object[property] = previousImplementation;
    } else {
      delete object[property];
    }
  }
}
