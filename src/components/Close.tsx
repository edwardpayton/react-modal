import React from 'react';

import styles from '../styles/Close.module.css';

export interface IProps {
  onClick: () => void;
  onKeyDown: any; // TODO
}

const ModalClose: React.FunctionComponent<IProps> = ({
  onClick,
  onKeyDown,
}) => {
  return (
    <button
      className={styles.close}
      onClick={onClick}
      onKeyDown={onKeyDown}
      type="button"
      data-testid="close"
    >
      <span>Close popup</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-labelledby="xTitle"
        role="img"
      >
        <title id="xTitle">Close button icon</title>
        <path d="M4.99 3.99a1 1 0 0 0-.7 1.72L10.6 12l-6.3 6.3a1 1 0 1 0 1.42 1.4L12 13.42l6.3 6.3a1 1 0 1 0 1.4-1.42L13.42 12l6.3-6.3A1 1 0 0 0 18.98 4a1 1 0 0 0-.69.3L12 10.6l-6.3-6.3A1 1 0 0 0 5 4z" />
      </svg>
    </button>
  );
};

export default ModalClose;
