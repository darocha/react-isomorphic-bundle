'use strict'

import { Router } from 'react-router'
import { sync } from 'shared/actions/AuthActions'

export default function (nextState, transition) {
  this.redux.dispatch(sync())
  const isAuthenticated = this.redux.getState().auth.isAuthenticated
  //console.log('isAuthenticated', isAuthenticated)
  if (!isAuthenticated)
    transition.to(
      '/login',
      null,
      { nextPathname: nextState.location.pathname }
    )
}

