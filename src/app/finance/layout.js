export const metadata = {
    title: 'Financial Portfolio | Bergaman Dev',
    description: 'Track your personal finance assets across various categories.',
};

export default function FinanceLayout({ children }) {
    return (
        <div className="bg-[#0f172a] min-h-screen text-white">
            {children}
        </div>
    );
}
