import { inject, Service } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Service()
export class Auth {
    private url = environment.apiUrl;
    private http = inject(HttpClient);

    signup(formData: FormData) {
        return this.http.post(this.url + '/users/signup', formData);
    }
}
