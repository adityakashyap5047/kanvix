import { SignInButton } from "@clerk/nextjs"
import { SignedIn, SignedOut } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { Button } from "./ui/button"
import { PenBox } from "lucide-react"
import UserMenu from "./user-menu"
import UserLoading from "./user-loading"
import { checkUser } from "@/lib/checkUser"

async function Header() {

  await checkUser(); 

  return (
    <header className="container mx-auto">
        <nav className="py-6 px-4 flex justify-between items-center">
          <Link href="/" className="logo">
            <Image src="/kanvix/kanvix_rect_line.png" alt="Kanvix Logo" width={50} height={50} 
              className="sm:h-10 h-8 w-auto object-contain"
            />
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/project/create">
              <Button className={"bg-[#5293f7] text-white hover:bg-sky-500 flex items-center gap-2 cursor-pointer h-8 sm:h-10"}>
                <PenBox size={18} />
                <span>Create Project</span>
              </Button>
            </Link>
            <SignedOut>
              <SignInButton forceRedirectUrl="/onboarding"> 
                <Button variant={"outline"} className={"cursor-pointer"}>Login</Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
                <UserMenu />
            </SignedIn>
          </div>
        </nav>
        <UserLoading />
    </header>
  )
}

export default Header