export default function FileDropzone({ onChange, label = 'Upload File', accept = '.pdf,.docx,.zip,.txt' }) {
  return (
    <label className="flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-electric/35 bg-white/5 px-4 py-6 text-center text-sm text-slate-300 transition hover:border-electric/70 hover:bg-white/8">
      <input type="file" className="hidden" accept={accept} onChange={onChange} />
      <span>{label}</span>
    </label>
  );
}