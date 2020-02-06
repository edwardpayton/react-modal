import { useEffect, useRef } from 'react';

import { createPortal } from 'react-dom';

export interface Props {
  children: React.ReactNode;
}

const Portal: React.FC<Props> = ({ children }: Props) => {
  const container = useRef(document.createElement('div'));

  useEffect(() => {
    const currentRef = container.current;
    currentRef.id = 'modalPortal';
    document.body.appendChild(currentRef);
    return () => {
      document.body.removeChild(currentRef);
    };
  });

  return createPortal(children, container.current);
};

export default Portal;
