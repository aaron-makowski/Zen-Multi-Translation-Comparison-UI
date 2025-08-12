import { Button } from "@/components/ui/button";
import Link from "next-intl/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center">
      <h2 className="text-3xl font-bold mb-4">Not Found</h2>
      <p className="text-zinc-600 dark:text-zinc-400 mb-6 max-w-md">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Button asChild>
        <Link href="/">Return to Home</Link>
      </Button>
    </div>
  )
}
