import { SignInButton, UserButton } from "@clerk/nextjs"
import { SignedIn, SignedOut } from "@clerk/nextjs"

function Header() {
  return (
    <div>
        <SignedOut>
            <SignInButton />
        </SignedOut>

        <SignedIn>
            <UserButton />
        </SignedIn>
    </div>
  )
}

export default Header