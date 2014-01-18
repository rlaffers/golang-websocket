package main

import (
	"fmt"
	"github.com/gorilla/websocket"
	"net/http"
	"os"
)

func main() {
	if len(os.Args) != 2 {
		fmt.Println("Usage: wstelnet port")
		os.Exit(0)
	}

	port := os.Args[1]
	fmt.Println("Serving web on port", port)
	service := ":" + port

	// http.Handle("/script/", http.FileServer(http.Dir(".")))
	// http.Handle("/css/", http.FileServer(http.Dir(".")))
	http.Handle("/", http.FileServer(http.Dir(".")))
	http.Handle("/websocket/", websocket.Handler(ProcessSocket))
	err := http.ListenAndServe(service, nil)
	checkError(err)
}
func checkError(err error) {
	if err != nil {
		fmt.Println("Fatal error ", err.Error())
		os.Exit(1)
	}
}

func ProcessSocket(ws *websocket.Conn) {
	fmt.Println("In ProcessSocket")
	var msg string
	err := websocket.Message.Receive(ws, &msg)
	if err != nil {
		fmt.Println("ProcessSocket: got error", err)
		_ = websocket.Message.Send(ws, "FAIL:"+err.Error())
		return
	}
	fmt.Println("ProcessSocket: got message", msg)
	service := msg
	chr
	tcpAddr, err := net.ResolveTCPAddr("tcp", service)
	if err != nil {
		fmt.Println("Error in ResolveTCPAddr:", err)
		_ = websocket.Message.Send(ws, "FAIL:"+err.Error())
		return
	}

	conn, err := net.DialTCP("tcp", nil, tcpAddr)
	if err != nil {
		fmt.Println("Error in DialTCP:", err)
		_ = websocket.Message.Send(ws, "FAIL:"+err.Error())
		return
	}

	_ = websocket.Message.Send(ws, "SUCC")
	RunTelnet(ws, conn)
}
