import Link from "next/link";
import { PencilAltIcon, UserIcon } from "@heroicons/react/outline";
import useFirebaseLogout from "hooks/useFirebaseLogout";
import { useUser } from "providers/user";
import OhioFooter from "./OhioFooter";
import GeneralFooter from "./GeneralFooter";
import { useRouter } from "next/router";

export default function Footer() {
  const { logout } = useFirebaseLogout();
  const { user } = useUser();
  const router = useRouter();
  const { stateSlug } = router.query;
  return (
    <footer>
      {stateSlug === "ohio" ? <OhioFooter /> : <GeneralFooter />}
      <div className="bg-[#325a79] py-3 text-xs text-gray-300 text-center">
        All photos and content (excluding maps and quoted text) are released into the public domain&nbsp;
        <a
          href="https://creativecommons.org/share-your-work/public-domain/cc0/"
          target="_blank"
          className="text-[#81b5e0]"
          rel="noreferrer"
        >
          CC0
        </a>
        &nbsp;unless otherwise noted.
        <p className="mt-2">
          {user ? (
            <>
              <UserIcon className="h-3 w-3 inline" />
              &nbsp;
              {user?.email}
              &nbsp;-&nbsp;
              <button type="button" onClick={logout} className="text-[#81b5e0]">
                logout
              </button>
            </>
          ) : (
            <Link href="/login">
              <a className="text-[#81b5e0]">
                <PencilAltIcon className="h-3 w-3 inline" /> Editor Login
              </a>
            </Link>
          )}
        </p>
      </div>
    </footer>
  );
}
