// ============================================================
// BuildMySite Admin — Enquiries Page
// ============================================================
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Trash2,
  Eye,
  RefreshCw,
  X,
  CheckCircle,
  MessageSquare,
} from 'lucide-react';
import DataTable, { type Column } from '../components/DataTable';
import { enquiryService } from '../services/enquiry';
import { formatDateTime, getStatusColor, capitalize, exportToCSV, truncate } from '../utils';
import type { Enquiry, EnquiryStatus } from '../types';

const STATUSES: EnquiryStatus[] = ['new', 'contacted', 'in_progress', 'closed', 'rejected'];

// ─── Detail Modal ──────────────────────────────────────────
const EnquiryModal = ({
  enquiry,
  onClose,
  onStatusChange,
  isUpdating,
}: {
  enquiry: Enquiry;
  onClose: () => void;
  onStatusChange: (status: EnquiryStatus) => void;
  isUpdating: boolean;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-obsidian-950/80 backdrop-blur-sm"
      onClick={onClose}
    />
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 16 }}
      transition={{ duration: 0.2 }}
      className="relative bg-obsidian-900 border border-obsidian-700 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl"
    >
      {/* Header */}
      <div className="sticky top-0 bg-obsidian-900 border-b border-obsidian-700 px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-obsidian-100 text-lg">{enquiry.name}</h2>
          <p className="text-sm text-obsidian-400">{enquiry.email}</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg text-obsidian-400 hover:text-obsidian-100 hover:bg-obsidian-800 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-5">
        {/* Status Update */}
        <div>
          <label className="block text-xs font-semibold text-obsidian-400 uppercase tracking-wider mb-2">
            Update Status
          </label>
          <div className="flex flex-wrap gap-2">
            {STATUSES.map(s => (
              <button
                key={s}
                onClick={() => onStatusChange(s)}
                disabled={isUpdating || enquiry.status === s}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  enquiry.status === s
                    ? getStatusColor(s)
                    : 'border-obsidian-600 text-obsidian-400 hover:border-obsidian-500 hover:text-obsidian-200'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {capitalize(s)}
              </button>
            ))}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Phone', value: enquiry.phone },
            { label: 'Budget', value: enquiry.budget },
            { label: 'Pages', value: enquiry.pages },
            { label: 'Submitted', value: formatDateTime(enquiry.created_at) },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs font-semibold text-obsidian-500 uppercase tracking-wider mb-1">{label}</p>
              <p className="text-sm text-obsidian-200">{value ?? '—'}</p>
            </div>
          ))}
        </div>

        {/* Features */}
        {enquiry.features && enquiry.features.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-obsidian-500 uppercase tracking-wider mb-2">Features</p>
            <div className="flex flex-wrap gap-2">
              {enquiry.features.map((f, i) => (
                <span key={i} className="px-2.5 py-1 bg-gold-500/10 border border-gold-500/20 rounded-lg text-xs text-gold-400">
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {enquiry.notes && (
          <div>
            <p className="text-xs font-semibold text-obsidian-500 uppercase tracking-wider mb-2">Notes</p>
            <p className="text-sm text-obsidian-300 bg-obsidian-800 rounded-xl p-4 leading-relaxed">
              {enquiry.notes}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  </div>
);

// ─── Main Component ────────────────────────────────────────
const Enquiries = () => {
  const queryClient = useQueryClient();
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['enquiries'],
    queryFn: enquiryService.getAll,
    staleTime: 30_000,
  });

  const enquiries = data?.data ?? [];

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: EnquiryStatus }) =>
      enquiryService.updateStatus(id, status),
    onSuccess: updated => {
      queryClient.setQueryData(['enquiries'], (old: typeof data) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map(e => (e.id === updated.id ? updated : e)),
        };
      });
      setSelectedEnquiry(prev => (prev?.id === updated.id ? updated : prev));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: enquiryService.delete,
    onSuccess: (_, id) => {
      queryClient.setQueryData(['enquiries'], (old: typeof data) => {
        if (!old) return old;
        return { ...old, data: old.data.filter(e => e.id !== id), count: old.count - 1 };
      });
      if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
    },
  });

  const handleExportCSV = () => {
    const rows = enquiries.map(e => ({
      ID: e.id,
      Name: e.name,
      Email: e.email,
      Phone: e.phone ?? '',
      Budget: e.budget ?? '',
      Pages: e.pages ?? '',
      Status: e.status,
      Submitted: formatDateTime(e.created_at),
    }));
    exportToCSV(rows, 'enquiries');
  };

  const columns: Column<Enquiry>[] = [
    {
      key: 'id',
      label: '#',
      sortable: true,
      render: row => <span className="text-obsidian-500 text-xs">#{row.id}</span>,
      className: 'w-12',
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: row => (
        <div>
          <p className="font-medium text-obsidian-100">{row.name}</p>
          <p className="text-xs text-obsidian-500">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'budget',
      label: 'Budget',
      sortable: true,
      render: row => <span className="text-obsidian-300">{row.budget ?? '—'}</span>,
    },
    {
      key: 'pages',
      label: 'Pages',
      render: row => <span className="text-obsidian-300 text-xs">{truncate(row.pages ?? '', 30)}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: row => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(row.status)}`}>
          {capitalize(row.status)}
        </span>
      ),
    },
    {
      key: 'created_at',
      label: 'Received',
      sortable: true,
      render: row => <span className="text-obsidian-400 text-xs">{formatDateTime(row.created_at)}</span>,
    },
  ];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-obsidian-50 flex items-center gap-2">
            <MessageSquare size={22} className="text-gold-400" />
            Enquiries
          </h1>
          <p className="text-sm text-obsidian-400 mt-0.5">
            {enquiries.length} total enquiries
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-obsidian-800 border border-obsidian-700 text-obsidian-300 text-sm hover:text-obsidian-100 transition-colors"
          >
            <RefreshCw size={14} />
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-obsidian-800 border border-obsidian-700 text-obsidian-300 text-sm hover:text-obsidian-100 hover:border-gold-500/50 transition-colors"
          >
            <Download size={14} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-obsidian-800/40 border border-obsidian-700/50 rounded-2xl p-6">
        <DataTable
          columns={columns}
          data={enquiries}
          isLoading={isLoading}
          searchKeys={['name', 'email', 'budget', 'status'] as never[]}
          filterOptions={[
            {
              key: 'status' as never,
              label: 'All Statuses',
              options: STATUSES,
            },
          ]}
          pageSize={10}
          emptyMessage="No enquiries found. New enquiries will appear here."
          actions={row => {
            const enquiry = row as unknown as Enquiry;
            return (
              <>
                <button
                  onClick={() => setSelectedEnquiry(enquiry)}
                  className="p-1.5 rounded-lg text-obsidian-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                  title="View details"
                >
                  <Eye size={15} />
                </button>
                <button
                  onClick={() => {
                    const next = STATUSES[(STATUSES.indexOf(enquiry.status) + 1) % STATUSES.length];
                    statusMutation.mutate({ id: enquiry.id, status: next });
                  }}
                  className="p-1.5 rounded-lg text-obsidian-400 hover:text-green-400 hover:bg-green-500/10 transition-colors"
                  title="Advance status"
                >
                  <CheckCircle size={15} />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete enquiry from ${enquiry.name}?`)) {
                      deleteMutation.mutate(enquiry.id);
                    }
                  }}
                  className="p-1.5 rounded-lg text-obsidian-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </>
            );
          }}
        />
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedEnquiry && (
          <EnquiryModal
            enquiry={selectedEnquiry}
            onClose={() => setSelectedEnquiry(null)}
            onStatusChange={status =>
              statusMutation.mutate({ id: selectedEnquiry.id, status })
            }
            isUpdating={statusMutation.isPending}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Enquiries;
