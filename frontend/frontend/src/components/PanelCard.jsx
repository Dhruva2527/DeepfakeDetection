import { cn } from '@/lib/utils';

export default function PanelCard({ icon: Icon, title, action, children, className }) {
  return (
    <section className={cn('tl-card p-5 sm:p-6', className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {Icon ? (
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
          ) : null}
          <h2 className="font-heading text-base font-semibold text-slate-900">{title}</h2>
        </div>
        {action}
      </div>
      <div className="mt-4 text-sm leading-relaxed text-slate-600">{children}</div>
    </section>
  );
}