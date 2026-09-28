//Displays a single dashboard statistic
export default function StatTab({ label, value, sublabel }){

    return (

        <div className="border-t-2 border-gold bg-paper-card px-5 py-4">

            <p className="text-xs text-ink-500">{label}</p>

            <p className="mt-1 font-mono text-2xl text-ink-900">{value}</p>

            {sublabel && <p className="mt-1 text-xs text-ink-500">{sublabel}</p>}
            
        </div>
    );
}
