"use client";
import { hc } from "hono/client";
import { useEffect, useState } from "react";
import type { AppType } from "./api/[...route]/route";

const client = hc<AppType>("/");

export default function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const res = await client.api.hello.$get();
      const { message } = await res.json();
      setMessage(message);
    };
    fetchData();
  }, []);

  if (!message) return <p>Loading...</p>;

  return <p className="font-bold text-3xl underline">{message}</p>;
}
