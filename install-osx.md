extramuros installation instructions (Mac OS X)

1. Install the node.js language by downloading a package from https://nodejs.org/en/download/

2. Download the extramuros folder and place it somewhere conveniently accessible from your terminal (code below places it in your home folder ~):
```
cd ~
git clone https://github.com/d0kt0r0/extramuros.git
```

If you haven't used git before on the machine you may be prompted to install developer tools / agree to the Xcode license agreement, etc. If you follow those prompts/instructions, you'll then be able to do the instructions above and have them work.

3. Use npm (node package manager, installed with node) to install the node packages required by extramuros:
```
cd extramuros
npm install
```

That's it for installation - now you are ready to test and play! (see README.md)
