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
      query('li:not(.impressum-mobile-link)', [
        style({opacity: 0, transform:'translateX(100px)'}),
        stagger(100, [
          animate('500ms cubic-bezier(0.33, 1, 0.68, 1)', style({ opacity: 1, transform: 'none'}))
        ])
      ]),
      query('li.impressum-mobile-link', [
        style({opacity: 0}),
        animate('500ms', style({opacity: 1}))
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

