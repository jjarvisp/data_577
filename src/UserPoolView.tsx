import { useEffect, useState } from "react";

import { Schema } from "../amplify/data/resource";

import { client } from "./client";
import { getCurrentUser } from "aws-amplify/auth";
import { Todo } from "./Todo";
import { Heading, Button, View } from "@aws-amplify/ui-react";

export function UserPoolView() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [userProfileId, setUserProfileId] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (userProfileId) {
      client.models.Todo.observeQuery({
        filter: {
          userProfileId: { eq: userProfileId },
        },
        authMode: "apiKey",
      }).subscribe({
        next: (data) => setTodos([...data.items]),
      });
    }
  }, [userProfileId]);

  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();

      const { data } =
        await client.models.UserProfile.listUserProfileByProfileOwner({
          profileOwner: `${user.userId}::${user.username}`,
        });

      if (data?.[0]) {
        setUserProfileId(data[0].id);
      }
    })();
  }, []);

  const createTodo = async () => {
    if (!userProfileId) return;

    await client.models.Todo.create({
      content: crypto.randomUUID(),
      userProfileId,
    });
  };

  function handleDelete(id: string): void {
    client.models.Todo.delete({ id });
    setTodos((prev) => {
      const next = [...prev];

      const idx = prev.findIndex((x) => x.id === id);

      if (idx > -1) {
        next.splice(idx, 1);
      }

      return next;
    });
  }

  function handleUpdate(
    id: string,
    todo: Partial<Schema["Todo"]["type"]>
  ): void {
    client.models.Todo.update({
      ...todo,
      id,
    });

    setTodos((prev) => {
      const next = [...prev];

      const idx = prev.findIndex((x) => x.id === id);

      if (idx > -1) {
        const curr = prev[idx];
        next.splice(idx, 1, { ...curr, ...todo, id });
      }

      return next;
    });
  }

  return (
    <View>
      <View
        display="flex"
        style={{ alignItems: "center", justifyContent: "space-between" }}
      >
        <Heading level={3}>User Pool View</Heading>
        <Button onClick={createTodo}>+ new</Button>
      </View>

      <View>
        {todos.map((todo) => (
          <Todo todo={todo} onUpdate={handleUpdate} onDelete={handleDelete} />
        ))}
      </View>
    </View>
  );
}
