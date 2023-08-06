import { ReactNode } from 'react'

interface Props {
    children: ReactNode[] | ReactNode,
    shelf?: boolean,
    handleClick: () => void

}

function Scaffold({ children, shelf = false, handleClick }: Props) {
    return (
        <section
            onClick={handleClick}
            className={`${shelf ? "shelf scaffold" : "scaffold"} pb-3`}
        >
            <div className="inside">
                {children}
            </div>
        </section>
    )
}

export default Scaffold