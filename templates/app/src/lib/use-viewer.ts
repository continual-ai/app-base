import { useEffect, useState } from "react";
import { callOperation } from "./operations";

/**
 * The person signed in to Continual who is using the App, from the
 * `currentActor` operation. Null until it loads, or when nobody is signed in.
 */
export function useViewer() {
  const [viewer, setViewer] = useState<{ name: string } | null>(null);
  useEffect(() => {
    let active = true;
    callOperation<{ actor: { name: string } }>("currentActor")
      .then(({ actor }) => {
        const name = actor.name.trim();
        if (active && name) setViewer({ name });
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);
  return viewer;
}
