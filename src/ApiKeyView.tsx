import { useEffect, useState } from "react";

import { Schema } from "../amplify/data/resource";

import { client } from "./client";
import { getCurrentUser } from "aws-amplify/auth";
import { Heading, Message, View } from "@aws-amplify/ui-react";
import { Todo } from "./Todo";

export function ApiKeyView() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [userProfileId, setUserProfileId] = useState<string | undefined>(
    undefined
  );

  const [userProfiles, setUserProfiles] = useState<
    Schema["UserProfile"]["type"][]
  >([]);

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

  useEffect(() => {
    client.models.UserProfile.observeQuery({ authMode: "apiKey" }).subscribe({
      next: (data) => setUserProfiles([...data.items]),
    });
  }, []);

  return (
    <div>
      <Heading level={3}>API Key View</Heading>
      <ol>
        {todos.map((todo) => (
          <Todo todo={todo} />
        ))}
      </ol>

      <View>
        {userProfiles.map((userProfile) => (
          <Message
            style={{
              cursor: "pointer",
              outline:
                userProfileId === userProfile.id
                  ? "1px solid black"
                  : undefined,
            }}
            onClick={() => setUserProfileId(userProfile.id)}
            key={userProfile.id}
          >
            <pre>{JSON.stringify(userProfile, null, 2)}</pre>
          </Message>
        ))}
      </View>
    </div>
  );
}
