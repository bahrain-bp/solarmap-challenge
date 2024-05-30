interface ApplyFilterParams<T> {
  inputData: T[];
  comparator: (a: T, b: T) => number;
  filterName: string;
}

interface User {
  Username: string;
  Attributes: {
    Name: string;
    Value: string;
  }[];
}

export function applyFilter<T extends User>({
  inputData,
  comparator,
  filterName,
}: ApplyFilterParams<T>): T[] {
  const stabilizedThis = inputData.map((el, index) => [el, index] as [T, number]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter((user) =>
      user.Attributes.some((attr) =>
        attr.Value.toLowerCase().includes(filterName.toLowerCase())
      )
    );
  }

  return inputData;
}
