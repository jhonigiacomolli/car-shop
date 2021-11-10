import Link from 'next/link'
import { useConfig } from 'context'

type BreadcrumbItemProps = {
    link: string
    text: string
}
const BreadcrumbItem = ({ link, text }: BreadcrumbItemProps) => {
    const { setLoading } = useConfig()
    return (
        <Link href={link}>
            <a onClick={() => setLoading(true)}>
                {text}
            </a>
        </Link>
    )
}

export default BreadcrumbItem
