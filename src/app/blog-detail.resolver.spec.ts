import { TestBed } from '@angular/core/testing';

import { BlogDetailResolver } from './blog-detail.resolver';

describe('BlogDetailResolver', () => {
  let resolver: BlogDetailResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(BlogDetailResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
