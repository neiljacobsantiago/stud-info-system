//Small confirmation step in front of a destructive action
export default function ConfirmDialog({ title, message, confirmLabel = "Delete", onConfirm, onCancel, isBusy = false }){
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/60 px-4"
            role="alertdialog"
            aria-modal="true"
            aria-label={title}
            onClick={onCancel}
        >
            <div className="w-full max-w-sm bg-paper-card" onClick={(e) => e.stopPropagation()}>
                <div className="px-6 py-5">
                    <h2 className="font-serif text-xl text-ink-900">{title}</h2>
                    <p className="mt-2 text-sm text-ink-500">{message}</p>
                </div>
                <div className="flex justify-end gap-3 border-t border-paper-line px-6 py-4">
                    <button type="button" onClick={onCancel} className="rounded-md px-4 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50">
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isBusy}
                        className="rounded-md bg-error px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
                    >
                        {isBusy ? "Working..." : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
