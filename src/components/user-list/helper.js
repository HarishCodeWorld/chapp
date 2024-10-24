export function reverseArray(arr) {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]];

    left++;
    right--;
  }

  return arr;
}

export function sortContactsByPriority(contacts, priorityIds) {
  return contacts.sort((a, b) => {
    const aIndex = priorityIds.indexOf(a._id);
    const bIndex = priorityIds.indexOf(b._id);

    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }

    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    return 0;
  });
}
