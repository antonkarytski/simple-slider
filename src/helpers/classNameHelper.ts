export default function classNameHelper(
  ...classNames: Array<{ [key: string]: boolean } | string | undefined>
): string {
  const preparedClassNames = classNames.map((classesBlock) => {
    if (!classesBlock) return null;
    if (typeof classesBlock === "string") return classesBlock;
    return Object.keys(classesBlock).filter(
      (className) => classesBlock[className]
    );
  });
  return preparedClassNames.join(" ").trim();
}
