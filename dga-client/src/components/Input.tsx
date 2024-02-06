import { InputHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export default function Input(props: InputHTMLAttributes<HTMLInputElement>) {
    return <input className={cn('border-b-2', props.className)} {...props} />;
}
