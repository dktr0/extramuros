extramuros installation instructions (Mac OS X)

1. Install, update and check the homebrew package manager (if you don't already have it).  From a terminal window:
```
ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)"
brew update
brew doctor (consider the feedback from brew doctor carefully if you can)
```

2. Use homebrew to install the node.js language and the zeromq networking library:
```
brew install pkg-config
brew install node
brew install zeromq
```
3. Download the extramuros folder and place it somewhere conveniently accessible from your terminal (code below places it in your home folder ~):
```
cd ~
git clone https://github.com/d0kt0r0/extramuros.git
```

4. Use npm (node package manager, installed with node) to install the node packages required by extramuros:
```
cd extramuros
npm install
```

That's it for installation - now you are ready to test and play! (see README.md)
