import React from 'react';

import Close from './Close';

import styles from '../styles/Dialog.module.css';

export interface IAnimationEvent {
  name?: string;
  end?: string;
}

export interface Props {
  isComplete: boolean;
  isErrored: boolean;
  type: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function whichAnimationEvent(): IAnimationEvent {
  const elem = document.createElement('div');
  const animations = [
    { name: 'animation', end: 'animationend' },
    { name: 'OAnimation', end: 'webkitAnimationEnd' },
    { name: 'MozAnimation', end: 'animationend' },
    { name: 'WebkitAnimation', end: 'webkitAnimationEnd' },
  ];

  for (const name in animations) {
    if (elem.style[name] !== undefined) return animations[name];
  }
  return {};
}

const Dialog: React.FunctionComponent<Props> = ({
  isComplete,
  isErrored,
  type,
  onClose,
  children,
}) => {
  const modalContentRef = React.createRef<HTMLDivElement>();

  const { end } = whichAnimationEvent();

  const cssComplete = isComplete ? styles.complete : null;
  const cssType =
    type === 'inline' ? styles['type-inline'] : styles['type-image'];

  let focusableEls: NodeListOf<Element> | null; // A collection of all focusable dom nodes inside the modal

  const handleClose = () => {
    const node = modalContentRef.current;
    if (!node) return false;

    const onAnimationEnd = () => {
      end && node.removeEventListener(end, onAnimationEnd);
      document.body.classList.remove('modal-closing');
      onClose();
    };

    if (!end || end === undefined) return onClose();

    document.body.classList.add('modal-closing');
    return node.addEventListener(end, onAnimationEnd);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (modalContentRef && e.target === modalContentRef.current)
      return handleClose();
    return true;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const { key, shiftKey } = e;
    if (key === 'Tab' || key === 'Escape' || key === 'Space' || key === 'Enter')
      e.preventDefault(); // Prevent default for Tab or Escape keys
    if (key === 'Tab') {
      // Tab
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
    let focusableElArray: Element[];

    const node = modalContentRef.current;
    if (node instanceof HTMLElement) {
      focusableElList = node.querySelectorAll(
        'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]'
      );
    }
    if (focusableElList.length > 0) {
      focusableElArray = Array.from(focusableElList);
      focusableElArray && (focusableElArray[0] as HTMLElement).focus();
    }
  };

  React.useEffect(() => {
    if (children && isComplete && modalContentRef.current !== null)
      handleFocus();
  });

  const modalContent = (
    <div
      className={[styles.modal, cssComplete].join(' ')}
      ref={modalContentRef}
      onKeyDown={handleKeyDown}
      onClick={handleOverlayClick}
      role="presentation"
      data-testid="dialog"
    >
      <div className={[styles.panel, cssType].join(' ')}>
        <Close onClick={handleClose} onKeyDown={handleKeyDown} />
        <div className={styles.panelBody} tabIndex={0}>
          <div>
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
    </div>
  );

  return modalContent;
};

export default Dialog;
