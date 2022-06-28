import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor() {}

  roleInfo = {
    emp: {
      list: ['superadmin', 'admin', 'subadmin'],
      add: ['superadmin', 'admin', 'subadmin'],
      update: ['superadmin', 'admin', 'subadmin'],
    },
    organisation: {
      list: ['superadmin'],
      add: ['superadmin'],
      update: ['superadmin', 'admin', 'subadmin'],
    },
    seo: {
      list: ['superadmin', 'admin', 'subadmin', 'seateamlead', 'seoteam'],
      add: ['superadmin', 'admin', 'subadmin', 'seateamlead', 'seoteam'],
      update: ['superadmin', 'admin', 'subadmin', 'seateamlead', 'seoteam'],
    },
    campaign: {
      list: [
        'superadmin',
        'admin',
        'subadmin',
        'campaignmanager',
        'seateamlead',
        'seoteam',
      ],
      add: ['superadmin', 'admin', 'subadmin', 'campaignmanager'],
      update: [
        'superadmin',
        'admin',
        'subadmin',
        'campaignmanager',
        'seateamlead',
        'seoteam',
      ],
    },
    referred: {
      list: ['superadmin', 'admin', 'subadmin', 'campaignmanager'],
      add: ['superadmin', 'admin', 'subadmin', 'campaignmanager'],
      update: ['superadmin', 'admin', 'subadmin', 'campaignmanager'],
    },
    volunteers: {
      list: ['superadmin', 'admin', 'subadmin'],
      add: ['superadmin', 'admin', 'subadmin'],
      update: ['superadmin', 'admin', 'subadmin'],
    },
    news: {
      list: ['superadmin', 'admin', 'subadmin'],
      add: ['superadmin', 'admin', 'subadmin'],
      update: ['superadmin', 'admin', 'subadmin'],
    },
    payments: {
      list: ['superadmin', 'admin', 'subadmin'],
      add: ['superadmin', 'admin', 'subadmin'],
      update: ['superadmin', 'admin', 'subadmin'],
    },
    helpdesk: {
      list: ['superadmin', 'admin', 'subadmin', 'helpdeskteamlead', 'helpdesk'],
      add: ['superadmin', 'admin', 'subadmin', 'helpdeskteamlead', 'helpdesk'],
      update: [
        'superadmin',
        'admin',
        'subadmin',
        'helpdeskteamlead',
        'helpdesk',
      ],
    },
    blogs: {
      list: ['superadmin', 'admin', 'subadmin', 'seateamlead', 'seoteam'],
      add: ['superadmin', 'admin', 'subadmin', 'seateamlead', 'seoteam'],
      update: ['superadmin', 'admin', 'subadmin', 'seateamlead', 'seoteam'],
    },
    stories: {
      list: [
        'superadmin',
        'admin',
        'subadmin',
        'campaignmanager',
        'seoteamlead',
        'seoteam',
      ],
      add: ['superadmin', 'admin', 'subadmin', 'campaignmanager'],
      update: [
        'superadmin',
        'admin',
        'subadmin',
        'campaignmanager',
        'seoteamlead',
        'seoteam',
      ],
    },
    ticket: {
      list: ['superadmin', 'admin', 'subadmin', 'helpdeskteamlead', 'helpdesk'],
      add: ['superadmin', 'admin', 'subadmin', 'helpdeskteamlead', 'helpdesk'],
      update: [
        'superadmin',
        'admin',
        'subadmin',
        'helpdeskteamlead',
        'helpdesk',
      ],
    },
    gallery: {
      list: ['superadmin', 'admin', 'subadmin', 'seateamlead', 'seoteam'],
      add: ['superadmin', 'admin', 'subadmin', 'seateamlead', 'seoteam'],
      update: ['superadmin', 'admin', 'subadmin', 'seateamlead', 'seoteam'],
    },
    videogallery: {
      list: ['superadmin', 'admin', 'subadmin', 'seateamlead', 'seoteam'],
      add: ['superadmin', 'admin', 'subadmin', 'seateamlead', 'seoteam'],
      update: ['superadmin', 'admin', 'subadmin', 'seateamlead', 'seoteam'],
    },
    contactlist: {
      list: [
        'superadmin',
        'admin',
        'subadmin',
        'reportingteamlead',
        'reportingteam',
      ],
      add: [
        'superadmin',
        'admin',
        'subadmin',
        'reportingteamlead',
        'reportingteam',
      ],
      update: [
        'superadmin',
        'admin',
        'subadmin',
        'reportingteamlead',
        'reportingteam',
      ],
    },
  };

  public resolve(roles: Array<string>, module: string, action = 'list') {
    if (roles.indexOf('superadmin') >= 0) return true;
    else if (
      roles.length > 0 &&
      this.roleInfo[module] &&
      this.roleInfo[module][action]
    ) {
      let common = roles.filter((item1) =>
        this.roleInfo[module][action].some((item2: any) => item1 === item2)
      );
      return common.length > 0;
    } else return false;
  }
}
