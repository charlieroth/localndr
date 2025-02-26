import { ThemeProvider } from '@/components/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'
import { useShape } from '@electric-sql/react'

export default function App() {
    const { data } = useShape({
        url: import.meta.env.VITE_DATABASE_URL,
        params: {
            table: 'events',
        }
    })

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <ThemeToggle />
            <div>
                <pre>{ JSON.stringify(data, null, 2) }</pre>
            </div>
        </ThemeProvider>
    )
}
