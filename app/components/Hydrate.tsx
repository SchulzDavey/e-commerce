'use client';

import { useThemeStore } from '@/store';
import { PropsWithChildren, useEffect, useState } from 'react';

const Hydrate = ({ children }: PropsWithChildren) => {
  const theme = useThemeStore();
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (isHydrated)
    return (
      <body data-theme={theme.mode}>
        <div className="mx-4 lg:mx-48 min-h-screen">{children}</div>
      </body>
    );
};

export default Hydrate;
