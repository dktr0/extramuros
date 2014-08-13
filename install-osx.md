extramuros installation instructions (Mac OS X)

1. Install, update and check the homebrew package manager (if you don't already have it).  From a terminal window:
ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)"
brew update
brew doctor (consider the feedback from brew doctor carefully if you can)

2. Use homebrew to install the node.js language and the zeromq networking library:
brew install node
brew install zeromq

3. Use npm (node package manager, installed with node) to install the following node packages:
npm install express -g
npm install coffee-script -g
npm install zmq -g
npm install share@"0.6.3" -g

4. Download the extramuros folder and place it somewhere conveniently accessible from your terminal:
cd ~
git clone https://github.com/d0kt0r0/extramuros.git

That's it for installation - now you are ready to test and play! (see README.md)
