package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"gbvsr-matchup-notes/common"
	"image/png"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"regexp"
	"strings"
	"sync"

	webp "github.com/HugoSmits86/nativewebp"
)

var frameDataRegex, regexErr = regexp.Compile(`(\s*<[\/]*.+?>)`)
var newlineRegex, _ = regexp.Compile(`\\n`)
var PNGtoWEBPRegex, _ = regexp.Compile(`.png`)

type WEBPGenerationRequest struct {
	FileData     []byte
	FullFilename string
}

type PNGDownloadRequest struct {
	Filename  string
	Character string
	TargetDir string
}

func getMoveset(character string) ([]byte, []common.MoveData) {
	var storedMoveData = []common.MoveData{}
	var query = url.Values{}
	query.Set("tables", "MoveData_GBVSR")
	query.Set("fields", "name, input, damage, guard, startup, active, recovery, onBlock, onHit, onCH, meter, images, hitboxes, type")
	query.Set("where", fmt.Sprintf("chara = \"%s\"", character))
	query.Set("limit", "5000")
	query.Set("format", "json")
	query.Set("parse values", "yes")
	var fullUrl = fmt.Sprintf("https://dustloop.com/wiki/index.php?title=Special:CargoExport&%s", query.Encode())
	var req, err = http.Get(fullUrl)
	if err != nil {
		log.Fatalln(err)
	}
	var data, _ = io.ReadAll(req.Body)
	defer req.Body.Close()
	var cleanedData = frameDataRegex.ReplaceAll(data, nil)
	cleanedData = newlineRegex.ReplaceAll(cleanedData, nil)
	json.Unmarshal(cleanedData, &storedMoveData)
	cleanedData = PNGtoWEBPRegex.ReplaceAll(cleanedData, []byte(".webp"))
	return cleanedData, storedMoveData
}

func main() {
	if regexErr != nil {
		log.Fatalln(regexErr)
	}

	var fileDownloadCount = 10
	var fileDownloadWorkers = make(chan PNGDownloadRequest, fileDownloadCount)
	var webpConversionWorkers = make(chan WEBPGenerationRequest, fileDownloadCount*40)
	var characterDownloadWaitingGroup = sync.WaitGroup{}
	var movesTargetDir = "../../public/img/moves"
	var hitboxesTargetDir = "../../public/img/hitboxes"
	os.MkdirAll(movesTargetDir, 0644)
	os.MkdirAll(hitboxesTargetDir, 0644)

	for range fileDownloadCount {
		go func() {
			for downloadRequest := range fileDownloadWorkers {
				var byteData = downloadMoveImg(downloadRequest.TargetDir, downloadRequest.Filename, downloadRequest.Character)
				if byteData != nil {
					var fullFilename = downloadRequest.TargetDir + "/" + downloadRequest.Character + "/" + strings.Replace(downloadRequest.Filename, ".png", ".webp", 1)
					var conversionRequest = WEBPGenerationRequest{
						FullFilename: fullFilename,
						FileData:     byteData,
					}
					webpConversionWorkers <- conversionRequest
				}
				characterDownloadWaitingGroup.Done()
			}
		}()
		go func() {
			for conversionRequest := range webpConversionWorkers {
				convertToWebp(conversionRequest.FileData, conversionRequest.FullFilename)
			}
		}()
	}
	defer close(fileDownloadWorkers)
	defer close(webpConversionWorkers)

	for _, char := range common.Roster {
		var rawMovesetBytes, moveset = getMoveset(char)
		var movesetPath = "../../src/moveset_data/"
		os.WriteFile(movesetPath+char+".json", rawMovesetBytes, 0644)
		for j, move := range moveset {
			for i, pngImg := range move.Images {
				moveset[j].Images[i] = strings.Replace(pngImg, ".png", ".webp", 1)
				var downloadRequest = PNGDownloadRequest{
					Filename:  pngImg,
					Character: char,
					TargetDir: movesTargetDir,
				}
				characterDownloadWaitingGroup.Add(1)
				fileDownloadWorkers <- downloadRequest
			}

			for i, pngImg := range move.Hitboxes {
				moveset[j].Hitboxes[i] = strings.Replace(pngImg, ".png", ".webp", 1)
				var downloadRequest = PNGDownloadRequest{
					Filename:  pngImg,
					Character: char,
					TargetDir: hitboxesTargetDir,
				}
				characterDownloadWaitingGroup.Add(1)
				fileDownloadWorkers <- downloadRequest
			}
		}
	}
	characterDownloadWaitingGroup.Wait()
}

func downloadMoveImg(targetDir string, filename string, character string) []byte {
	var moveDir = targetDir + "/" + character
	os.MkdirAll(moveDir, 0644)
	var strippedFilename = strings.ReplaceAll(filename, "\n", "")
	var movePath = moveDir + "/" + strippedFilename
	var webpFilepath = strings.Replace(movePath, ".png", ".webp", 1)
	var _, er = os.Stat(webpFilepath)
	if os.IsNotExist(er) {
		var filepath = fmt.Sprintf("https://dustloop.com/w/Special:Filepath/%s", strippedFilename)
		var req, err = http.Get(filepath)
		if err != nil {
			log.Fatalln(err)
		}
		var data, _ = io.ReadAll(req.Body)
		return data
	}

	return nil
}

func convertToWebp(pngData []byte, filepath string) error {
	img, err := png.Decode(bytes.NewReader(pngData))

	if err != nil {
		log.Println("Unable to decode file destined for path " + filepath)
		os.WriteFile(filepath, pngData, 044)
		return nil
	}

	var fileHandle, _ = os.Create(filepath)
	defer fileHandle.Close()

	err = webp.Encode(fileHandle, img, nil)
	if err != nil {
		log.Fatalln(err)
	}
	return nil
}
