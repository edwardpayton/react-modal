# React Modal

`yarn add @ejp/react-modal`

A small utility hook to use Axios in your React components, with a simple and familiar API.

## USAGE

```javascript

import Modal from '@ejp/react-modal';

...
function ModalWithText() {
  return (
    <Modal title="Open Modal">
      <p>my awesome content</p>
    </Modal>
  );
}

function ModalWithImage() {
  return (
    <Modal title="Open Image Modal" image>
      <img src="https://placeimg.com/700/700/nature" alt="" />
    </Modal>
  );
}

// TODO

```

Project was bootstraped with the excellent [TSDX](https://github.com/jaredpalmer/tsdx) framework.
