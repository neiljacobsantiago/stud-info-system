//Shows a failed-request state with a retry button
export default function ErrorMessage({ message, onRetry }){
    return (
        <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-md border border-error/30 bg-error/5 px-6 py-10 text-center">
            <p className="font-serif text-lg text-error">
                {message || "Unable to retrieve the data. Please try again."}
            </p>
            <p className="text-sm text-ink-500">
                Yikes! The registrar server didn't respond. Check your connection and try again.
            </p>
            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="mt-2 rounded-md bg-ink-900 px-4 py-2 text-sm font-medium text-paper hover:bg-ink-700"
                >
                    Try again
                </button>
            )}
        </div>
    );
}
