export default function classnames(
  ...args: Array<
    string | null | undefined | { [key: string]: boolean | string }
  >
): string {
  let className: string = "";

  args.forEach((item) => {
    if (!item) {
      return;
    }

    if (typeof item === "string") {
      className += ` ${item}`;
      return;
    }

    Object.keys(item).forEach((key) => {
      const value = item[key];

      if (!!value) className += ` ${key}`;
    });
  });

  return className;
}
