import '../styles/global.css';

import Dialog from './Dialog';
import Portal from './Portal';
import React from 'react';
import Trigger from './Trigger';

export interface ModalEvents {
  onOpen?: () => void;
  onClose?: () => void;
  onError?: () => void;
}

/**
 * Todo
 * - type-image - remove need for child image, make src a prop
 * - overloads for type inline & image
 * - should content overflow with scrollbar
 * - modal within modal
 * - https://github.com/pikapkg/pack
 *
 * Config options:
 * entryAnimation - fade, slideup, slidedown, zoom, flip, none
 * exitAnimation
 * size - large, small, fit, none
 *
 */

export interface Props {
  title: string;
  image?: boolean;
  src?: string;
  events?: ModalEvents;
  children: React.ReactNode;
}

const Modal: React.FunctionComponent<Props> = ({
  title,
  image = false,
  events,
  children,
}) => {
  const [open, setOpen] = React.useState(false);
  const [complete, setComplete] = React.useState(false);
  const [errored, setErrored] = React.useState(false);
  const [focusedEl, setFocusedEl] = React.useState<Element | null>(null);

  const handleFocus = (capture = true) => {
    // capture the trigger element
    if (capture) return setFocusedEl(document.activeElement);
    // return focus to previous focused element on closing
    focusedEl && (focusedEl as HTMLElement).focus();
    setFocusedEl(null);
  };

  const handleError = () => {
    setComplete(true);
    setErrored(true);
    if (events && events.onError) events.onError();
  };

  const handleClose = () => {
    document.body.classList.remove('modal-open');
    setOpen(false);
    setComplete(false);
    setErrored(false);
    handleFocus(false);
    setComplete(true);
    if (events && events.onClose) events.onClose();
  };

  const handleOpen = () => {
    if (open) return true;
    handleFocus();
    setOpen(true);
    setComplete(false);
    if (image) return handleOpenImage();
    completeLoad();
  };

  const handleOpenImage = () => {
    const { props } = children as React.ReactElement;
    if (!props.src) return setErrored(true);
    const img = new Image();
    img.src = props.src;
    const complete = () => {
      return completeLoad();
    };
    img.onload = complete;
    img.onerror = () => setErrored(true);
  };

  const completeLoad = () => {
    if (children === undefined) return handleError();
    document.body.classList.add('modal-open');
    setComplete(true);
    if (events && events.onOpen) events.onOpen();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Space') return handleOpen();
    return true;
  };

  return (
    <>
      <Trigger onClick={handleOpen} onKeyDown={handleKeyDown} title={title} />
      <Portal>
        {open && (
          <Dialog
            isComplete={complete}
            isErrored={errored}
            onClose={handleClose}
            isImage={image}
          >
            {children}
          </Dialog>
        )}
      </Portal>
    </>
  );
};

export default Modal;
