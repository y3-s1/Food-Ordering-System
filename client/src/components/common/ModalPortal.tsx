import { FC, ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalPortalProps {
  children: ReactNode;
}

const ModalPortal: FC<ModalPortalProps> = ({ children }) => {
  useEffect(() => {
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
    
    // Restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Portal the modal to the body
  return createPortal(children, document.body);
};

export default ModalPortal;