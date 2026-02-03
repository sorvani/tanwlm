# Deploying to Fedora Linux with Git

Since your server supports Node.js 22.x, the best workflow is to push your code to GitHub and then pull/build it on the server.

## 1. Prepare Your Repository (Locally)

1.  **Initialize Git**:
    ```powershell
    # existing repo root
    git init
    git add .
    git commit -m "Initial commit"
    ```
2.  **Push to GitHub**:
    - Create a new repository on GitHub.
    - Follow the instructions to push your existing code:
      ```powershell
      git remote add origin https://github.com/your-username/your-repo.git
      git push -u origin main
      ```

> [!NOTE]
> **Data Handling**: I have configured the app to use `data.seed.json`.
> - The live `web/data/data.json` file is **ignored** by Git.
> - On the first run, the app will create `data.json` from the seed.
> - This means your server will have its own persistent data that won't be overwritten when you `git pull`.

## 2. Setup on Fedora Server

Connect to your server via SSH:

2.  **Setup User & Directory**:
    
    It is best practice to run the application as a dedicated user (similar to `nodebb`).

    ```bash
    # Create a system user for the app with a home directory (needed for SSH keys)
    sudo useradd -m -r -s /bin/bash landmines

    # Create the directory
    sudo mkdir -p /opt/landmines

    # Set ownership
    sudo chown -R landmines:landmines /opt/landmines
    ```

3.  **Authentication (Deploy Key)**:
    Since this is a likely a private repository (or you want to avoid entering passwords), use an SSH Deploy Key.

    ```bash
    # 1. Switch to the landmines user
    sudo su - landmines

    # 2. Generate an SSH key (press Enter for all prompts to leave default)
    ssh-keygen -t ed25519 -C "landmines-deploy"

    # 3. Print the public key
    cat ~/.ssh/id_ed25519.pub
    ```
    
    *   Go to your GitHub Repository -> **Settings** -> **Deploy keys**.
    *   Click **Add deploy key**.
    *   Paste the key you just printed.
    *   Give it a name (e.g., "Fedora Server").
    *   **Important**: If you plan to have the server push changes back to the repo (e.g. user edits), check **Allow write access**.

4.  **Clone the Repository**:
    Now clone using the **SSH URL**, not HTTPS.

    ```bash
    # Still as 'landmines' user
    # NOTE: Use the SSH URL (git@github.com:...)
    # We clone into current directory (.) if empty, or specify /opt/landmines if needed
    git clone git@github.com:sorvani/tanwlm.git /opt/landmines
    
    cd /opt/landmines
    ```

2.  **Install & Build**:
    ```bash
    # Install dependencies
    npm install
    
    # Build the application
    npm run build
    ```

3.  **Start the Server**:
    Since we are using `output: 'standalone'`, we run the generated server file directly.

    ```bash
    # Simple start (for testing)
    node .next/standalone/server.js
    
    # OR with PM2 (Recommended for production)
    pm2 start .next/standalone/server.js --name "landmines"
    pm2 save
    ```
    *The app will run on port 3000.*

4.  **Firewall Setup**:
    
    If you want to access the app directly on port 3000 (for testing):
    ```bash
    sudo firewall-cmd --permanent --add-port=3000/tcp
    sudo firewall-cmd --reload
    ```
    
    *If you proceed to set up Nginx (recommended for production), you can close port 3000 later and only open HTTP/HTTPS.*

## 3. Updating the App

When you make changes locally and push them:
```bash
# On Server:
cd /opt/landmines
git pull
npm install  # only if dependencies changed
npm run build
pm2 restart landmines
```

## 4. Expose to Web (Nginx)

Add a new block to your Nginx config:

```nginx
server {
    listen 80;
    server_name landmines.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
