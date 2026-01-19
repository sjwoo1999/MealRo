interface EmptyStateProps {
    icon?: string;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export default function EmptyState({
    icon = '🍽️',
    title,
    description,
    action,
}: EmptyStateProps) {
    return (
        <div
            className="
        flex flex-col items-center justify-center 
        py-16 px-4 text-center
      "
            role="status"
            aria-label={title}
        >
            <span className="text-6xl mb-4" aria-hidden="true">
                {icon}
            </span>

            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {title}
            </h3>

            {description && (
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
                    {description}
                </p>
            )}

            {action && (
                <button
                    onClick={action.onClick}
                    className="
            px-6 py-2.5 bg-primary-500 text-white font-medium
            rounded-lg hover:bg-primary-600
            transition-colors duration-200
            focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
          "
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}
