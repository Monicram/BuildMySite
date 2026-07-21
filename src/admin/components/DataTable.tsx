// ============================================================
// BuildMySite Admin — DataTable (generic, typed)
// ============================================================
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { capitalize } from '../utils';

export interface Column<T = Record<string, unknown>> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T extends object> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: Column<any>[];
  data: T[];
  pageSize?: number;
  searchKeys?: (keyof T)[];
  filterOptions?: { key: keyof T; label: string; options: string[] }[];
  emptyMessage?: string;
  actions?: (row: T) => React.ReactNode;
  isLoading?: boolean;
}

type SortDir = 'asc' | 'desc' | null;

function DataTable<T extends object>({
  columns,
  data,
  pageSize: defaultPageSize = 10,
  searchKeys = [],
  filterOptions = [],
  emptyMessage = 'No records found.',
  actions,
  isLoading = false,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Filter
  const filtered = useMemo(() => {
    let rows = [...data];

    // Search
    if (search && searchKeys.length) {
      const q = search.toLowerCase();
      rows = rows.filter(row =>
        searchKeys.some(key => {
          const val = (row as Record<string, unknown>)[key as string];
          return val !== null && val !== undefined && String(val).toLowerCase().includes(q);
        })
      );
    }

    // Column filters
    Object.entries(filters).forEach(([key, val]) => {
      if (val) {
        rows = rows.filter(row => String((row as Record<string, unknown>)[key]) === val);
      }
    });

    return rows;
  }, [data, search, searchKeys, filters]);

  // Sort
  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    return [...filtered].sort((a, b) => {
      const av = (a as Record<string, unknown>)[sortKey];
      const bv = (b as Record<string, unknown>)[sortKey];
      const aStr = av === null || av === undefined ? '' : String(av);
      const bStr = bv === null || bv === undefined ? '' : String(bv);
      return sortDir === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });
  }, [filtered, sortKey, sortDir]);

  // Paginate
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (key: string) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir('asc');
    } else if (sortDir === 'asc') {
      setSortDir('desc');
    } else if (sortDir === 'desc') {
      setSortKey(null);
      setSortDir(null);
    }
    setPage(1);
  };

  const SortIcon = ({ colKey }: { colKey: string }) => {
    if (sortKey !== colKey) return <ChevronsUpDown size={13} className="text-obsidian-600" />;
    if (sortDir === 'asc') return <ChevronUp size={13} className="text-gold-400" />;
    return <ChevronDown size={13} className="text-gold-400" />;
  };

  const SkeletonRow = () => (
    <tr>
      {columns.map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-obsidian-700 rounded animate-pulse" />
        </td>
      ))}
      {actions && (
        <td className="px-4 py-3">
          <div className="h-4 w-20 bg-obsidian-700 rounded animate-pulse" />
        </td>
      )}
    </tr>
  );

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {searchKeys.length > 0 && (
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian-500" />
            <input
              type="text"
              placeholder="Search…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-3 py-2 bg-obsidian-800 border border-obsidian-700 rounded-lg text-sm text-obsidian-100 placeholder-obsidian-500 focus:outline-none focus:border-gold-500 transition-colors"
            />
          </div>
        )}

        {filterOptions.map(filter => (
          <select
            key={String(filter.key)}
            value={filters[String(filter.key)] ?? ''}
            onChange={e => {
              setFilters(f => ({ ...f, [String(filter.key)]: e.target.value }));
              setPage(1);
            }}
            className="py-2 pl-3 pr-8 bg-obsidian-800 border border-obsidian-700 rounded-lg text-sm text-obsidian-300 focus:outline-none focus:border-gold-500 transition-colors appearance-none cursor-pointer"
          >
            <option value="">{filter.label}</option>
            {filter.options.map(opt => (
              <option key={opt} value={opt}>{capitalize(opt)}</option>
            ))}
          </select>
        ))}

        <div className="ml-auto flex items-center gap-2 text-xs text-obsidian-500">
          <span>{sorted.length} result{sorted.length !== 1 ? 's' : ''}</span>
          <select
            value={pageSize}
            onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
            className="py-1 px-2 bg-obsidian-800 border border-obsidian-700 rounded text-xs text-obsidian-300 focus:outline-none focus:border-gold-500 transition-colors"
          >
            {[10, 25, 50].map(n => (
              <option key={n} value={n}>{n} / page</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-obsidian-700/50">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-obsidian-700/50 bg-obsidian-800/50">
              {columns.map(col => (
                <th
                  key={String(col.key)}
                  className={`px-4 py-3 font-semibold text-obsidian-400 uppercase tracking-wider text-xs whitespace-nowrap ${col.className ?? ''} ${col.sortable ? 'cursor-pointer hover:text-obsidian-200 select-none' : ''}`}
                  onClick={() => col.sortable && handleSort(String(col.key))}
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    {col.sortable && <SortIcon colKey={String(col.key)} />}
                  </div>
                </th>
              ))}
              {actions && (
                <th className="px-4 py-3 font-semibold text-obsidian-400 uppercase tracking-wider text-xs text-right">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-obsidian-700/30">
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, i) => <SkeletonRow key={i} />)
            ) : paginated.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-4 py-12 text-center text-obsidian-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginated.map((row, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="hover:bg-obsidian-800/40 transition-colors"
                >
                  {columns.map(col => (
                    <td
                      key={String(col.key)}
                      className={`px-4 py-3 text-obsidian-200 ${col.className ?? ''}`}
                    >
                      {col.render
                        ? col.render(row)
                        : ((row as Record<string, unknown>)[col.key as string] as React.ReactNode) ?? '—'}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">{actions(row)}</div>
                    </td>
                  )}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-obsidian-500">
            Page {page} of {totalPages} · {sorted.length} total
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg text-obsidian-400 hover:text-obsidian-100 hover:bg-obsidian-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let p: number;
              if (totalPages <= 5) {
                p = i + 1;
              } else if (page <= 3) {
                p = i + 1;
              } else if (page >= totalPages - 2) {
                p = totalPages - 4 + i;
              } else {
                p = page - 2 + i;
              }
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                    p === page
                      ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                      : 'text-obsidian-400 hover:text-obsidian-100 hover:bg-obsidian-700'
                  }`}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg text-obsidian-400 hover:text-obsidian-100 hover:bg-obsidian-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
