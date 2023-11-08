---
layout: post
title:  "Halloween Prank"
---

A week before Halloween I had a funny idea to prank my husband, Justin. I'd write a Python script to replace common words on websites with something funny. Using [steganography](https://www.techtarget.com/searchsecurity/definition/steganography) I'd embed my script in an image, which I'd send to Justin. The script would somehow be extracted from the image. Then the script would run on Halloween. :jack_o_lantern:

This would have been a cool project, but it felt far too complex for my current skillset. I opted to cut out the steganography piece and go ahead with writing a basic Python script. The script would play a sound every time Justin clicked on anything. This project also presented an opportunity to experiment with shell scripting and cronjobs.

## Tech choices
- Shell scripts
- Python 
- Pynput library
- Playsound library
- [yes.wav](https://freesound.org/s/364948/) file created by user balloonhead on [freesound.org](https://freesound.org/)
- Garageband, to edit the audio file

Here's a short list of my criteria for this project.

1. Use Python
2. Complete in time for Halloween
3. The script will alter some common task in a hilarious way
4. Only execute on Halloween

### Why these criteria?

- I'm learning Python and I needed an interesting, hands-on project.
- I set the deadline of Halloween because I work best with a deadline.
- I couldn't stop giggling at the thought of how confused Justin would be. 😆
- It's a Halloween prank, and it would be annoying to have this running all the time.

## Building my Halloween Prank Project

### Step 1: Learn how to play a sound file when a mouse click occurs

I did a quick Google search to find Python libraries that would play a sound file. I found many posts on StackOverflow citing a library called [Pynput](https://pypi.org/project/pynput/). The Pynput library has decent [documentation](https://pynput.readthedocs.io/en/latest/), so it was relatively easy to get started.

I ran into some issues with playing the sound file itself which I’ll explain in greater detail [later on in the post](#snags). I decided to use the [Playsound](https://pypi.org/project/playsound/) library because the syntax was simple, and it did what I needed it to do.

### Step 2: Find the right sound file

I chose the sound file linked above, which I found on [freesound.org](https://freesound.org). It was funny (imo) and it provided a variety of “yes” sounds. I could vary the sounds that played each time providing another learning opportunity.

I needed a way to split the single file into separate sound files. I had Garageband already and it didn't seem too complicated. I imported the sound file, and cut the file between the “yes” sounds. I moved each sound to a separate track and then saved them one at a time, muting the other tracks before exporting.

### Step 3: Cycle through a list of sound files

The first hiccup I encountered was one of macOS permissions. To use the Pynput library you have to grant the terminal app permission to monitor input. I also encountered an issue with the sound playing twice with each click. I'll describe both issues [later in the post](#snags). Thankfully I was able to resolve both issues.

I wasn't sure how to get the script to cycle through a list of sound files but I knew it was possible. I found some basic information on [w3schools.com](http://w3schools.com) about looping through lists, but struggled to apply this with the Playsound library. I wrote some basic code based on what I found, and asked ChatGPT for feedback. It spit out the following:

```
from pynput import mouse
from playsound import playsound

# Initialize your variables
sounds = ["sound1.mp3", "sound2.mp3", "sound3.mp3"]
i = 0  # Index counter

def on_click(x, y, button, pressed):
    global i  # We need this to modify the global variable i
    if pressed:
        current_sound_path = sounds[i % len(sounds)]
        playsound(current_sound_path)
        i += 1  # Increment index counter

# Listen for mouse events
with mouse.Listener(on_click=on_click) as listener:
    listener.join()
```

Once the script was looping through the sound files I realized I needed a way to exit the script. I added a method called `on_key_press` to exit the script with a press of the esc key.

### Step 4: Write the shell script

I wanted the Python script to run only on Halloween, so I decided to use a shell script with a cronjob.

I wrote the shell script and tested it on a different MacBook. It was at this point I realized that I wouldn't be able to con Justin into downloading everything. There were just too many files. Also, I needed to change system permissions and create a folder to store everything.

The shell script began to grow so I decided to divide the shell script into two scripts. One [script](https://github.com/stephburton/happy-halloweener/blob/main/yes_setup.sh) to run the set up tasks, and [the other](https://github.com/stephburton/happy-halloweener/blob/main/yes_script.sh) to run the script from the cronjob.

### Step 5: Test the cronjob

I tested the cronjob on two separate MacBooks to ensure it would work on Justin's. I’ve never set up a cronjob before and I ran into many issues ([detailed later on in the post](#snags)). I also learned a ton in the process.

In the end I did not end up running the script from a cronjob. I managed to make it work, but running the script from a cronjob seemed unnecessary because it wasn't ready to install before Halloween.

### Step 6: Install and run the script on my husband’s MacBook

I wanted to find an elaborate way to get this script onto Justin’s machine, but I decided to simply Airdrop the setup script to Justin's MacBook.

When I finally had the chance to install the script, I knew I would have to act fast. I included [`curl` commands](https://github.com/stephburton/happy-halloweener/blob/main/yes_setup.sh#L48-L59) in the shell script to download the necessary files and eliminate the extra steps.

## Final results

Everything was ready to go by the end of the day on October 30th. However Justin was home so I did not get the chance to install anything on his MacBook. In fact, I did not get another opportunity until November 2nd.

Once I was alone with Justin's MacBook [^1], I Airdropped the [yes_setup.sh](https://github.com/stephburton/happy-halloweener/blob/main/yes_setup.sh) file. Then I made it executable with `chmod +x filename`, and adjusted the Terminal app's permissions in System Settings. I held my breath as I tested the script. It ran flawlessly!

I closed the Terminal app on his MacBook with the script still running in the background. I closed Justin's MacBook and put it back in the same place he had left it, and waited.

If you want to see his exact reaction, take a look at [this Instagram post](https://www.instagram.com/reel/CzJbwtxglS_/?utm_source=ig_web_copy_link&igshid=MzRlODBiNWFlZA==). He was really great about it and was even impressed by what I built.

It was a lot of effort for a brief reaction but I learned so much along the way. 10 / 10, would build again!

## Conclusion

To summarize, here are my takeaways:

- Never assume environmental variables will be consistent across devices. I already knew this from my previous job, but experiencing how this assumption creates issues cemented this for me.
- Be aware of the versions and locations of files used by crontab. It may differ from that of your terminal configuration file.
- macOS is way more secure than I thought! This information won't affect my degree of caution, but it was good to see the way unknown code is handled.
- Before deciding on a programming language, think about whether the tasks will be performed on the client-side or server-side.

When I started this project it was just a funny idea for a prank. I didn’t have the skills but jumped in with both feet anyway. Because I didn’t stop to consider what I was taking on, this prank turned into a project. In the end I’m glad I jumped in because it pushed me to learn about things I would have shied away from, otherwise.

Never be afraid to take on something big, as long as your deadline allows for it. Keep your end goal in mind, and don’t be afraid to pivot when necessary.

<hr>

## <a name="snags"></a>Snags

### Problem 1: Selecting a Python library to play the sound files

#### The Problem

Before settling on the Playsound library, I tried to use the subprocess module. Unfortunately I forgot to take notes as I worked through the subprocess issues. However I did find this in my Google search history: “*macOS terminal error error: failure setting terminal attributes: Input/output error*”

I think this was the error message I was getting while trying to use the subprocess module. Based on my Google searches it appears I was trying to use `subprocess.Popen` which was resulting in errors like the one from my Google search, above.

#### The Solution

My Google searches weren't given me the information I was looking for, so I asked ChatGPT for beginner-friendly Python libraries to play sounds. This is how I initially learned about the Playsound library.

### Problem 2: Sound plays twice on click

#### The Problem

I did not know that Pynput treats the mouse press and release as two separate events. 😅

#### The Solution

After a lot of Googling and asking ChatGPT for help, the [solution](https://github.com/stephburton/happy-halloweener/blob/main/yess_click.py#L39-L40) was to specify what action the listener should take if pressed, in the `on_click` method.

### Problem 3: Navigating macOS permissions

#### The Problem

macOS includes security features to prevent the execution of code from unknown sources. This meant I couldn't simply write a script, install it, and expect it to run without further intervention.

Similarly using a library like Pynput, which requires permission to monitor input, requires access be manually enabled from within the System Settings.

#### The Solution

I could change permissions on subsequent scripts using the setup script, but the setup script itself required manual attention to run. Once I Airdropped the setup script, I had to change it's permissions from the terminal. Then I enabled permission for the Terminal app to monitor input.

### Problem 4: Cronjob won't use the same version of Python as the Terminal configuration file

#### The Problem

I could not get the cronjob to run. Here's a short list of everything I tried:

- I double-checked the syntax and the file location. Everything looked good.
- I ran a test cronjob, adding `* * * * *  /tmp/cron_test.txt` to the crontab file. That worked so obviously I was able to run cronjobs.
- ChatGPT suggested I add the following line to the crontab file: `27 13 * * * /Users/username/happy_halloween/yes_script.sh >> /Users/username/happy_halloween/output.log 2>> /Users/username/happy_halloween/error.log`.
  - The log file contained this error: `ModuleNotFoundError: No module named 'pynput'`. Pynput was installed so this was odd.

#### The Solution

I verified that the correct location and version of Python were specified in the .zshrc file. Then I added a [profile check](https://github.com/stephburton/happy-halloweener/blob/main/yes_script.sh#L3-L15) in the script and ran the cronjob again. It still failed but this time for other reasons (see Problem 5).

### Problem 5: Sound files cannot be found

#### The Problem

The new error message indicated the sound files couldn't be found. The sound files were in the same location as the script, so I was super confused.

#### The Solution

I asked ChatGPT for help and it suggested dynamically providing the absolute paths using the os library. The following code was added to my Python script:

```
import os

current_directory = os.path.dirname(os.path.abspath(__file__))

class soundManager():
    sounds = [os.path.join(current_directory, 'yes1.mp3'),
              os.path.join(current_directory, 'yes2.mp3'),
              os.path.join(current_directory, 'yes3.mp3')]
```

I attempted the cronjob again and this time it actually worked! 🎉

---
> [^1]: I feel like it’s really important for me to mention here that my husband wouldn’t leave a work device unlocked and unattended like this. This is a personal device.