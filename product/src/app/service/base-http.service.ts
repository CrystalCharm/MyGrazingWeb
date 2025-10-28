import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { map, shareReplay } from "rxjs/operators";
import { environment } from "../../environments/environment";

const CACHE_SIZE = 1;

export class BaseHttpService {
  protected cache$!: Observable<any>; 
  protected apiServerUrl: string;
  protected path: string;

  constructor(protected http: HttpClient, path: string) {
    this.path = path; 
    this.apiServerUrl = environment.apiBaseUrl;
  }

  protected get baseUrl(): string {
    return `${this.apiServerUrl}${this.path}`;
  }

  public getData(): Observable<any> {
    if (!this.cache$) {
      this.cache$ = this.requestData().pipe(shareReplay(CACHE_SIZE));
    } 
    return this.cache$;   
  }

  protected requestData(): Observable<any> {
    return this.http.get(this.baseUrl).pipe(map(response => response));
  }

  public findAll(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  public add(param: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, param);
  }


}
