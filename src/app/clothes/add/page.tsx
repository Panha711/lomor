"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AddClothesRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/clothes");
  }, [router]);
  return null;
}
