import { Button, CheckboxField, Text } from "@aws-amplify/ui-react";

import { Schema } from "../amplify/data/resource";

interface TodoProps {
  todo: Schema["Todo"]["type"];
  onUpdate?: (id: string, todo: Partial<Schema["Todo"]["type"]>) => void;
  onDelete?: (id: string) => void;
}

export function Todo({ todo, onUpdate, onDelete }: TodoProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        border: "1px solid black",
        padding: "1rem 2rem",
        margin: "1rem 0",
        borderRadius: "4px",
      }}
    >
      {onUpdate && (
        <CheckboxField
          labelHidden
          name={todo.id}
          label="Done"
          checked={!!todo.done}
          onChange={() => onUpdate(todo.id, { ...todo, done: !todo.done })}
        />
      )}
      <Text textAlign="center" flex="1">
        {todo.content}
      </Text>
      {onDelete && <Button onClick={() => onDelete(todo.id)}>X</Button>}
    </div>
  );
}
