'use client';

import { PropsWithChildren, useEffect, useState } from 'react';

const Hydrate = ({ children }: PropsWithChildren) => {
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (isHydrated) return <div>{children}</div>;
};

export default Hydrate;
