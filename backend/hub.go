package main

import (
		"fmt"
)

type hub struct {
	// Registered connections.
	connections map[*connection]bool

	// Inbound messages from the connections.
	broadcast chan []byte

	// Register requests from the connections.
	register chan *connection

	// Unregister requests from connections.
	unregister chan *connection
}

var h = hub{
	broadcast:   make(chan []byte),
	register:    make(chan *connection),
	unregister:  make(chan *connection),
	connections: make(map[*connection]bool),
}

func (h *hub) run() {
	for {
    //fmt.Println("new iteration\n")
		select {
		case c := <-h.register:
				// TODO find IP address of client
				//fmt.Println("registering new connection\n")
				h.connections[c] = true
		case c := <-h.unregister:
				//fmt.Println("unregistering new connection\n")
				delete(h.connections, c)
				close(c.send)
		case m := <-h.broadcast:
				fmt.Println("new message: ", m)
				for c := range h.connections {
						select {
						case c.send <- m:
						default:
								delete(h.connections, c)
								close(c.send)
								go c.ws.Close()
						}
				}
		}
	}
}
