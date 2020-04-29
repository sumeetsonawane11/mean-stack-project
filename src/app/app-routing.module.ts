import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { AuthGuardService } from './auth/auth-guard.service';

const routes: Routes = [
  { path: '', component: PostListComponent},
  { path: 'create', component: PostCreateComponent, canActivate : [AuthGuardService]},
  { path: 'edit/:postId', component: PostCreateComponent, canActivate : [AuthGuardService]},
  { path: 'auth', loadChildren : './auth/auth.module#AuthModule'}
];
  
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers : [AuthGuardService]
})
export class AppRoutingModule { }
