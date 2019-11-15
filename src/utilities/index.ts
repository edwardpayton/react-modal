export interface IAnimationEvent {
  name?: string;
  end?: string;
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
