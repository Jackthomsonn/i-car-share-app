import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { IsAuthorised } from './guards/is-authorised.guard';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule', canActivate: [IsAuthorised] },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'tracker', loadChildren: './pages/tracker/tracker.module#TrackerPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})

export class AppRoutingModule { }
