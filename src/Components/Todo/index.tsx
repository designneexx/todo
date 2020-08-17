import React, { FC, MouseEvent, useCallback } from 'react';
import { Checkbox, Button } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import { TodoI } from '../../api/todo';

export interface TodoProps {
  todos: TodoI[];
  todo: TodoI;
  onDelete: (todo: TodoI, todos: TodoI[], event: MouseEvent<HTMLElement>) => void;
  onPerform: (todo: TodoI, todos: TodoI[], event: CheckboxChangeEvent) => void;
  className?: string;
}

const StyledDiv = styled.div`
  margin-top: 12px;
  margin-left: 12px;
`;

const TodoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

const StyledContainer = styled.div`
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.15);
  border: 1px solid #f0f0f0;
  padding: 12px;
  margin-bottom: 12px;
`;

export const Todo: FC<TodoProps> = observer(({ todo, todos, onDelete, onPerform, className }) => {
  const { todos: deepTodos, text, isPerform } = todo;

  const handleDelete = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      onDelete(todo, todos, e);
    },
    [onDelete],
  );

  const handlePerform = useCallback(
    (e: CheckboxChangeEvent) => {
      onPerform(todo, todos, e);
    },
    [onPerform],
  );

  return (
    <StyledContainer className={className}>
      <TodoContainer>
        <Checkbox checked={isPerform} onChange={handlePerform}>
          {text}
        </Checkbox>
        {isPerform && <Button onClick={handleDelete}>Удалить</Button>}
      </TodoContainer>
      <StyledDiv>
        {deepTodos.map((deepTodo) => (
          <StyledTodo
            todo={deepTodo}
            todos={deepTodos}
            onDelete={onDelete}
            onPerform={onPerform}
            key={deepTodo.id}
          />
        ))}
      </StyledDiv>
    </StyledContainer>
  );
});

const StyledTodo = styled(Todo)`
  padding: 0;
  box-shadow: none;
  border: none;
  margin: none;
`;

export default Todo;
