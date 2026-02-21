package main

import (
	"fmt"
	"gbvsr-matchup-notes/common"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"regexp"
	"strings"
)

var frameDataRegex, regexErr = regexp.Compile(`<[\/]*.+?>`)

func main() {
	if regexErr != nil {
		log.Fatalln(regexErr)
	}
	// var targetDir = "../../frontend/public/img"
	os.MkdirAll("../../frontend/public/img/moves", 0644)
	// var movesWaitingGroup sync.WaitGroup
	for _, char := range common.Roster {
		// var storedMoveData = []map[string]string{}
		var query = url.Values{}
		// query.Set("title", "Special:CargoQuery")
		query.Set("tables", "MoveData_GBVSR")
		query.Set("fields", "name, input, damage, guard, startup, active, recovery, onBlock, onHit, onCH, meter")
		query.Set("where", fmt.Sprintf("chara = \"%s\"", char))
		query.Set("limit", "5000")
		query.Set("format", "json")
		query.Set("parse values", "yes")
		var fullUrl = fmt.Sprintf("https://dustloop.com/wiki/index.php?title=Special:CargoExport&%s", query.Encode())
		var req, err = http.Get(fullUrl)
		if err != nil {
			log.Fatalln(err)
		}
		var data, _ = io.ReadAll(req.Body)
		var regexedData = frameDataRegex.ReplaceAll(data, []byte(""))
		cleanedData := strings.ReplaceAll(string(regexedData), `\n`, "")
		os.WriteFile(char+".json", []byte(cleanedData), 0644)
	}
}
