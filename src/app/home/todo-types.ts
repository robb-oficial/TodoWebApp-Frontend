type TodoStatus = 'pending' | 'done' | 'expired';

interface Photo {
    id?: String;
    path: String;
}

interface Todo {
    id: number;
    title: string;
    content: string;
    priority: number;
    status: TodoStatus;
    createdAt: Date;
    deadline?: Date;
}