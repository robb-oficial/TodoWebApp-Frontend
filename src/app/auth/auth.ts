import { inject, Service, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './auth-types';

@Service()
export class Auth {
    user = signal<User | undefined>(undefined);
    private url = environment.apiUrl;
    private http = inject(HttpClient);

    signup(formData: FormData): Observable<any> {
        return this.http.post(this.url + '/users/signup', formData);
    }

    login(data: any): Observable<any> {
        return this.http.post(this.url + '/users/login', data, {
            credentials: 'include'
        });
    }

    checkSession(): Observable<any> {
        return this.http.get(this.url + '/users', {
            credentials: 'include'
        });
    }

    logout(): Observable<any> {
        return this.http.post(this.url + '/users/logout', null, {
            credentials: 'include'
        });
    }
}
