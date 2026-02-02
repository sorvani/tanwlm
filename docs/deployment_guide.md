# Deploying to Fedora Linux with Git

Since your server supports Node.js 22.x, the best workflow is to push your code to GitHub and then pull/build it on the server.

## 1. Prepare Your Repository (Locally)

1.  **Initialize Git**:
    ```powershell
    cd web
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

1.  **Clone the Repository**:
    ```bash
    # Go to your desired directory
    cd /opt/
    
    # Clone (replace with your repo URL)
    git clone https://github.com/your-username/your-repo.git landmines
    cd landmines
    ```

2.  **Install & Build**:
    ```bash
    # Install dependencies
    npm install
    
    # Build the application
    npm run build
    ```

3.  **Start the Server**:
    ```bash
    # Simple start
    npm start
    
    # OR with PM2 (Recommended)
    pm2 start npm --name "landmines" -- start
    pm2 save
    ```
    *The app will run on port 3000.*

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
