# Good Joe: Exact Production Setup Steps

Follow the steps in order. This is deliberately broken into small pieces. You do **not** need to send me passwords, API keys, database URLs, or phone numbers.

> **For your existing Good Joe project, the MySQL service is named `mysql-volume`.** Wherever this guide refers to the database connection, use the exact reference `${{mysql-volume.MYSQL_URL}}`.

> **Do not click Deploy or push anything from GitHub yet.** The current live Good Joe site stays untouched while you add the private database and secrets below.

---

## Part A — Add the private database in Railway

### Step 1 — Open the correct Railway project

1. Open [Railway](https://railway.com/) in **your own browser** and sign in.
2. From the dashboard, click the project that contains the currently live Good Joe website. It is the project whose service is connected to `rodiggedy1/joes` or contains the domain `joes-production.up.railway.app`.
3. You should now see the project **Canvas**, with at least one box representing the current website service.

### Step 2 — Create the MySQL service

1. On the Canvas, click the **+ New** button. If you do not see it, right-click an empty area of the Canvas instead.
2. Choose **Database**.
3. Choose **MySQL**.
4. Railway will add a new `MySQL` service box and begin provisioning it. Do not change any of the database settings.
5. Wait until the MySQL service shows as healthy/online. This normally means there is no loading spinner or failed-deployment indicator on the MySQL service box.

> Leave this database **private**. The website service and database live inside the same Railway project, so they can communicate internally. Do not enable Public Networking for the database.

### Step 3 — Check the database service name

1. Look at the name printed on the new database service box.
2. If it says exactly **MySQL**, you are done with this step.
3. If it says anything else, write down that exact service name. You will use it in the next part instead of `MySQL`.

Railway’s MySQL service provides a `MYSQL_URL` connection variable for use by services in the same project. [1]

---

## Part B — Add the two variables needed for immediate booking accounts

### Step 4 — Open the Good Joe website service

1. Click the existing service box that serves `joes-production.up.railway.app`. This is **not** the new MySQL box.
2. In that service’s left-side or top navigation, click **Variables**.
3. You are in the right place if you see a list of variable names and an **Add Variable**, **New Variable**, or **Raw Editor** control.

### Step 5 — Add `DATABASE_URL`

1. Click **Add Variable**.
2. In the **Name** field, enter exactly:

   ```text
   DATABASE_URL
   ```

3. In the **Value** field, enter exactly:

   ```text
   ${{mysql-volume.MYSQL_URL}}
   ```

4. Your Good Joe database service is named `mysql-volume`, so leave the value exactly as written above. If that service is ever renamed, replace only the first word with the new service name. For example, if its service name became `goodjoe-db`, enter:

   ```text
   ${{goodjoe-db.MYSQL_URL}}
   ```

5. Click **Add**, **Save**, or the equivalent confirmation button.

If Railway offers an **Add Reference** option instead of typing the value, choose the new MySQL service, then choose its `MYSQL_URL` variable. That produces the same private connection reference. Railway documents this service-to-service variable pattern for application database connections. [1] [2]

### Step 6 — Add `JWT_SECRET`

This is the server-only secret that keeps each customer’s browser account private. Treat it like a password. Do not reuse your Railway password, do not put it in GitHub, and do not send it to me.

1. Open your password manager and use its password generator.
2. Generate a new random password/secret with **at least 64 characters**. A mix of letters, numbers, and symbols is fine.
3. Copy the generated secret.
4. Back in Railway’s Good Joe web service **Variables** page, click **Add Variable** again.
5. In the **Name** field, enter exactly:

   ```text
   JWT_SECRET
   ```

6. Paste the newly generated secret into **Value**.
7. Click **Add** or **Save**.

### Step 7 — Stop and confirm the first setup milestone

Your Good Joe web service Variables list should now contain these names:

| Required variable | The value should look like |
|---|---|
| `DATABASE_URL` | A Railway variable reference, not a long manually pasted database password. |
| `JWT_SECRET` | A long random secret. Railway may hide most of the characters after saving. |

At this point, **do not deploy**. Reply here only:

```text
MySQL and the first two variables are ready
```

If the database service was not named `MySQL`, add its name after that sentence. Do not send values.

---

## Part B.1 — Add the safe release checks in Railway

Complete these two settings before the first portal deployment. They do **not** deploy the site themselves; they instruct Railway what to check whenever the next GitHub deployment happens.

### Step 7.1 — Configure the database migration command

1. Stay in the existing Good Joe **web service** in Railway, not `mysql-volume`.
2. Click **Settings**.
3. Find the **Deploy** section. Depending on the Railway layout, it may say **Build & Deploy**.
4. Find the field labelled **Pre-Deploy Command**.
5. Enter exactly:

   ```text
   pnpm db:migrate
   ```

6. If a **Pre-Deploy Timeout** field appears, enter:

   ```text
   120
   ```

7. Click **Save** or allow Railway to stage the change. Do **not** click a button that deploys yet.

This migration command runs after the application is built and before the new release receives traffic. It has access to the same private-network database connection. If it fails, Railway stops that deployment instead of releasing a version with missing tables. [6]

### Step 7.2 — Configure the deployment healthcheck

1. Still in the Good Joe web service **Settings → Deploy** area, find **Healthcheck Path**.
2. Enter exactly:

   ```text
   /health
   ```

3. Set the **Healthcheck Timeout** to:

   ```text
   120
   ```

4. Save the staged setting. Again, do **not** deploy yet.

The Good Joe app now includes `/health`. It returns HTTP 200 only after the service is running **and** the private MySQL database accepts a simple readiness query. Railway will keep the existing live version active if the new version does not return 200. [7]

When Steps 7.1 and 7.2 are saved, reply:

```text
Migration and healthcheck are ready
```

---

## Part C — Prepare OpenPhone/Quo for later SMS recovery

Do this after Part B. SMS will **not** interrupt a customer’s booking. It is for returning customers who use a new device and for dedicated staff access to Operations.

> OpenPhone is now named **Quo** in its current API documentation. [3]

### Step 8 — Generate a dedicated Quo API key

1. Open your Quo/OpenPhone workspace in your own browser.
2. Open **Workspace Settings**.
3. Click the **API** tab.
4. Click **Generate API key**.
5. Give it this label:

   ```text
   good-joe-production
   ```

6. Copy the key immediately and keep it private. Quo indicates that creating API keys requires a workspace Owner or Admin role. [4]

### Step 9 — Confirm Quo is ready to send US texts

Before any customer text is sent, confirm in Quo that:

1. Your Quo subscription is active.
2. Your workspace has completed **US carrier registration**.
3. Your workspace has API messaging credits.

Quo lists all three as requirements for programmatic SMS to US numbers. [4] [5]

### Step 10 — Add the Quo values to Railway

Return to the Good Joe website service’s **Variables** page. Add these three variables one at a time:

| Variable name | What to enter in the Value field |
|---|---|
| `QUO_API_KEY` | Paste the new `good-joe-production` API key. |
| `QUO_FROM_NUMBER` | Your real Good Joe Quo telephone number in international form, e.g. `+14155550123`. |
| `STAFF_ADMIN_PHONES` | The Good Joe staff mobile number(s) allowed to enter Operations, in international format, separated with commas. Example: `+14155550123,+13105550199` |

Do **not** put any customer numbers in `STAFF_ADMIN_PHONES`. Do not send any of these values to me.

### Step 11 — Stop and tell me only this

When Parts A–C are finished, reply:

```text
MySQL and all five variables are ready
```

I will then prepare the production code to use those values, show you what will be committed, and ask before the GitHub push triggers Railway’s deployment.

---

## If you get stuck

| What you see | What to do |
|---|---|
| You cannot find `+ New` | Right-click empty space on the Railway Canvas, then choose **Database → MySQL**. |
| You cannot find `MYSQL_URL` | Click the new MySQL service, open **Variables**, and look for `MYSQL_URL`. Do not expose the database publicly. |
| Railway rejects `${{MySQL.MYSQL_URL}}` | Recheck the MySQL service’s exact name and replace only `MySQL` with that name. |
| You cannot find Quo’s API tab | Verify you are a Quo workspace Owner or Admin; Quo restricts API-key creation to those roles. [4] |
| You are unsure if a value is secret | Do not paste it here. Tell me only the variable name that is causing trouble. |

## References

[1]: https://docs.railway.com/databases/mysql "Railway: MySQL"
[2]: https://docs.railway.com/guides/express "Railway: Deploy an Express App"
[3]: https://www.quo.com/ "Quo (formerly OpenPhone)"
[4]: https://www.quo.com/docs/mdx/api-reference/authentication "Quo API: Authentication"
[5]: https://support.quo.com/core-concepts/integrations/api "Quo API: APIs"
[6]: https://docs.railway.com/deployments/pre-deploy-command "Railway: Pre-Deploy Command"
[7]: https://docs.railway.com/deployments/healthchecks "Railway: Healthchecks"
