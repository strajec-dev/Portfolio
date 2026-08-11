// Shared constants and helpers used across admin tab components
export const STATUS_OPTIONS = [
  { value: 'new',         label: 'New',         dot: 'bg-[#10B981]', chip: 'bg-[#10B981]/15 text-[#10B981]' },
  { value: 'contacted',   label: 'Contacted',   dot: 'bg-blue-500',  chip: 'bg-blue-50 text-blue-600' },
  { value: 'in_progress', label: 'In Progress', dot: 'bg-amber-500', chip: 'bg-amber-50 text-amber-600' },
  { value: 'closed',      label: 'Closed',      dot: 'bg-slate-400', chip: 'bg-slate-100 text-[#4B5563]' },
];

// Statuses the admin can manually set from the dropdown — New / Contacted
// are assigned automatically (new+unread / replied) and left out of the list.
export const SELECTABLE_STATUS_OPTIONS = STATUS_OPTIONS.filter(
  (s) => s.value === 'in_progress' || s.value === 'closed'
);

export const getStatus = (value) =>
  STATUS_OPTIONS.find((s) => s.value === value) || STATUS_OPTIONS[0];
