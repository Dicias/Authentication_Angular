import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, pipe, tap, throwError } from 'rxjs';
import { AuthStatus, LoginResponse, User } from '../interfaces';
import { CheckTokenResponse } from '../interfaces/check-token.response';
import { RegisterUser } from '../interfaces/register-user.interface';
import { RegisterResponse } from '../interfaces/register-response.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  private _currentUser = signal<User|null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.cheking);

  //! Al mundo exterior

  public currentUser = computed( () =>this._currentUser());
  public authStatus = computed( () =>this._authStatus());

  constructor() {
    this.checkAuthStatus().subscribe();
  }

  private setAuthentication(user: User, token: string): boolean {
    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token', token);
    return true
  }


  login(email: string, password: string): Observable<boolean>{

    // /auth/login
    const url = `${this.baseUrl}/auth/login`;

    const body = { email, password}

    return this.http.post<LoginResponse>(url, body)
    .pipe(
      map( ({user, token}) => this.setAuthentication(user, token)),

      //TODO errores
      catchError( err =>  throwError( () => err.error.message ))

    );
  };

  register(registerUser: RegisterUser): Observable<boolean>{
    const url = `${this.baseUrl }/auth/register`;
    return this.http.post<RegisterResponse>(url, registerUser)
    .pipe(
      map( ({user, token}) => this.setAuthentication(user, token)),
      catchError(err => throwError ( () => err.error.message))
    )
  }

  checkAuthStatus(): Observable<boolean> {
    const url = `${this.baseUrl}/auth/check-token`;
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
      return of(false);
    }

    const headers = new HttpHeaders()
    .set("Authorization", `Bearer ${token}`);

    return this.http.get<CheckTokenResponse>(url, {headers})
    .pipe(
      map( ({user, token}) => this.setAuthentication(user, token)),
      catchError( () =>{
        this._authStatus.set(AuthStatus.notAuthenticated);
        return of (false)
      })
    )

  }

  logout(){
    this._currentUser.set(null)
    this._authStatus.set(AuthStatus.notAuthenticated);
    localStorage.clear();
    return;
  }

}
