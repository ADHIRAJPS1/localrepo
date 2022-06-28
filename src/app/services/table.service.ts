import { Injectable, PipeTransform } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { SortColumn, SortDirection } from '../directives/sortable.directive';

interface SearchResult {
  resultList: any[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
  searchOn: Array<string>;
  searchOnColumn: string;
}

const compare = (v1: string | number, v2: string | number) =>
  v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(resultList: any[], column: SortColumn, direction: string): any[] {
  if (direction === '' || column === '') {
    return resultList;
  } else {
    return [...resultList].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(
  list: any,
  term: string,
  pipe: PipeTransform,
  searchOn: any,
  keys: Array<any>
) {
  if (searchOn.length > 0) {
    let found = false;

    searchOn.forEach((k: any) => {
      if (list[k].toLowerCase().includes(term.toLowerCase())) found = true;
    });

    return found;
  } else {
    let found = false;

    if (keys.length > 0) {
      keys.forEach((k) => {
        if (list[k].toLowerCase().includes(term.toLowerCase())) found = true;
      });
      return found;
    } else {
      return list;
    }
  }
}

@Injectable({ providedIn: 'root' })
export class TableService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _resultList$ = new BehaviorSubject<any[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  DATA = [];

  private _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
    searchOn: [],
    searchOnColumn: '',
  };

  constructor(private pipe: DecimalPipe) {
    this._search$
      .pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(200),
        switchMap(() => this._search()),
        delay(200),
        tap(() => this._loading$.next(false))
      )
      .subscribe((result) => {
        this._resultList$.next(result.resultList);
        this._total$.next(result.total);
      });

    this._search$.next();
  }

  get resultList$() {
    return this._resultList$.asObservable();
  }
  get total$() {
    return this._total$.asObservable();
  }
  get loading$() {
    return this._loading$.asObservable();
  }
  get page() {
    return this._state.page;
  }
  get pageSize() {
    return this._state.pageSize;
  }
  get searchTerm() {
    return this._state.searchTerm;
  }

  set page(page: number) {
    this._set({ page });
  }
  set pageSize(pageSize: number) {
    this._set({ pageSize });
  }
  set searchTerm(searchTerm: string) {
    this._set({ searchTerm });
  }

  set searchOn(searchOn: Array<string>) {
    this._set({ searchOn });
  }
  set searchOnColumn(searchOnColumn: string) {
    this._set({ searchOnColumn });
  }

  set sortDirection(sortDirection: SortDirection) {
    this._set({ sortDirection });
  }
  set sortColumn(sortColumn: SortColumn) {
    this._set({ sortColumn });
  }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const {
      sortColumn,
      sortDirection,
      pageSize,
      page,
      searchTerm,
      searchOn,
      searchOnColumn,
    } = this._state;
    // 1. sort
    let resultList = sort(this.DATA, sortColumn, sortDirection);

    // 2. filter
    let keys = [];
    if (resultList.length > 0) {
      keys = Object.keys(resultList[0]);
    }
    resultList = resultList.filter((list) =>
      matches(list, searchTerm, this.pipe, searchOn, keys)
    );
    const total = resultList.length;
    // 4. paginate
    resultList = resultList.slice(
      (page - 1) * pageSize,
      (page - 1) * pageSize + pageSize
    );
    return of({ resultList, total });
  }
}
