# Instagram-Post-Unsaving-Script

Instagram on IOS has an option to select all saved posts and unsave them all in one go but not on Android. I didn't want to manually select the thousands of posts to unsave them so I searched for some tools online and found a browser extension but it was really slow and used to stop running midway or whenever I switched tabs. So I wanted to write my own script to automate the process.

## Features:
1. Extracts the necessary tokens and values on the fly from the current session itself. So, it doesn't store any user data.
2. The script unsaves one post per 20 ms. It is batchwise since each page contains ~21 posts, so it fetches a batch, unsaves them one by one, then fetches the next batch after a 70ms pause.
3. You can switch tabs or whatever while the script runs. Just don't refresh the page or close the tab until its completed.
4. Since it runs on console, the functions and variables defined are temporary and will get erased upon refreshing.
5. There's an optional script which will tell you how many unsaved posts you have. This will take a while (roughly counts 361.8 posts per minute). This doesn't hit the rate limit so no worries here.
   > Wrote this to get total number of posts because just fetching using `fetch('/api/v1/feed/saved/posts/', {headers}).then(r=> r.json()).then(console.log)` returns only 21.
   > This is because Instagram follows pagination with 21 posts visible at one time in a page.
   
6. Insights gained by running this script on my own account:
>   1) I hit the rate limit at 3423rd post at 39 mins 40 seconds. I didn't get logged out and my account didn't get banned or anything of the sort.
>   2) The script stopped running because hitting the limit gave an error. I've added a function to automate the handling of this error: uses a cooldown of 3 minutes before retrying the failed request
>      (should work but haven't tested it by myself)
>   4) I tried again after 3 or 4 minutes at max. Unsaved 3210 posts successfully at one go without hitting rate limit. My wild guess is for the delays currently set, the rate limit is ~3423rd
>      post?

## Usage:
1. Make sure you are logged in to Instagram on a browser.
2. Open Developer tools and go to console tab.
3. Do not refresh the page until all your posts are unsaved. If you refresh by mistake or need to in case of getting disconnected from internet, follow the steps 4-7 in order again.
4. Copy, paste the **prerequisite.js** code first and run it. If it gives a warning about not pasting code, just type `allow pasting` and run it again.
5. Then, if you want to check how many posts you have saved, copy paste the **optional.js** code and run it. As mentioned above, it will take a while.
6. Copy, paste the **script.js** code and run it. 
7. In case any HTML text gets displayed along with `'Cookie “sessionid” has been rejected for invalid domain.'` (optional: The sessionid error gets displayed in firefox but not in chrome), it means you got logged out. Refresh the page to confirm it.
   Log in again. Check the comment in the script and change the delay accordingly. This is basically Instagram's security measure when we exceed the rate limits, nothing harmful to your account.

## Issues (if any):
If the script fails for any reason, do raise an issue. Appreciated!
