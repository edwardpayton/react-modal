/** Detect css animation event name
 *
 */
export interface Animation {
  name: string;
  end: string;
}

export function whichAnimationEvent(): Animation | undefined {
  const elem = document.createElement('div');
  const animations: Animation[] = [
    { name: 'animation', end: 'animationend' },
    { name: 'OAnimation', end: 'webkitAnimationEnd' },
    { name: 'MozAnimation', end: 'animationend' },
    { name: 'WebkitAnimation', end: 'webkitAnimationEnd' },
  ];

  for (const anim in animations) {
    const { name } = animations[anim];
    if (elem.style[name as any] !== undefined) return animations[anim];
  }
  return undefined;
}

/** Simple throttle function
 * @param cb callback function
 * @param time throttle delay, defaults to 500ms
 */
export function simpleThrottle(cb: () => void, time = 500) {
  var lastTime = 0;
  return function() {
    var now = +new Date();
    if (now - lastTime >= time) {
      cb();
      lastTime = now;
    }
  };
}
