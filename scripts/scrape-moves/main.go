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
	"strings"
	"sync"
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
	var errors = []string{}
	os.MkdirAll(targetDir, 0644)
	var moveImagesWaitingGroup sync.WaitGroup
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
			for _, img := range move.Images {
				moveImagesWaitingGroup.Add(1)
				go downloadMoveImg(targetDir, img, char, &moveImagesWaitingGroup, errors)
			}
		}
		moveImagesWaitingGroup.Wait()
		fmt.Println(errors)
		errors = []string{}
		os.WriteFile(char+".json", cleanedData, 0644)
	}
}

func downloadMoveImg(targetDir string, filename string, character string, wg *sync.WaitGroup, errors []string) {
	var moveDir = targetDir + "/" + character
	os.MkdirAll(moveDir, 0644)
	var strippedFilename = strings.ReplaceAll(filename, "\n", "")
	var fullFilename = strippedFilename
	var _, er = os.Stat(moveDir + "/" + fullFilename)
	if er != nil {
		var filepath = fmt.Sprintf("https://dustloop.com/w/Special:Filepath/%s", strippedFilename)
		var req, err = http.Get(filepath)
		if err != nil {
			log.Fatalln(err)
		}
		var data, _ = io.ReadAll(req.Body)
		err = os.WriteFile(moveDir+"/"+fullFilename, data, 0644)
		if err != nil {
			errors = append(errors, fullFilename)
		}
	}
	wg.Done()
}
