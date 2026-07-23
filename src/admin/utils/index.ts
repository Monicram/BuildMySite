// ============================================================
// BuildMySite Admin — Utility Functions
// ============================================================

/**
 * Format a date string to a readable format
 */
export const formatDate = (dateStr: string | undefined): string => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Format a datetime string to a readable format
 */
export const formatDateTime = (dateStr: string | undefined): string => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Export an array of objects to a CSV file download
 */
export const exportToCSV = <T extends Record<string, unknown>>(
  data: T[],
  filename: string
): void => {
  if (!data.length) return;

  const headers = Object.keys(data[0]);
  const csvRows: string[] = [
    headers.join(','),
    ...data.map(row =>
      headers
        .map(key => {
          const val = row[key];
          const str =
            val === null || val === undefined
              ? ''
              : typeof val === 'object'
              ? JSON.stringify(val)
              : String(val);
          // Escape commas and quotes
          return `"${str.replace(/"/g, '""')}"`;
        })
        .join(',')
    ),
  ];

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Truncate text to a given length
 */
export const truncate = (str: string, maxLen: number): string => {
  if (!str) return '';
  return str.length > maxLen ? `${str.slice(0, maxLen)}…` : str;
};

/**
 * Get initials from a name string
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

/**
 * Capitalise first letter
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');
};

/**
 * Returns status badge colour class based on status string
 */
export const getStatusColor = (status: string): string => {
  const map: Record<string, string> = {
    new: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    contacted: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    in_progress: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    closed: 'bg-green-500/20 text-green-400 border-green-500/30',
    rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    accepted: 'bg-green-500/20 text-green-400 border-green-500/30',
    rescheduled: 'bg-blue-500/20 text-blue-400 border-blue-500/30',

    approved: 'bg-green-500/20 text-green-400 border-green-500/30',
    discovery: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    design: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    development: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    review: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    launched: 'bg-green-500/20 text-green-400 border-green-500/30',
  };
  return map[status] ?? 'bg-obsidian-700 text-obsidian-300 border-obsidian-600';
};

/**
 * Generate months for analytics charts
 */
export const getLast12Months = (): string[] => {
  const months = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    months.push(d.toLocaleString('default', { month: 'short', year: '2-digit' }));
  }
  return months;
};

/**
 * Simple debounce
 */
export const debounce = <T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};
