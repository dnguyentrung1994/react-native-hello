import { useEffect, useRef } from 'react';

const useWillMount = (callback: any) => {
  const mounted = useRef(false);
  if (!mounted.current) callback();

  useEffect(() => {
    mounted.current = true;
  }, []);
};

export default useWillMount;
