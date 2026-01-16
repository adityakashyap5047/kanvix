import { Suspense } from "react"
import { BarLoader } from "react-spinners"

const ProjectLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="mx-auto">
        <Suspense fallback={<span><BarLoader className='mt-4' color='#36d7b7' width={"100%"} /></span>}>
          {children}
        </Suspense>
    </div>
  )
}

export default ProjectLayout