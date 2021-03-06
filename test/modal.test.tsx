import React from 'react';
import { render, fireEvent, cleanup, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Modal from '../src';
import { ModalEvents } from '../src/components/Modal';
import { whichAnimationEvent } from '../src/utilities';

jest.mock('../src/utilities');

describe('Modal Component', () => {
  let testModalText: string;
  let testEvents: ModalEvents;
  let modal: React.ReactElement;

  let imageLoad = () => null;
  const setImageOnload = () => {
    Object.defineProperty(Image.prototype, 'onload', {
      get: function() {
        return this._onload;
      },
      set: function(fn) {
        imageLoad = fn;
        this._onload = fn;
      },
    });
  };

  beforeEach(() => {
    (whichAnimationEvent as jest.Mock).mockReturnValue(undefined);
    testModalText = 'modal content';
    testEvents = {
      onOpen: jest.fn(),
      onClose: jest.fn(),
    };
    modal = (
      <Modal title={'trigger text'} events={testEvents}>
        <p>{testModalText}</p>
      </Modal>
    );
  });

  afterEach(cleanup);

  describe('rendering & click functionality', () => {
    it('renders without crashing', () => {
      const { getByTestId, asFragment } = render(modal);
      expect(getByTestId('trigger')).toHaveTextContent('trigger text');
      expect(document.querySelector('#modalPortal')).toBeDefined();
      expect(asFragment()).toMatchSnapshot();
    });

    it('opens on click', () => {
      const { getByTestId } = render(modal);
      fireEvent.click(getByTestId('trigger'));
      expect(testEvents.onOpen).toHaveBeenCalledTimes(1);
    });

    it('opens type image on click', async () => {
      const modalImage = (
        <Modal title={'trigger text'} events={testEvents} image>
          <img src="https://placeimg.com/100/100/any" alt="test-pic" />
        </Modal>
      );
      const { getByTestId, queryAllByAltText } = render(modalImage);
      setImageOnload();
      act(() => {
        fireEvent.click(getByTestId('trigger'));
        imageLoad();
      });
      expect(await testEvents.onOpen).toHaveBeenCalledTimes(1);
      expect(queryAllByAltText('test-pic')).toBeTruthy();
    });

    it('inserts the content into the portal div', () => {
      const { getByTestId, getByText } = render(modal);
      fireEvent.click(getByTestId('trigger'));
      expect(getByText(testModalText)).toBeDefined();
      expect(getByTestId('close')).toBeDefined();
    });

    it('closes by clicking close button', () => {
      const { getByTestId, queryByText } = render(modal);
      fireEvent.click(getByTestId('trigger'));
      fireEvent.click(getByTestId('close'));
      expect(testEvents.onClose).toHaveBeenCalledTimes(1);
      expect(queryByText(testModalText)).toBeFalsy();
    });

    it('closes by clicking overlay', () => {
      const { getByTestId, queryByText } = render(modal);
      fireEvent.click(getByTestId('trigger'));
      fireEvent.click(getByTestId('dialog'));
      expect(testEvents.onClose).toHaveBeenCalledTimes(1);
      expect(queryByText(testModalText)).toBeFalsy();
    });

    it('opens and closes with css animation', () => {
      (whichAnimationEvent as jest.Mock).mockReturnValue({
        name: 'animation',
        end: 'animationend',
      });
      const event = new Event('animationend');

      const { getByTestId, queryByText } = render(modal);
      fireEvent.click(getByTestId('trigger'));
      fireEvent.click(getByTestId('close'));
      act(() => {
        getByTestId('dialog').dispatchEvent(event);
      });
      expect(testEvents.onClose).toHaveBeenCalledTimes(1);
      expect(queryByText(testModalText)).toBeFalsy();
    });

    //
  });

  describe('keyboard functionality', () => {
    it('opens on key press', () => {
      const { getByTestId } = render(modal);
      const trigger = getByTestId('trigger');

      // enter
      trigger.focus();
      expect(document.activeElement).toBe(trigger);
      fireEvent.keyDown(document.activeElement || document.body, {
        key: 'Enter',
      });
      expect(testEvents.onOpen).toHaveBeenCalled();

      // space
      trigger.focus();
      expect(document.activeElement).toBe(trigger);
      fireEvent.keyDown(document.activeElement || document.body, {
        key: 'Space',
      });
      expect(testEvents.onOpen).toHaveBeenCalled();
    });

    it('closes on key press', () => {
      const { getByTestId } = render(modal);
      const trigger = getByTestId('trigger');
      trigger.focus();
      fireEvent.keyDown(document.activeElement || document.body, {
        key: 'Enter',
      });
      const close = getByTestId('close');
      close.focus();
      fireEvent.keyDown(document.activeElement || document.body, {
        key: 'Enter',
      });
      expect(testEvents.onClose).toHaveBeenCalled();
      expect(document.activeElement).toBe(trigger);
    });

    test.todo('child elements are tabbable');
    // it('child elements are tabbable', () => {
    //   const modalTabableChildren = (
    //     <Modal title={'trigger text'} events={testEvents}>
    //       <button>test button</button>
    //       <a href="./#" role="button">
    //         test anchor
    //       </a>
    //       <input type="text" value="not used" readOnly />
    //     </Modal>
    //   );

    //   const { getByTestId, queryByText } = render(modalTabableChildren);
    //   const trigger = getByTestId('trigger');
    //   trigger.focus();
    //   fireEvent.keyDown(document.activeElement || document.body, {
    //     key: 'Enter',
    //   });

    //   const testButton = queryByText('test button');
    //   const testAnchor = queryByText('test anchor');
    //   // Tab to button
    //   fireEvent.keyDown(document.activeElement || document.body, {
    //     key: 'Tab',
    //   });
    //   expect(document.activeElement).toBe(testButton);
    //   // Tab to anchor
    //   fireEvent.keyDown(document.activeElement || document.body, {
    //     key: 'Tab',
    //   });
    //   expect(document.activeElement).toBe(testAnchor);
    //   // Tab back to button
    //   fireEvent.keyDown(document.activeElement || document.body, {
    //     key: 'Tab',
    //     shiftKey: true,
    //   });
    //   expect(document.activeElement).toBe(testButton);
    // });
  });

  describe('error handling', () => {
    const testEventsError = {
      onError: jest.fn(),
    };
    const modalNoChildren = (
      // @ts-ignore
      <Modal title={'trigger text'} events={testEventsError} />
    ); // TS error because missing props
    const errorText = 'There was a problem opening this content';

    it('shows an error when there are no children', () => {
      const { getByTestId, queryByText } = render(modalNoChildren);
      fireEvent.click(getByTestId('trigger'));
      expect(queryByText(errorText)).toBeTruthy();
    });
  });
});
