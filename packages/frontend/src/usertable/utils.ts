export const visuallyHidden = {
    border: 0,
    margin: -1,
    padding: 0,
    width: '1px',
    height: '1px',
    overflow: 'hidden',
    position: 'absolute',
    whiteSpace: 'nowrap',
    clip: 'rect(0 0 0 0)'
  };
  
  export function emptyRows(page: number, rowsPerPage: number, arrayLength: number): number {
    return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
  }
  
  function descendingComparator<T>(a: T, b: T, orderBy: keyof T): number {
    if (a[orderBy] === null) {
      return 1;
    }
    if (b[orderBy] === null) {
      return -1;
    }
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
  
  export function getComparator<Key extends keyof any>(
    order: 'asc' | 'desc',
    orderBy: Key
  ): (a: { [key in Key]: any }, b: { [key in Key]: any }) => number {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }
  