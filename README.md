# Welcome to your Convex functions directory!

Write your Convex functions here.
See https://docs.convex.dev/functions for more.

A query function that takes two arguments looks like:

```ts
// convex/myFunctions.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

export const myQueryFunction = query({
  // Validators for arguments.
  args: {
    first: v.number(),
    second: v.string(),
  },

  // Function implementation.
  handler: async (ctx, args) => {
    // Read the database as many times as you need here.
    // See https://docs.convex.dev/database/reading-data.
    const documents = await ctx.db.query("tablename").collect();

    // Arguments passed from the client are properties of the args object.
    console.log(args.first, args.second);

    // Write arbitrary JavaScript here: filter, aggregate, build derived data,
    // remove non-public properties, or create new objects.
    return documents;
  },
});
```

Using this query function in a React component looks like:

```ts
const data = useQuery(api.myFunctions.myQueryFunction, {
  first: 10,
  second: "hello",
});
```

A mutation function looks like:

```ts
// convex/myFunctions.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const myMutationFunction = mutation({
  // Validators for arguments.
  args: {
    first: v.string(),
    second: v.string(),
  },

  // Function implementation.
  handler: async (ctx, args) => {
    // Insert or modify documents in the database here.
    // Mutations can also read from the database like queries.
    // See https://docs.convex.dev/database/writing-data.
    const message = { body: args.first, author: args.second };
    const id = await ctx.db.insert("messages", message);

    // Optionally, return a value from your mutation.
    return await ctx.db.get(id);
  },
});
```

Using this mutation function in a React component looks like:

```ts
const mutation = useMutation(api.myFunctions.myMutationFunction);
function handleButtonPress() {
  // fire and forget, the most common way to use mutations
  mutation({ first: "Hello!", second: "me" });
  // OR
  // use the result once the mutation has completed
  mutation({ first: "Hello!", second: "me" }).then((result) =>
    console.log(result),
  );
}
```

Use the Convex CLI to push your functions to a deployment. See everything
the Convex CLI can do by running `npx convex -h` in your project root
directory. To learn more, launch the docs with `npx convex docs`.


Stage 3b — Advanced Todo App (Expo + Convex)

Pixel-perfect React Native (Expo) Todo app with light/dark theme, realtime CRUD via Convex, search, and drag-to-reorder.

Demo Flow (what your video should show)

Toggle theme (light ↔ dark)

Create a todo → appears instantly (realtime)

Search/filter

Edit a todo

Toggle complete/incomplete

Long-press + drag to reorder (persists)

Delete

Close & reopen app → theme persists

Tech Stack

Expo (React Native + TypeScript, expo-router)

Convex (realtime backend)

styled-components (theming)

AsyncStorage (theme persistence)

react-native-gesture-handler + react-native-draggable-flatlist (drag to sort)

Prerequisites

Node 18+

Expo CLI: npm i -g expo (optional)

Convex CLI: npm i -g convex

Android: Expo Go app on your phone (or use web/emulator)

1) Setup
# clone your repo
npm install

# Convex (in a second terminal; keeps running)
npx convex dev
# First run will prompt to create/select a project and will generate the convex/ folder.

# .env (project root)
# use the exact URL printed by convex dev or shown in the Convex dashboard
EXPO_PUBLIC_CONVEX_URL=https://fastidious-parakeet-585.convex.cloud

# Start Expo (development)
npx expo start
# Scan QR with Expo Go on your phone (same Wi-Fi)


If you previously used --offline for Expo, now start normally so the app can talk to Convex.

2) Project Structure
app/
  _layout.tsx         # Providers (Theme, Convex, SafeArea, Router Stack)
  index.tsx           # Home (header gradient, search, list, drag/sort)
  new.tsx             # Create todo
  edit/[id].tsx       # Edit todo
components/
  ThemeToggle.tsx
  TodoItem.tsx
convex/
  schema.ts
  todos.ts
  _generated/         # auto-generated (do not edit)
lib/
  theme.ts            # light/dark themes, tokens
  storage.ts          # AsyncStorage helpers for theme persistence
index.ts              # expo-router entry
babel.config.js       # minimal: `presets: ['babel-preset-expo']`
.env                  # EXPO_PUBLIC_CONVEX_URL=...

3) Environment Variables

Create .env in the project root:

EXPO_PUBLIC_CONVEX_URL=https://fastidious-parakeet-585.convex.cloud


Must start with EXPO_PUBLIC_ to be visible in the app.

Keep npx convex dev running while you develop.

4) Scripts
npm run dev     # alias: expo start

5) Features Checklist (Acceptance Criteria)

 Pixel-perfect layout per Figma (spacing, radius, colors)

 Light/Dark theme with smooth UI + persistence (AsyncStorage)

 Create/Read/Update/Delete todos via Convex (realtime)

 Search & filter

 Drag to reorder (persisted to backend)

 Empty/loading states

 Error handling (basic alerts)

 Accessibility labels and good contrast

 Responsive on common phone sizes

6) Build APK (EAS)
npm i -g eas-cli
eas login                 # if prompted
eas build:configure       # one-time
eas build -p android --profile preview


When the build finishes, download the .apk from the EAS dashboard link.

Include the APK + your demo video in Google Drive as required.

7) Troubleshooting

Red screen: “ThemeProvider: useTheme hook is outside <ThemeProvider>”
→ Your app/_layout.tsx must wrap screens like:

<ThemeProvider theme={theme}>
  <SafeAreaProvider>
    <Stack> ... </Stack>
  </SafeAreaProvider>
</ThemeProvider>


Convex types / api import errors

Ensure npx convex dev is running (it generates convex/_generated/**)

Confirm .env has the correct EXPO_PUBLIC_CONVEX_URL

Restart Expo: npx expo start -c

Missing module errors
Run the suggested Expo install, e.g.:

npx expo install @react-native-async-storage/async-storage react-native-gesture-handler expo-linear-gradient
npx expo install @expo/vector-icons react-native-safe-area-context react-native-screens


Emulator / ADB errors

Ignore if you’re using Expo Go on your phone. Those messages are only about launching the emulator.

8) Notes for Reviewers

Realtime: list updates instantly after create/update/delete; order persists after drag.

Theme: toggler lives in header; preference is stored and restored across app restarts.

Accessibility: buttons/inputs have accessibilityLabel; colors meet contrast targets for both themes.

9) Convex Schema & Functions (summary)
// convex/schema.ts
todos: { title, description?, dueDate?, completed, order, createdAt }

10) ## APK Download
https://expo.dev/accounts/xanderkira/projects/todo-app/builds/f4c9b9bf-fcfa-4685-a5b8-f82755c2c3e3

## Backend (Convex)
EXPO_PUBLIC_CONVEX_URL=https://fastidious-parakeet-585.convex.cloud/


Queries & mutations in convex/todos.ts:

list (ordered by order)

get

create

update

toggle

remove

reorder (persist list order)

10) How to Use (Quick)

+ New → create todo

Tap circle → toggle done

Pencil → edit

Trash → delete

Long-press card → drag to reorder

Search → filter list

Theme → light/dark, persists
