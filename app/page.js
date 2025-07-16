import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

function page() {
  return (
    <div className="min-h-screen">
      <section className="container mx-auto py-20 text-center">
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold gradient-title pb-6 flex flex-col">
          Streamline Your Workflow <br />
          <span className="flex mx-auto gap-3 sm:gap-4 items-center">
            With{" "}
            <Image
              src="/kanvix/kanvix_rect.png"
              alt="Kanvix Logo"
              width={400}
              height={80}
              className="h-14 sm:h-24 w-auto object-contain"
            />
          </span>
        </h1>
        <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">Empower your team with our intuitive project management solution.</p>
        <Link href={"/onboarding"}>
          <Button size={"lg"} className={"mr-8"}>
            Get Started <ChevronRight size={18} />
          </Button>
        </Link>
        <Link href={"/#features"}>
          <Button size={"lg"} variant={"outline"} className={"mr-4"}>
            Learn More
          </Button>
        </Link>
      </section>
    </div>
  )
}

export default page