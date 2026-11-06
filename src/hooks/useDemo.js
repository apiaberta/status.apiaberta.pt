import { useLocation, useSearchParams } from 'react-router-dom';

export function useDemo() {
    const [params] = useSearchParams();
    return params.get('demo') === '1';
}

export function useDemoLink(path) {
    const demo = useDemo();
    const location = useLocation();
    const target = path ?? location.pathname;
    return demo ? `${target}?demo=1` : target;
}
