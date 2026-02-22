# Instagram-Post-Unsaving-Script

Instagram on IOS has an option to select all saved posts and unsave them all in one go not on Android. I didn't want to manually select the thousands of posts to unsave them so I searched for some tools online and found a browser extension but it was really slow and used to stop running midway or whenever I switched tabs. So I wanted to write my own script to automate the process.

## Features:
1. Extracts the necessary tokens and values on the fly from the current session itself. So, it doesn't store any user data.
2. The script unsaves one post per 0.5 seconds. It is batchwise since each page contains ~20 posts, so it fetches a batch, unsaves them one by one, then fetches the next batch after a 1 second pause.
3. You can switch tabs or whatever while the script runs. Just don't refresh the page or close the tab until its completed.
4. Since it runs on console, the functions and variables defined are temporary and will get erased upon refreshing.

## Usage:
1. Make sure you are logged in to Instagram on a browser.
2. Open Developer tools and go to console tab.
3. Copy and paste the script and run it. If it gives a warning about not pasting code, just type `allow pasting` and run the script again. Do not refresh until its completed.
4. In case any HTML text gets displayed along with `'Cookie “sessionid” has been rejected for invalid domain.'` (optional: The sessionid error gets displayed in firefox but not in chrome), it means you got logged out. Refresh the page to confirm it.
   Log in again. Check the comment in the script and change the delay accordingly. This is basically Instagram's security measure when we exceed the rate limits, nothing harmful to your account.
