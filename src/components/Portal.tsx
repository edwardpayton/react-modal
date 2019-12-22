import { useEffect, useRef } from 'react';

import { createPortal } from 'react-dom';

export interface IProps {
  children: React.ReactNode;
}

const Portal: React.FC<IProps> = ({ children }: IProps) => {
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
