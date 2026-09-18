"use client";

import { useEffect, useState } from "react";

/* Čas vykreslenia formulára pre časovú kontrolu proti robotom (nastaví sa až na klientovi) */
export function FormTimestamp() {
  const [ts, setTs] = useState("");
  useEffect(() => {
    setTs(String(Date.now()));
  }, []);
  return <input type="hidden" name="ts" value={ts} readOnly />;
}
