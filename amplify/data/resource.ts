import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { postConfirmation } from "../auth/post-confirmation/resource";

const schema = a
  .schema({
    UserProfile: a
      .model({
        email: a.string(),
        profileOwner: a.string(),
        todos: a.hasMany("Todo", "userProfileId"),
      })
      .secondaryIndexes((index) => [index("profileOwner")])
      .authorization((allow) => [
        allow.ownerDefinedIn("profileOwner"),
        allow.publicApiKey(),
      ]),
    Todo: a
      .model({
        content: a.string(),
        done: a.boolean(),
        userProfileId: a.id(),
        userProfile: a.belongsTo("UserProfile", "userProfileId"),
      })
      .authorization((allow) => [
        allow.owner(),
        allow.publicApiKey().to(["read"]),
      ]),
  })
  .authorization((a) => a.resource(postConfirmation));

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    apiKeyAuthorizationMode: {
      expiresInDays: 365,
    },
  },
});
