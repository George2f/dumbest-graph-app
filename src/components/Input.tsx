import clsx from 'clsx';
import { InputHTMLAttributes } from 'react';

export default function Input(props: InputHTMLAttributes<HTMLInputElement>) {
    return <input className={clsx('border-b-2', props.className)} {...props} />;
}
