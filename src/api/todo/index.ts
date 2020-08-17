export interface TodoI {
  id: string;
  text: string;
  isPerform: boolean;
  todos: TodoI[];
  level: number;
}
