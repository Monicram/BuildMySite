// ============================================================
// BuildMySite Admin — Customers Page (derived from enquiries)
// ============================================================
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users } from 'lucide-react';
import DataTable, { type Column } from '../components/DataTable';
import { enquiryService } from '../services/enquiry';
import { formatDateTime, getStatusColor, capitalize, getInitials } from '../utils';
import type { Customer } from '../types';

const Customers = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['enquiries'],
    queryFn: enquiryService.getAll,
    staleTime: 60_000,
  });

  // Derive unique customers from enquiries (latest record per email)
  const customers = useMemo<Customer[]>(() => {
    if (!data?.data) return [];
    const map = new Map<string, Customer>();
    [...data.data].reverse().forEach(e => {
      const existing = map.get(e.email);
      map.set(e.email, {
        id: e.id,
        name: e.name,
        email: e.email,
        phone: e.phone,
        totalEnquiries: (existing?.totalEnquiries ?? 0) + 1,
        lastEnquiry: e.created_at,
        status: e.status,
        budget: e.budget,
      });
    });
    return Array.from(map.values());
  }, [data]);

  const columns: Column<Customer>[] = [
    {
      key: 'name', label: 'Customer', sortable: true,
      render: row => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gold-500/15 border border-gold-500/20 flex items-center justify-center text-gold-400 text-xs font-bold shrink-0">
            {getInitials(row.name)}
          </div>
          <div><p className="font-medium text-obsidian-100">{row.name}</p><p className="text-xs text-obsidian-500">{row.email}</p></div>
        </div>
      ),
    },
    { key: 'phone', label: 'Phone', render: row => <span className="text-obsidian-300 text-sm">{row.phone ?? '—'}</span> },
    { key: 'budget', label: 'Budget', sortable: true, render: row => <span className="text-obsidian-300">{row.budget ?? '—'}</span> },
    {
      key: 'totalEnquiries', label: 'Enquiries', sortable: true,
      render: row => (
        <span className="px-2 py-0.5 bg-gold-500/10 border border-gold-500/20 rounded-full text-xs text-gold-400 font-medium">{row.totalEnquiries}</span>
      ),
    },
    {
      key: 'status', label: 'Status', sortable: true,
      render: row => <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(row.status)}`}>{capitalize(row.status)}</span>,
    },
    {
      key: 'lastEnquiry', label: 'Last Enquiry', sortable: true,
      render: row => <span className="text-obsidian-400 text-xs">{formatDateTime(row.lastEnquiry)}</span>,
    },
  ];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-obsidian-50 flex items-center gap-2">
          <Users size={22} className="text-gold-400" /> Customers
        </h1>
        <p className="text-sm text-obsidian-400 mt-0.5">{customers.length} unique customers from enquiries</p>
      </div>
      <div className="bg-obsidian-800/40 border border-obsidian-700/50 rounded-2xl p-6">
        <DataTable
          columns={columns}
          data={customers}
          isLoading={isLoading}
          searchKeys={['name', 'email', 'phone'] as never[]}
          pageSize={10}
          emptyMessage="No customer data yet. Customers are derived from enquiry submissions."
        />
      </div>
    </div>
  );
};

export default Customers;
