export function snakeToCamelKeys(obj: any): any {
  const camelObj: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    camelObj[snakeToCamel(key)] = obj[key];
  }
  return camelObj;
}

export function snakeToCamel(str: string) {
  return str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace("-", "").replace("_", "")
  );
}
