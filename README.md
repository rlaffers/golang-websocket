# GoChat

This is a proof of concept project implementing simple chat over websockets in Go.
The project is heavily inspired by [Gary Burd](http://gary.burd.info/go-websocket-chat).

# Installation

Copy the public/ directory to your web server's document root or create a symlink.

```bash
git clone https://github.com/rlaffers/golang-websocket.git
cp -R golang-websocket.git/public /var/www/go-chat
# or create a symlink
ln -s golang-websocket.git/public /var/www/go-chat
```

# Usage
Start the websocket server:

```bash
bin/backend
```

Navigate to http://localhost/go-chat in your browser and have fun.

# Development

To recompile the websocket server, following requirements must be met:

* Go 1.2
* Websocket library from [Gorilla Toolkit](http://www.gorillatoolkit.org/)

```bash
go get github.com/gorilla/websocket
```

# Authors
* [Druid33](https://github.com/druid33)
* [rlaffers](https://github.com/rlaffers)

# Credits
* [Gary Burd](http://gary.burd.info/)




