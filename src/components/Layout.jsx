import { Link, useLocation } from 'react-router-dom';
import { COPY } from '../lib/copy.js';
import { useDemo, useDemoLink } from '../hooks/useDemo.js';

export default function Layout({ children }) {
    const demo = useDemo();
    const home = useDemoLink('/');
    const location = useLocation();

    return (
        <div className="min-h-screen bg-background text-foreground">
            {demo && (
                <div
                    role="status"
                    className="bg-status-degraded px-4 py-2 text-center text-sm text-status-degraded-fg"
                >
                    {COPY.demoBanner}
                    {' '}
                    <Link to="/" className="font-medium underline underline-offset-2">
                        {COPY.demoExit}
                    </Link>
                </div>
            )}

            <div className="mx-auto w-full max-w-4xl px-4 sm:px-[var(--layout-inset)]">
                <header className="flex items-center justify-between gap-4 py-6">
                    <Link to={home} className="flex items-center gap-3 text-foreground">
                        <span
                            className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground"
                            aria-hidden="true"
                        >
                            AA
                        </span>
                        <span>
                            <span className="block text-base font-semibold leading-tight">
                                {COPY.siteName}
                            </span>
                            <span className="block text-sm text-muted">
                                {COPY.pageTitle}
                            </span>
                        </span>
                    </Link>
                    <a
                        href="https://apiaberta.pt"
                        className="text-sm font-medium text-primary underline-offset-2 hover:underline"
                    >
                        {COPY.siteLink}
                    </a>
                </header>

                <main>{children}</main>

                <footer className="mt-[var(--layout-section-gap)] border-t border-border py-8 text-sm text-muted">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p>
                            {COPY.footerPowered}
                            {' '}
                            <a
                                href="https://apiaberta.pt"
                                className="font-medium text-primary underline-offset-2 hover:underline"
                            >
                                {COPY.siteName}
                            </a>
                        </p>
                        {!demo && (
                            <Link
                                to={`${location.pathname}?demo=1`}
                                className="text-muted underline-offset-2 hover:text-foreground hover:underline"
                            >
                                {COPY.demoEnter}
                            </Link>
                        )}
                    </div>
                </footer>
            </div>
        </div>
    );
}
