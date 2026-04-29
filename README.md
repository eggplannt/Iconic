# Iconic

A React Native app built with Expo and Supabase.

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/go) on your physical device **or** an Android/iOS simulator
- [Supabase CLI](https://supabase.com/docs/guides/cli) — install globally:
  ```bash
  npm install -g supabase
  ```

---

## 1. Clone & install

```bash
git clone https://github.com/your-org/iconic.git
cd iconic
npm install
```

---

## 2. Create a Supabase project

1. Sign in at [app.supabase.com](https://app.supabase.com) and click **New project**.
2. Choose an organisation, give the project a name, set a strong **database password** (save it — you'll need it), and pick a region close to you.
3. Wait for the project to finish provisioning (~1 minute).
4. Open **Settings → API** in the sidebar. You'll find:
   - **Project URL** — looks like `https://xxxxxxxxxxxx.supabase.co`
   - **Publishable** key (`sb_publishable_xx...`) — safe to expose in client code
   - **Secret** key (`sb_secret_xx...`) — keep this secret, never commit it
5. Note your **project ref** — it's the subdomain of the Project URL (e.g. `xxxxxxxxxxxx`).
6. Log in and link the CLI:
   ```bash
   supabase login
   supabase link --project-ref your-project-ref
   ```
7. Push the database schema:
   ```bash
   supabase db push
   ```
8. Deploy the Edge Function:
   ```bash
   supabase functions deploy check-username
   ```
9. Set the secrets the Edge Function needs at runtime.
   ```bash
   supabase secrets set SB_SECRET_KEY=sb_secret_xxxxxxxxxxxxxxxxxxxx
   supabase secrets set SB_PUBLISHABLE_KEY=sb_publishable_xxxxxxxxxxxxxxxxxxxx
   ```

---

## 3. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials.
2. Create an **OAuth 2.0 Client ID** (type: Web application).
3. Under **Authorised redirect URIs**, add:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```
4. Note the client ID and secret (you will not be able to see the client secret after it's been created).

Supabase handles the OAuth callback and redirects back to the app via the `iconic://` and `exp://` schemes configured in `supabase/config.toml`.

---

## 4. Set up environment variables

Copy the example files and fill them in with the values from your Supabase project.

### Root `.env.local`

```bash
cp .env.example .env.local
```

| Variable | Where to find it |
|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | Settings → API → Project URL |
| `EXPO_PUBLIC_SUPABASE_KEY` | Settings → API → Publishable key (`sb_publishable_xx...`) |

### `supabase/.env`

```bash
cp supabase/.env.example supabase/.env
```

| Variable | Description |
|---|---|
| `SUPABASE_URL` | Same Project URL as above |
| `SUPABASE_DB_PASSWORD` | Password you set when creating the project |
| `SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET` | Google OAuth client secret |

> **Never commit** `.env.local` or `supabase/.env` — they are already in `.gitignore`.

---

## 5. Apply the schema & deploy Edge Functions

With your environment variables in place, push the database schema and deploy the Edge Function to your Supabase project.

1. Push all migrations:
   ```bash
   supabase db push
   ```
2. Deploy the `check-username` Edge Function:
   ```bash
   supabase functions deploy check-username
   ```

---

## 6. Run the app

```bash
npx expo start
```

The Metro bundler starts and displays a QR code plus keyboard shortcuts.

| Key | Action |
|---|---|
| `a` | Open in Android emulator |
| `i` | Open in iOS simulator |
| `w` | Open in web browser |

---

## 7. Using Expo Go on a physical device

Expo Go runs your app directly on your phone without a development build or USB cable.

Use the `--tunnel` flag.

Tunneling routes Metro bundler traffic through a secure Expo-managed relay so your phone can route to itself.

1. Install the tunnel package if you haven't already:
   ```bash
   npm install --save-dev @expo/ngrok
   ```
2. Start with the tunnel flag:
   ```bash
   npx expo start --tunnel
   ```
   Expo will print an `exp://` URL and QR code. The URL looks like:
   ```
   exp://xxxx-xxxx.ngrok.io
   ```
3. Scan the QR code — the app loads over the internet tunnel.

---

## Project structure

```
iconic/
├── src/
│   ├── components/      # Reusable UI components
│   ├── contexts/        # React context providers (auth, loading)
│   ├── hooks/           # Custom hooks
│   ├── navigation/      # Tab and stack navigators
│   ├── pages/           # Screen components
│   └── utils/           # Supabase client and types
├── supabase/
│   ├── functions/       # Deno Edge Functions
│   ├── migrations/      # SQL migration files
│   ├── schemas/         # Database schema
│   ├── config.toml      # Supabase local config
│   ├── seed.sql         # Seed data
│   └── .env             # Backend secrets (not committed)
├── .env.local           # Expo public env vars (not committed)
├── .env.example         # Root env template
└── app.json             # Expo app config
```

---

## Available scripts

| Script | Description |
|---|---|
| `npm run start` | Start Metro bundler |
| `npm run android` | Start and open on Android |
| `npm run ios` | Start and open on iOS |
| `npm run web` | Start and open in browser |
| `npm run lint` | Run ESLint |
| `supabase db push` | Push migrations to remote project |
| `supabase functions deploy` | Deploy Edge Functions to remote |
