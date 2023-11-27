import clsx from 'clsx';
import { ButtonHTMLAttributes } from 'react';

export default function Button({
    children,
    className,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className={clsx(
                'm-1 bg-slate-200 p-1 hover:bg-green-100 active:bg-green-200',
                className
            )}
            {...props}>
            <span className="inline-block rounded-md bg-white px-2 py-0.5 hover:bg-green-200">
                {children}
            </span>
        </button>
    );
}
