import {
  trigger,
  state,
  style,
  animate,
  transition,
  stagger,
  query,
  group
} from '@angular/animations';

export const mobileNavAnimations = [trigger('openClose', [
  transition('closed => open', [
    style({display: 'block'}),
    group([
      animate('300ms cubic-bezier(0.33, 1, 0.68, 1)', style({opacity:1})),
      query('li', [
        style({opacity: 0, transform:'translateX(100px)'}),
        stagger(100, [
          animate('500ms cubic-bezier(0.33, 1, 0.68, 1)', style({ opacity: 1, transform: 'none'}))
        ])
      ])
    ])
  ]),
  transition('open => closed', [
    animate('150ms cubic-bezier(0.33, 1, 0.68, 1)')
  ]),
  state('closed', style({
    opacity: 0,
    display: 'none'
  })),
  state('open', style({
    opacity: 1,
    display: 'block'
  }))
])];

