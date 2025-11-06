# Stoics Educational Services

This is a NextJS application scaffolded by Firebase Studio.

To get started with local development, run `npm run dev` and navigate to `http://localhost:9002`.

---

## How to Deploy Your Application

Your application is configured for **Firebase App Hosting**. The easiest way to deploy it is by connecting your GitHub repository to your Firebase project. This will set up an automated pipeline that deploys your app whenever you push changes.

### Step 1: Push Your Code to a GitHub Repository

If you haven't already, make sure your project code is in a GitHub repository.

### Step 2: Navigate to Firebase App Hosting

1.  Open the [Firebase Console](https://console.firebase.google.com/).
2.  Select your project (Project ID: **studio-2826447618-94555**).
3.  In the left-hand navigation menu, under the **Build** section, click on **App Hosting**.

### Step 3: Connect Your GitHub Repository

1.  You will be guided through connecting your GitHub account and selecting the repository for this project.
2.  Authorize the Firebase App Hosting GitHub App to access your repository.
3.  Select the repository that contains your application code.

### Step 4: Configure Your Backend

1.  When prompted, you will be asked to configure your backend's **region**. Choose a region that is closest to your users.
2.  Firebase will automatically detect that your project is a Next.js app and will use the existing `apphosting.yaml` file for the deployment configuration.

### Step 5: Deploy!

1.  After you've configured the backend, App Hosting will create a "live" branch deployment based on your default branch (e.g., `main` or `master`).
2.  The first deployment will start automatically. You can monitor the progress directly in the Firebase console.
3.  Once the deployment is complete, your site will be live! Any future pushes to your connected branch will automatically trigger a new deployment.

That's it! You will have a fully functional, deployed web application with automated CI/CD.
