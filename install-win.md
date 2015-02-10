## extramuros installation instructions (Windows 8)

While this install will likely work on Windows XP, Vista, and 7, it has not 
been tested on these systems.

1. Install prerequisites to build the `node-gyp` package on your version of 
Windows. Follow the instructions at https://github.com/TooTallNate/node-gyp. 

2. Clone the extramuros repository:

```
git clone https://github.com/d0kt0r0/extramuros.git
```

3. Use npm (node package manager, installed with node) to install the node 
packages required by extramuros:
```
cd extramuros
npm install
```

That's it for installation - now you are ready to test and play! (see README.md)