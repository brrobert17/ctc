import { Link } from '@tanstack/react-router'

export interface BreadcrumbItem {
  label: string
  path?: string // If undefined, it's the current page (not clickable)
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="container mx-auto px-4 py-4 text-sm" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 text-slate-400">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          
          return (
            <li key={index} className="flex items-center gap-2">
              {item.path ? (
                <Link
                  to={item.path}
                  className="hover:text-slate-200 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-slate-200">{item.label}</span>
              )}
              {!isLast && <span className="text-slate-600">/</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
