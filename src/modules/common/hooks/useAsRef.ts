import * as React from "react";

import { useIsomorphicLayoutEffect } from "#modules/common/hooks/useIsomorphicLayoutEffect.ts";

function useAsRef<T>(props: T) {
  const ref = React.useRef<T>(props);

  useIsomorphicLayoutEffect(() => {
    ref.current = props;
  });

  return ref;
}

export { useAsRef };
