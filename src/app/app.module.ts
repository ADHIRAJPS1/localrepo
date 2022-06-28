import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// Import library module
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserModule, Meta } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './pages/header/header.component';
import { FooterComponent } from './pages/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutusComponent } from './pages/aboutus/aboutus.component';
import { ContactusComponent } from './pages/contactus/contactus.component';
import { CareerComponent } from './pages/career/career.component';
import { CauseDetailsComponent } from './pages/cause-details/cause-details.component';
import { BlogComponent } from './pages/blog/blog.component';
import { BlogDetailsComponent } from './pages/blog-details/blog-details.component';
import { OurgalleryComponent } from './pages/ourgallery/ourgallery.component';
import { HelpusComponent } from './pages/helpus/helpus.component';
import { PrivacypolicyComponent } from './pages/privacypolicy/privacypolicy.component';
import { TermsandconditionComponent } from './pages/termsandcondition/termsandcondition.component';
import { CasesComponent } from './pages/cases/cases.component';
import { PartnerwithusComponent } from './pages/partnerwithus/partnerwithus.component';
import { WhereweworkComponent } from './pages/wherewework/wherewework.component';
import { CovidComponent } from './pages/covid/covid.component';
import { ActivitiesComponent } from './pages/activities/activities.component';
import { PressreleaseComponent } from './pages/pressrelease/pressrelease.component';
import { UpcomingeventsComponent } from './pages/upcomingevents/upcomingevents.component';
import { UpcomingeventsdetailsComponent } from './pages/upcomingeventsdetails/upcomingeventsdetails.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { PressreleasedetailsComponent } from './pages/pressreleasedetails/pressreleasedetails.component';
import { ActivitiesdetailsComponent } from './pages/activitiesdetails/activitiesdetails.component';
import { AccountabilityComponent } from './pages/accountability/accountability.component';
import { PagesComponent } from './pages/pages.component';
import { ToastrModule } from 'ngx-toastr';
import { VideosComponent } from './pages/videos/videos.component';
import { SuccessstoriesComponent } from './pages/successstories/successstories.component';
import { SuccessstoriesdetailsComponent } from './pages/successstoriesdetails/successstoriesdetails.component';
import { SociallinkComponent } from './optional/sociallink/sociallink.component';
import { ChartsModule } from 'ng2-charts';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { MedicaltopicsComponent } from './pages/medicaltopics/medicaltopics.component';
import { MedicaltopicsdetailsComponent } from './pages/medicaltopicsdetails/medicaltopicsdetails.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { NgPipesModule } from 'ngx-pipes';
import { SortableHeaderDirective } from './directives/sortable.directive';
import { TableService } from './services/table.service';
import { FileUpload } from './components/file-upload/file-upload.component';
import { TagInput } from './components/tag-input/tag-input.component';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Config } from './services/config';
import { SafePipe } from './pipes/sainetization.pipe';
import { AppAuth } from './services/app-auth.service';
import { AppHttp } from './services/app-http.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from 'ckeditor4-angular';
// import { AppImg } from './components/app-img/app-img';
import { SeoService } from './services/seo.service';
//import { MapModalComponent } from './optional/map-modal/map-modal.component';
import { RefersComponent } from './components/refers/refers.component';
import { NewsDetailsComponent } from './pages/news-details/news-details.component';
import { VolunteerComponent } from './components/volunteer/volunteer.component';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { DonationListComponent } from './components/donation-list/donation-list.component';
import { ReferralListComponent } from './components/referral-list/referral-list.component';
import { NgxYoutubePlayerModule } from 'ngx-youtube-player';
import { DonateComponent } from './components/donate/donate.component';
import { CampaignDonateComponent } from './components/campaign-donate/campaign-donate.component';
import { ShortNamePipe } from './directives/short-name.pipe';
import { YoutubemodalComponent } from './optional/youtubemodal/youtubemodal.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { RoleService } from './services/roles.service';
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
import { Limit } from './pipes/limit';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { AlertModelBoxComponent } from './components/alert-model-box/alert-model-box.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MultipleFileUpload } from './components/multiple-file-upload/multiple-file-upload.component';
import { ImageCompressComponent } from './components/image-compress/image-compress.component';
import { NgxImageCompressService } from 'ngx-image-compress';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    FileUpload,
    TagInput,
    HomeComponent,
    AboutusComponent,
    ContactusComponent,
    CareerComponent,
    CauseDetailsComponent,
    BlogComponent,
    BlogDetailsComponent,
    OurgalleryComponent,
    HelpusComponent,
    PrivacypolicyComponent,
    TermsandconditionComponent,
    CasesComponent,
    PartnerwithusComponent,
    WhereweworkComponent,
    CovidComponent,
    ActivitiesComponent,
    PressreleaseComponent,
    UpcomingeventsComponent,
    UpcomingeventsdetailsComponent,
    PressreleasedetailsComponent,
    ActivitiesdetailsComponent,
    AccountabilityComponent,
    PagesComponent,
    VideosComponent,
    SuccessstoriesComponent,
    SuccessstoriesdetailsComponent,
    SociallinkComponent,
    MedicaltopicsComponent,
    MedicaltopicsdetailsComponent,
    SortableHeaderDirective,
    //MapModalComponent,
    RefersComponent,
    MultipleFileUpload,
    NewsDetailsComponent,
    VolunteerComponent,
    EmployeeListComponent,
    DonationListComponent,
    ReferralListComponent,
    DonateComponent,
    CampaignDonateComponent,
    YoutubemodalComponent,
    SitemapComponent,
    LoginComponent,
    ProfileComponent,
    CampaignanonymoususerComponent,
    FaqComponent,
    FaqdetailsComponent,
    ForgetPasswordComponent,
    ChangePasswordComponent,
    RecreatepasswardComponent,
    NotFountComponent,
    Limit,
    SafePipe,
    ProjectPartnerComponent,
    EditProfileComponent,
    AlertModelBoxComponent,
    ImageCompressComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    CarouselModule,
    HttpClientModule,
    AppRoutingModule,
    NgxSpinnerModule,
    NgPipesModule,
    AngularEditorModule,
    ShareButtonsModule.withConfig({
      debug: true,
    }),
    ModalModule.forRoot(),
    ShareIconsModule,
    CKEditorModule,
    LazyLoadImageModule,
    ChartsModule,
    NgxIntlTelInputModule,
    NgxYoutubePlayerModule.forRoot(),
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot({
      timeOut: 1000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
    }), // ToastrModule added
    InfiniteScrollModule,
  ],
  providers: [
    Config,
    AppAuth,
    AppHttp,
    TableService,
    DecimalPipe,
    DatePipe,
    SeoService,
    Meta,
    RoleService,
    NgbActiveModal,
    NgxImageCompressService,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
