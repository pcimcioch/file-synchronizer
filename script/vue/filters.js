export function bytes(value) {
  if (value === 0) return '0 Bytes';
  if (isNaN(parseFloat(value)) && !isFinite(value)) return 'Not a number';
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'BB'];
  const i = Math.floor(Math.log(value) / Math.log(1024));

  return parseFloat((value / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
}

export function date(value) {
  if (isNaN(parseInt(value)) && !isFinite(value)) return 'Not a number';

  return new Date(value).toLocaleString();
}