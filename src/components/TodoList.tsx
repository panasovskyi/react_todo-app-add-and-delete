import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  isEditing: number | null;
  setIsEditing: (value: number | null) => void;
  onDelete: (value: number) => Promise<void>;
  isDeleting: number[];
  setIsDeleting: (value: number[]) => void;
  isSubmitting: number | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  isEditing,
  setIsEditing,
  onDelete,
  isDeleting,
  setIsDeleting,
  isSubmitting,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          onDelete={onDelete}
          isDeleting={isDeleting}
          setIsDeleting={setIsDeleting}
          isSubmitting={isSubmitting}
        />
      ))}
    </section>
  );
};
