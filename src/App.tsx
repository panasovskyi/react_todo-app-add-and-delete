import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { SORTFIELD } from './types/SortField';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/ErrorNotification';
import { getVisibleTodos } from './helpers/helper';

export const App: React.FC = () => {
  const [sortField, setSortField] = useState<SORTFIELD>(SORTFIELD.ALL);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState('');

  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        showError('Unable to load todos');
      });
  }, []);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  const deleteTodo = (todoId: number) => {
    setErrorMessage('');

    return todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(currentTodo => currentTodo.id !== todoId),
        );
      })
      .catch(error => {
        setTodos(todos);
        showError('Unable to delete a todo');

        throw error;
      });
  };

  const createTodo = (todo: Todo) => {
    setErrorMessage('');

    const temporaryTodo: Todo = {
      id: 0,
      userId: todoService.USER_ID,
      title,
      completed: false,
    };

    setTempTodo(temporaryTodo);

    return todoService
      .createTodo(todo)
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTempTodo(null);
      })
      .catch(error => {
        setTempTodo(null);
        showError('Unable to add a todo');

        throw error;
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={getVisibleTodos(todos, sortField)}
          onSubmit={createTodo}
          setErrorMessage={setErrorMessage}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
          title={title}
          setTitle={setTitle}
        />

        <TodoList
          todos={todos}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          onDelete={deleteTodo}
          isDeleting={isDeleting}
          setIsDeleting={setIsDeleting}
          isSubmitting={isSubmitting}
        />

        {tempTodo && (
          <TodoList
            todos={[tempTodo]}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            onDelete={() => Promise.resolve()} // поки що нічого не видаляємо
            isDeleting={[0]} // показуємо лоадер
            setIsDeleting={() => {}}
            isSubmitting={isSubmitting}
          />
        )}

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            sortField={sortField}
            setSortField={setSortField}
            onDelete={deleteTodo}
            isDeleting={isDeleting}
            setIsDeleting={setIsDeleting}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
