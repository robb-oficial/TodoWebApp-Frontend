import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Service()
export class TodoClient {
    private http = inject(HttpClient);
    private url = environment.apiUrl;
    todos = signal<Todo[]>([]);


    getTodos(): Observable<any> {
        return this.http.get(this.url + '/todos', {
            credentials: 'include'
        });
    }

    createTodo(todoData: FormData): Observable<any> {
        return this.http.post(this.url + '/todos', todoData, {
            credentials: 'include'
        });
    }

    getTodo(id: string): Observable<any> {
        return this.http.get(this.url + `/todos/${id}`, {
            credentials: 'include'
        });
    }

    markTodoAsDone(id: string): Observable<any> {
        return this.http.patch(this.url + `/todos/complete/${id}`, null, {
            credentials: 'include'
        });
    }

    editTodo(id: string, todoData: FormData): Observable<any> {
        return this.http.patch(this.url + `/todos/${id}`, todoData, {
            credentials: 'include'
        });
    }

    deleteTodo(id: string): Observable<any> {
        return this.http.delete(this.url + `/todos/${id}`, {
            credentials: 'include'
        });
    }

    getTodosAnalytics(): Observable<any> {
        return this.http.get(this.url + '/todos/dashboard', {
            credentials: 'include'
        });
    }
}
