import Link from "next/link";
import { FrameArt } from "@/components/FrameArt";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 pt-14 text-center">
      <FrameArt
        shape="round"
        color={{ name: "", frame: "#8e9299", lens: "#cfe3f5", lensOpacity: 0.3 }}
        className="float mx-auto w-56"
      />
      <h1 className="mt-6 text-3xl">This page is out of focus.</h1>
      <p className="mt-2 text-muted">
        The link may be old. If you scanned a tag in store, ask our staff and we&apos;ll find the frame
        for you.
      </p>
      <Link href="/shop/" className="btn btn-primary mt-6">
        Browse all frames
      </Link>
    </div>
  );
}
