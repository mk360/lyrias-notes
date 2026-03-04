package main

import (
	"encoding/json"
	"fmt"
	"gbvsr-matchup-notes/common"
	"log"
	"os"
)

func main() {
	var entries, _ = os.ReadDir("../../public/moveset_data")
	for _, entry := range entries {
		var fileContents, _ = os.ReadFile("../../public/moveset_data/" + entry.Name())
		var moveData = []common.MoveData{}
		var sortedMoveData = []common.MoveData{}
		err := json.Unmarshal(fileContents, &moveData)
		if err != nil {
			log.Fatalln(err)
		}
		fmt.Print(moveData)
	}
}
