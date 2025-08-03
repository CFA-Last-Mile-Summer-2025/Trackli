import type { HTMLAttributes } from 'react';
import type { TStatus } from './Task-data';

const bgColor: { [Key in TStatus]: HTMLAttributes<HTMLElement>['className'] } = {
  applied: 'bg-violet-200 ',
  interview: 'bg-amber-200',
  offer: 'bg-lime-200',
  accepted: 'bg-green-200',
  closed: 'bg-gray-200',
};

const label: { [Key in TStatus]: string } = {
  applied: 'applied',
  interview: 'interview',
  offer: 'offer',
  accepted: 'accepted',
  closed: 'closed',
};

export function Status({ status }: { status: TStatus }) {
  return (
    <div className="flex w-[100px] justify-start">
      <span
        className={`${bgColor[status]} uppercase p-1 rounded font-semibold flex-shrink-0 text-xs text-slate-900 `}
      >
        {label[status]}
      </span>
    </div>
  );
}
