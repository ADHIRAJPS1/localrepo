import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
//import { ExecutiveManagerComponent } from './pages/executive-manager/executive-manager.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutusComponent } from './pages/aboutus/aboutus.component';
import { ActivitiesComponent } from './pages/activities/activities.component';
import { BlogDetailsComponent } from './pages/blog-details/blog-details.component';
import { BlogComponent } from './pages/blog/blog.component';
import { CareerComponent } from './pages/career/career.component';
import { CasesComponent } from './pages/cases/cases.component';
import { CauseDetailsComponent } from './pages/cause-details/cause-details.component';
import { ContactusComponent } from './pages/contactus/contactus.component';
import { CovidComponent } from './pages/covid/covid.component';
import { HelpusComponent } from './pages/helpus/helpus.component';
import { HomeComponent } from './pages/home/home.component';
import { OurgalleryComponent } from './pages/ourgallery/ourgallery.component';
import { PartnerwithusComponent } from './pages/partnerwithus/partnerwithus.component';
import { PrivacypolicyComponent } from './pages/privacypolicy/privacypolicy.component';
import { TermsandconditionComponent } from './pages/termsandcondition/termsandcondition.component';
import { WhereweworkComponent } from './pages/wherewework/wherewework.component';
import { PressreleaseComponent } from './pages/pressrelease/pressrelease.component';
import { UpcomingeventsComponent } from './pages/upcomingevents/upcomingevents.component';
import { UpcomingeventsdetailsComponent } from './pages/upcomingeventsdetails/upcomingeventsdetails.component';
import { PressreleasedetailsComponent } from './pages/pressreleasedetails/pressreleasedetails.component';
import { ActivitiesdetailsComponent } from './pages/activitiesdetails/activitiesdetails.component';
import { AccountabilityComponent } from './pages/accountability/accountability.component';
import { PagesComponent } from './pages/pages.component';
import { AuthGuard } from './shared/auth.guard';
import { VideosComponent } from './pages/videos/videos.component';
import { SuccessstoriesComponent } from './pages/successstories/successstories.component';
import { SuccessstoriesdetailsComponent } from './pages/successstoriesdetails/successstoriesdetails.component';
import { MedicaltopicsComponent } from './pages/medicaltopics/medicaltopics.component';
import { MedicaltopicsdetailsComponent } from './pages/medicaltopicsdetails/medicaltopicsdetails.component';
import seo from './services/seo-config.json';
import { NewsDetailsComponent } from './pages/news-details/news-details.component';
import { BlogDetailResolver } from './blog-detail.resolver';
import { CauseDetailsResolver } from './cause-details.resolver';
import { AutoLoginGuard } from './shared/auto-login.guard';
import { SitemapComponent } from './pages/sitemap/sitemap.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CampaignanonymoususerComponent } from './pages/campaignanonymoususer/campaignanonymoususer.component';
import { FaqComponent } from './pages/faq/faq.component';
import { FaqdetailsComponent } from './pages/faqdetails/faqdetails.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { RecreatepasswardComponent } from './pages/recreatepassward/recreatepassward.component';
import { NotFountComponent } from './pages/not-fount/not-fount.component';
import { ProjectPartnerComponent } from './pages/project-partner/project-partner.component';
import { MedicalDetailsResolver } from './medical-detail.resolver';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      { path: '', component: HomeComponent, data: seo.default },
      { path: 'aboutpgc', component: AboutusComponent, data: seo.aboutUs },
      { path: 'contactus', component: ContactusComponent, data: seo.contactUs },
      { path: 'careers', component: CareerComponent, data: seo.careers },
      { path: '404', component: NotFountComponent },
      { path: 'project-partner', component: ProjectPartnerComponent },
      {
        path: 'medical-support',
        component: CasesComponent,
        data: seo.medicalCases,
      },
      {
        path: 'medical-support/:storyslug',
        component: CauseDetailsComponent,
        data: seo.default,
        resolve: { story: CauseDetailsResolver },
      },
      { path: 'blogs', component: BlogComponent, data: seo.blogs },
      {
        path: 'blogs/:blogslug',
        component: BlogDetailsComponent,
        data: seo.default,
        resolve: { blog: BlogDetailResolver },
      },
      { path: 'news/:slug', component: NewsDetailsComponent },
      { path: 'images', component: OurgalleryComponent },
      { path: 'videos', component: VideosComponent },
      { path: 'donate', component: HelpusComponent, data: seo.donate },
      {
        path: 'privacy-policy',
        component: PrivacypolicyComponent,
        data: seo.privacyPolicy,
      },
      {
        path: 'terms-condition',
        component: TermsandconditionComponent,
        data: seo.termsCondition,
      },
      { path: 'ourpartner', component: PartnerwithusComponent },
      { path: 'our-presence', component: WhereweworkComponent },
      { path: 'covid-19', component: CovidComponent, data: seo.covid19 },
      { path: 'activities', component: ActivitiesComponent },
      { path: 'activitiesdetails', component: ActivitiesdetailsComponent },
      { path: 'pressreleases', component: PressreleaseComponent },
      { path: 'pressreleasesdetails', component: PressreleasedetailsComponent },
      { path: 'sitemap', component: SitemapComponent },
      { path: 'events', component: UpcomingeventsComponent },
      { path: 'events-details', component: UpcomingeventsdetailsComponent },
      {
        path: 'accountability',
        component: AccountabilityComponent,
        data: seo.accountability,
      },
      { path: 'successstories', component: SuccessstoriesComponent },
      {
        path: 'successstoriesdetails/:storyslug',
        data: seo.default,
        component: SuccessstoriesdetailsComponent,
      },
      {
        path: 'medical-awareness',
        component: MedicaltopicsComponent,
        data: seo.medicalAwareness,
      },
      {
        path: 'medical-awareness/:nSlug',
        data: seo.default,
        component: MedicaltopicsdetailsComponent,
        resolve: { medical: MedicalDetailsResolver },
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard],
      },
      { path: 'login', component: LoginComponent, data: seo.login },
      { path: 'start-a-fundraiser', component: CampaignanonymoususerComponent },
      // { path: 'faqs', component: FaqComponent },
      { path: 'faqs', component: FaqdetailsComponent },
      { path: 'forget-password', component: ForgetPasswordComponent },
      {
        path: 'change-password',
        component: ChangePasswordComponent,
        canActivate: [AuthGuard],
      },
      { path: 'recreatepassward', component: RecreatepasswardComponent },
      { path: 'edit-profile/:userid', component: EditProfileComponent },
      //{ path: 'executive-manager', component: ExecutiveManagerComponent },
    ],
  },
  { path: '**', redirectTo: '/404', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollOffset: [0, 0],
      scrollPositionRestoration: 'top',
      initialNavigation: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
