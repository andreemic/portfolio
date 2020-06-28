import { trigger, animate, transition, style, query, stagger} from '@angular/animations';

export const fadeAnimation =
  trigger('fadeAnimation', [

  // route 'enter and leave (<=>)' transition
    transition('* => projects', [
      query('mat-card', [
        style({opacity: 0}),
        stagger(300, [
          animate('500ms', style({opacity: 1}))
        ])
      ])
    ]),
    transition('*<=>*', [

      // css styles at start of transition
      style({ opacity: 0 }),

      // animation and styles at end of transition
      animate('0.4s', style({ opacity: 1 }))
    ]),
  ]);
