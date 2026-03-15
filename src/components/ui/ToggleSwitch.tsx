interface ToggleSwitchProps {
    checked: boolean;
    onChange: () => void;
    label: string;
}

export default function ToggleSwitch({ checked, onChange, label }: ToggleSwitchProps) {
    return (
        <button
            role="switch"
            aria-checked={checked}
            aria-label={label}
            onClick={onChange}
            className={`w-11 h-6 rounded-full transition-colors relative ${checked ? 'bg-emerald-500' : 'bg-slate-300'}`}
        >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${checked ? 'left-6' : 'left-1'}`} />
        </button>
    );
}
