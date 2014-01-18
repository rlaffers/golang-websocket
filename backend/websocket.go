package main

import (
  "flag"
  "fmt"
  "log"
  "net/http"
)

var (
    addr      = flag.String("addr", ":8080", "http service address")
)

func main() {
    fmt.Println("Starting websocket server...\n")
    flag.Parse()
    go h.run()
    http.HandleFunc("/", wsHandler)
    if err := http.ListenAndServe(*addr, nil); err != nil {
        log.Fatal("ListenAndServe:", err)
    }
}
