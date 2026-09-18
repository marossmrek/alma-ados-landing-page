"use client";

import { useEffect, useState } from "react";

/* Form render time for the timing check against bots (set only on the client) */
export function FormTimestamp() {
  const [ts, setTs] = useState("");
  useEffect(() => {
    setTs(String(Date.now()));
  }, []);
  return <input type="hidden" name="ts" value={ts} readOnly />;
}
