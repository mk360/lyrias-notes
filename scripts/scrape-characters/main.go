package main

import (
	"fmt"
	"gbvsr-matchup-notes/common"
	"io"
	"net/http"
	"os"
	"strings"
	"sync"
)

var targetDir = "../../frontend/src/assets"

func main() {
	var portraitWaitingGroup sync.WaitGroup
	for _, char := range common.Roster {
		if !strings.Contains(char, "(EX)") {
			portraitWaitingGroup.Add(1)
			go func(c string) {
				defer portraitWaitingGroup.Done()
				byteData := downloadPortrait(c)
				var portraitPath = targetDir + "/characters/"
				os.WriteFile(fmt.Sprintf("%s.png", portraitPath+char), byteData, 0644)
			}(char)
		}
	}
	portraitWaitingGroup.Wait()

	var characterSelectWaitingGroup sync.WaitGroup
	for _, char := range common.Roster {
		if !strings.Contains(char, "(EX)") {
			characterSelectWaitingGroup.Add(1)
			go func(c string) {
				defer characterSelectWaitingGroup.Done()
				byteData := downloadCharacterSelect(c)
				var characterSelect = targetDir + "/character_select/"
				err := os.WriteFile(fmt.Sprintf("%s.png", characterSelect+char), byteData, 0644)
				fmt.Println(err)
			}(char)
		}
	}
	characterSelectWaitingGroup.Wait()
}

func downloadPortrait(character string) []byte {
	req, _ := http.Get(fmt.Sprintf("https://dustloop.com/w/Special:Filepath/GBVSR_%s_Portrait.png", character))
	var byteData, _ = io.ReadAll(req.Body)
	return byteData
}

func downloadCharacterSelect(character string) []byte {
	req, _ := http.Get(fmt.Sprintf("https://dustloop.com/w/Special:Filepath/GBVSR_%s_CharacterSelect.png", character))
	var byteData, _ = io.ReadAll(req.Body)
	return byteData
}
