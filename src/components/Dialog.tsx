import Close from './Close';
import React from 'react';
import styles from '../styles/Dialog.module.css';
import { whichAnimationEvent, simpleThrottle } from '../utilities';

export interface IProps {
  isComplete: boolean;
  isErrored: boolean;
  isImage: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Dialog: React.FunctionComponent<IProps> = ({
  isComplete,
  isErrored,
  isImage,
  onClose,
  children,
}) => {
  const refOverlay = React.useRef<HTMLDivElement>(null);
  const refDialog = React.useRef<HTMLDivElement>(null);

  const whichAnim = whichAnimationEvent();

  const screenIsSmall = () => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    return windowWidth < 850 || windowHeight < 650;
  };

  const [isSmall, setSmall] = React.useState(screenIsSmall);

  let focusableEls: Element[] | null; // A collection of all focusable dom nodes inside the modal
  const cssComplete = isComplete ? styles.complete : null;
  const cssType = isImage ? styles['type-image'] : styles['type-inline'];
  const cssSmall = isSmall ? styles.dialogSmallScreen : '';

  const recalcScreenSize = simpleThrottle(() => {
    const value = screenIsSmall();
    setSmall(value);
  });

  React.useEffect(() => {
    window.addEventListener('resize', recalcScreenSize, false);

    return () => window.removeEventListener('resize', recalcScreenSize);
  });

  const handleClose = () => {
    const node = refOverlay.current;
    if (!node) return false;
    if (whichAnim === undefined) return onClose();

    const onAnimationEnd = () => {
      node.removeEventListener('animationend', onAnimationEnd);
      document.body.classList.remove('modal-closing');
      onClose();
    };

    document.body.classList.add('modal-closing');
    node.addEventListener('animationend', onAnimationEnd);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (refOverlay && e.target === refOverlay.current) return handleClose();
    return true;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const { key, shiftKey } = e;
    if (key === 'Tab' || key === 'Escape' || key === 'Space' || key === 'Enter')
      e.preventDefault(); // Prevent default for Tab or Escape keys
    if (key === 'Tab') {
      // Tab
      console.log('components/Dialog@78 >>', focusableEls);
      if (focusableEls === null || !document.activeElement) return false;
      const focusIndex = Array.from(focusableEls).indexOf(
        document.activeElement
      ); // Find the current focuses element in focuableEls array
      let nextFocus = shiftKey // Increase or decrease the next focus based on if the shift key is pressed
        ? focusIndex - 1
        : focusIndex + 1;
      if (!focusableEls[nextFocus])
        nextFocus = shiftKey ? focusableEls.length - 1 : 0; // If there is no next element, go to the first or last element
      return (focusableEls[nextFocus] as HTMLElement).focus(); // Focus the next element
    } else if (key === 'Escape' || key === 'Space' || key === 'Enter')
      handleClose();
  };

  const handleFocus = () => {
    let focusableElList: NodeListOf<Element> | [] = [];

    const node = refOverlay.current;
    if (node instanceof HTMLElement) {
      focusableElList = node.querySelectorAll(
        'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]'
      );
    }
    if (focusableElList.length > 0) {
      focusableEls = Array.from(focusableElList);
      focusableEls && (focusableEls[0] as HTMLElement).focus();
    }
  };

  React.useEffect(() => {
    if (children && isComplete && refOverlay.current !== null) handleFocus();
  });

  const modalContent = (
    <div
      className={[styles.overlay, cssComplete].join(' ')}
      ref={refOverlay}
      onKeyDown={handleKeyDown}
      onClick={handleOverlayClick}
      role="presentation"
      data-testid="dialog"
    >
      <div
        className={[styles.dialog, cssType, cssSmall].join(' ')}
        ref={refDialog}
      >
        <Close onClick={handleClose} onKeyDown={handleKeyDown} />
        <div className={styles.dialogBody} tabIndex={0}>
          {!isComplete && !isErrored && (
            <div className={styles.loading}>
              <p>Loading...</p>
            </div>
          )}

          {isErrored && (
            <div className={styles.error}>
              <p>There was a problem opening this content</p>
            </div>
          )}

          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </div>
  );

  return modalContent;
};

export default Dialog;
