<p style="float: left; margin-bottom: 50px">
<a href="https://www.npmjs.com/package/@ejp/react-modal">
<img src="https://badgen.net/npm/v/@ejp/react-modal" /> 
</a>
<a href="https://www.npmjs.com/package/@ejp/react-modal">
<img src="https://badgen.net/npm/license/@ejp/react-modal" /> 
</a>
<a href="https://www.npmjs.com/package/@ejp/react-modal">
<img src="https://badgen.net/npm/types/@ejp/react-modal"/>
</a>
<!---
<a href="https://bundlephobia.com/result?p=@ejp/react-modal">
<img src="https://badgen.net/bundlephobia/min/@ejp/react-modal" /> 
</a>
-->
<a href="https://circleci.com/gh/edwardpayton/react-modal">
<img src="https://badgen.net/circleci/github/edwardpayton/react-modal"/> 
</a>
<a href="https://app.codacy.com/manual/edwardjpayton/react-modal/dashboard">
 <img src="https://api.codacy.com/project/badge/Grade/8905c0bbc57f4635bf209e77e62ec14f?isInternal=true" />
</a>
<a href="#">
<img src="https://badgen.net/dependabot/edwardpayton/react-modal/?icon=dependabot"/>
</a>
</p>

# React Modal

`yarn add @ejp/react-modal`

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
