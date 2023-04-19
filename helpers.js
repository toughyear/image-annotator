function getUniqueName(name) {
  let uniqueName = name;
  let counter = 2;

  while (rectangles.some((rect) => rect.name === uniqueName)) {
    uniqueName = `${name}_${counter}`;
    counter++;
  }

  return uniqueName;
}
