import React, { ChangeEvent, FC, useCallback, useMemo, useState } from 'react';
import shortid from 'shortid';
import { observer, useLocalStore } from 'mobx-react-lite';
import { Button, Input, Modal, Select } from 'antd';
import styled from 'styled-components';
import Todo from '../Todo';
import { TodoI } from '../../api/todo';

const { Option } = Select;

const StyledSelect = styled(Select)`
  width: 100%;
`;

const SUPER_PARENT = 'SUPER_PARENT';

export const Todos: FC = observer(() => {
  const [{ isOpen, parentTodoId, text: todoText }, setAddTodo] = useState<{
    isOpen: boolean;
    parentTodoId: string;
    text: string;
    level: number;
  }>({
    isOpen: false,
    parentTodoId: '',
    text: '',
    level: 1,
  });
  const [{ isOpen: deleteOpen, index, currentTodos: deleteTodos }, setDeleteTodo] = useState<{
    isOpen: boolean;
    index: number;
    currentTodos: TodoI[];
  }>({
    isOpen: false,
    index: 0,
    currentTodos: [],
  });
  const store = useLocalStore<{
    todos: TodoI[];
    flatTodos: TodoI[];
  }>(() => ({
    todos: [],
    get flatTodos(): TodoI[] {
      const getFlatTodos = (myTodos: TodoI[]) => {
        const currentTodos: TodoI[] = [];

        myTodos.forEach(({ todos: deepTodos, ...todo }) => {
          currentTodos.push({ todos: deepTodos, ...todo }, ...getFlatTodos(deepTodos));
        });

        return currentTodos;
      };

      return getFlatTodos(store.todos).filter(({ level }) => level < 3);
    },
  }));
  const { todos, flatTodos } = store;

  const handleDelete = useCallback((currentTodo: TodoI, currentTodos: TodoI[]) => {
    const currentIdx = currentTodos.findIndex((todo) => todo === currentTodo);

    if (currentIdx !== -1) {
      setDeleteTodo({
        index: currentIdx,
        currentTodos,
        isOpen: true,
      });
    }
  }, []);

  const handlePerform = useCallback((currentTodo: TodoI, currentTodos: TodoI[]) => {
    const currentIdx = currentTodos.findIndex((todo) => todo === currentTodo);
    const isPerform = !currentTodo.isPerform;

    if (currentIdx !== -1) {
      currentTodos.splice(currentIdx, 1);

      if (isPerform) {
        currentTodos.splice(currentTodos.length, 0, currentTodo);
      } else {
        const hasTodoPerform = currentTodos.find((todo) => todo.isPerform);

        if (hasTodoPerform) {
          currentTodos.splice(0, 0, currentTodo);
        } else {
          currentTodos.splice(currentIdx, 0, currentTodo);
        }
      }

      Reflect.set(currentTodo, 'isPerform', isPerform);
    }
  }, []);

  const onCancel = useCallback(() => {
    setAddTodo((oldData) => ({ ...oldData, isOpen: false }));
  }, []);

  const handleOk = useCallback(() => {
    const parentTodo = flatTodos.find(({ id }) => id === parentTodoId);

    if (parentTodo) {
      parentTodo.todos.push({
        id: shortid(),
        isPerform: false,
        todos: [],
        text: todoText,
        level: parentTodo.level + 1,
      });
    } else {
      todos.push({
        id: shortid(),
        isPerform: false,
        todos: [],
        text: todoText,
        level: 1,
      });
    }

    onCancel();
  }, [onCancel, parentTodoId, todoText, flatTodos]);

  const handleParentTodoChange = useCallback((value: string) => {
    setAddTodo((oldData) => ({
      ...oldData,
      parentTodoId: value,
    }));
  }, []);

  const handleTodoTitleChange = useCallback(
    ({ target: { value: text } }: ChangeEvent<HTMLInputElement>) => {
      setAddTodo((oldData) => ({
        ...oldData,
        text,
      }));
    },
    [],
  );

  const handleCreateTodo = useCallback(() => {
    setAddTodo((oldData) => ({
      ...oldData,
      isOpen: true,
    }));
  }, []);

  const handleDeleteOk = useCallback(() => {
    setDeleteTodo((oldData) => ({
      ...oldData,
      isOpen: false,
    }));
    deleteTodos.splice(index, 1);
  }, [deleteTodos, index]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteTodo((oldData) => ({
      ...oldData,
      isOpen: false,
    }));
  }, []);

  const selectOptions = useMemo(
    () => [
      <Option value={SUPER_PARENT}>Главная задача</Option>,
      ...flatTodos.map(({ text, id }) => (
        <Option value={id} key={id}>
          {text}
        </Option>
      )),
    ],
    [flatTodos],
  );

  const modalContent = useMemo(
    () => (
      <>
        <StyledSelect
          defaultValue={SUPER_PARENT}
          value={parentTodoId}
          onChange={handleParentTodoChange as any}
        >
          {selectOptions}
        </StyledSelect>
        <Input value={todoText} onChange={handleTodoTitleChange} />
        <Button onClick={handleOk}>Создать</Button>
      </>
    ),
    [
      selectOptions,
      parentTodoId,
      handleParentTodoChange,
      handleTodoTitleChange,
      todoText,
      handleOk,
    ],
  );

  return (
    <div>
      {todos.map((todo) => (
        <Todo
          todo={todo}
          todos={todos}
          onDelete={handleDelete}
          onPerform={handlePerform}
          key={todo.id}
        />
      ))}
      <Modal title="Добавить элемент" visible={isOpen} onOk={handleOk} onCancel={onCancel}>
        {modalContent}
      </Modal>
      <Modal
        title="Вы уверены, что хотите удалить элемент"
        visible={deleteOpen}
        onOk={handleDeleteOk}
        onCancel={handleDeleteCancel}
      />
      <Button onClick={handleCreateTodo}>Создать задачку</Button>
    </div>
  );
});

export default Todos;
