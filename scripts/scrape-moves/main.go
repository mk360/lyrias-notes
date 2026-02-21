package main

import (
	"encoding/json"
	"fmt"
	"gbvsr-matchup-notes/common"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"regexp"
)

var frameDataRegex, regexErr = regexp.Compile(`(\n|)<[\/]*.+?>(\n|)`)

type MoveData struct {
	Character    string   `json:"chara"`
	MoveName     string   `json:"name"`
	Input        string   `json:"input"`
	Damage       string   `json:"damage"`
	Guard        string   `json:"guard"`
	Startup      string   `json:"startup"`
	Active       string   `json:"active"`
	Recovery     string   `json:"recovery"`
	OnBlock      string   `json:"onBlock"`
	OnHit        string   `json:"onHit"`
	OnCounterhit string   `json:"onCH"`
	MeterChange  string   `json:"meter"`
	ClashLevel   string   `json:"cls"`
	Images       []string `json:"images"`
}

func main() {
	if regexErr != nil {
		log.Fatalln(regexErr)
	}
	var targetDir = "../../frontend/public/img/moves"
	os.MkdirAll(targetDir, 0644)
	// var movesWaitingGroup sync.WaitGroup
	for _, char := range common.Roster {
		var storedMoveData = []MoveData{}
		var query = url.Values{}
		query.Set("tables", "MoveData_GBVSR")
		query.Set("fields", "name, input, damage, guard, startup, active, recovery, onBlock, onHit, onCH, meter, images")
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
		var cleanedData = frameDataRegex.ReplaceAll(data, []byte(""))
		json.Unmarshal(cleanedData, &storedMoveData)

		for _, move := range storedMoveData {
			move.Images
		}
		os.WriteFile(char+".json", cleanedData, 0644)
	}
}

func downloadMoveImg(url string, filename string, character string) {

}
