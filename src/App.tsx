import { Authenticator } from "@aws-amplify/ui-react";

import "@aws-amplify/ui-react/styles.css";

import { signOut } from "aws-amplify/auth";
import { UserPoolView } from "./UserPoolView";
import { ApiKeyView } from "./ApiKeyView";

function SignOutButton() {
  return (
    <button
      onClick={() => signOut()}
      style={{ position: "fixed", bottom: 5, left: 5 }}
    >
      SIGN OUT
    </button>
  );
}

function App() {
  return (
    <Authenticator.Provider>
      <Authenticator>
        <SignOutButton />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "49vw 0.5vw 49vw",
            width: "100%",
          }}
        >
          <div style={{ padding: "2rem 4rem" }}>
            <UserPoolView />
          </div>
          <div style={{ height: "100vh", backgroundColor: "black" }} />
          <div style={{ padding: "2rem 4rem" }}>
            <ApiKeyView />
          </div>
        </div>
      </Authenticator>
    </Authenticator.Provider>
  );
}

export default App;
