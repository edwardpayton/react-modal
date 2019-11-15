import React from 'react';

import styles from '../styles/Trigger.module.css';

export interface IProps {
  title: string;
  onClick: () => void;
  onKeyDown: any; // TODO
}

const ModalTrigger: React.FunctionComponent<IProps> = ({
  title,
  onClick,
  onKeyDown,
}) => {
  return (
    <button
      type="button"
      className={styles.trigger}
      onClick={onClick}
      onKeyDown={onKeyDown}
      data-testid="trigger"
    >
      {title}
    </button>
  );
};

export default ModalTrigger;
