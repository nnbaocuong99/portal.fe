import path from "path";

export function url(baseURL: string, ...segments: string[]) {
  return `${baseURL}/${path.join(...segments)}`;
}

export function limitWord(input: string, max: number) {
  if (input?.length > max) {
    input = input.slice(0, max);
    const output: string = input + "...";
    return output;
  }
  return input;
}

export function buildAbsoluteLink(url: string | null | undefined | number) {
  if (url === null || typeof url === "undefined") {
    return "#";
  }
  return path.join("/", url.toString());
}
